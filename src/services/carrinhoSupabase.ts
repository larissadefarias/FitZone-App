import { supabase } from './supabase';

export type CartItem = {
  id: number; // id da LINHA do carrinho (carrinho_itens.id)
  produtoId: number;
  nome: string;
  preco: number;
  imagem: string | null;
  quantidade: number;
  selecionado: boolean;
  tamanho: string;
  cor: string;
};

export type ProdutoFavorito = {
  id: number;
  nome: string;
  preco: number;
  imagem: string | null;
};

export type DadosEntrega = {
  nome: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  pagamento: string;
};

type Resultado = 'ok' | 'login' | 'erro';

export async function usuarioLogado() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ?? null;
}

// ---------- CARRINHO ----------

export async function getCart(): Promise<CartItem[]> {
  const { data, error } = await supabase
    .from('carrinho_itens')
    .select('id, quantidade, selecionado, tamanho, cor, produtos(id, nome, preco, imagem)')
    .order('created_at');

  if (error) {
    console.log('Erro ao buscar carrinho:', error.message);
    return [];
  }

  return (data ?? []).map((linha: any) => ({
    id: linha.id,
    produtoId: linha.produtos.id,
    nome: linha.produtos.nome,
    preco: Number(linha.produtos.preco),
    imagem: linha.produtos.imagem,
    quantidade: linha.quantidade,
    selecionado: linha.selecionado,
    tamanho: linha.tamanho ?? '',
    cor: linha.cor ?? '',
  }));
}

export async function addToCart(
  produtoId: number,
  tamanho: string = '',
  cor: string = '',
): Promise<Resultado> {
  if (!(await usuarioLogado())) return 'login';

  // O RLS só deixa enxergar as linhas do próprio usuário.
  const { data: existente } = await supabase
    .from('carrinho_itens')
    .select('id, quantidade')
    .eq('produto_id', produtoId)
    .eq('tamanho', tamanho)
    .eq('cor', cor)
    .maybeSingle();

  const { error } = existente
    ? await supabase
        .from('carrinho_itens')
        .update({ quantidade: existente.quantidade + 1, selecionado: true })
        .eq('id', existente.id)
    : await supabase
        .from('carrinho_itens')
        .insert({ produto_id: produtoId, tamanho, cor });

  if (error) {
    console.log('Erro ao adicionar ao carrinho:', error.message);
    return 'erro';
  }
  return 'ok';
}

export async function updateCartItemQuantity(linhaId: number, quantidade: number) {
  const { error } = await supabase
    .from('carrinho_itens')
    .update({ quantidade: Math.max(1, quantidade) })
    .eq('id', linhaId);
  if (error) console.log('Erro ao atualizar quantidade:', error.message);
}

export async function setCartItemSelected(linhaId: number, selecionado: boolean) {
  const { error } = await supabase
    .from('carrinho_itens')
    .update({ selecionado })
    .eq('id', linhaId);
  if (error) console.log('Erro ao selecionar item:', error.message);
}

export async function removeFromCart(linhaId: number) {
  const { error } = await supabase
    .from('carrinho_itens')
    .delete()
    .eq('id', linhaId);
  if (error) console.log('Erro ao remover item:', error.message);
}

// ---------- PEDIDO ----------

export async function finalizarPedido(
  d: DadosEntrega,
): Promise<{ ok: boolean; mensagem?: string }> {
  const { error } = await supabase.rpc('finalizar_pedido', {
    p_nome: d.nome,
    p_telefone: d.telefone,
    p_cep: d.cep,
    p_endereco: d.endereco,
    p_numero: d.numero,
    p_complemento: d.complemento,
    p_pagamento: d.pagamento,
  });

  if (error) {
    console.log('Erro ao finalizar pedido:', error.message);
    return {
      ok: false,
      mensagem: error.message.includes('Carrinho vazio')
        ? 'Seu carrinho está vazio ou sem itens selecionados.'
        : error.message,
    };
  }
  return { ok: true };
}

// ---------- FAVORITOS ----------

export async function isFavorite(produtoId: number): Promise<boolean> {
  const { data } = await supabase
    .from('favoritos')
    .select('produto_id')
    .eq('produto_id', produtoId)
    .maybeSingle();
  return !!data;
}

// Devolve o novo estado (true = favoritado) ou null se não estiver logado.
export async function toggleFavorite(produtoId: number): Promise<boolean | null> {
  if (!(await usuarioLogado())) return null;

  if (await isFavorite(produtoId)) {
    await supabase.from('favoritos').delete().eq('produto_id', produtoId);
    return false;
  }

  const { error } = await supabase.from('favoritos').insert({ produto_id: produtoId });
  if (error) {
    console.log('Erro ao favoritar:', error.message);
    return false;
  }
  return true;
}

export async function getFavoritosComProduto(): Promise<ProdutoFavorito[]> {
  const { data, error } = await supabase
    .from('favoritos')
    .select('created_at, produtos(id, nome, preco, imagem)')
    .order('created_at', { ascending: false });

  if (error) {
    console.log('Erro ao buscar favoritos:', error.message);
    return [];
  }

  return (data ?? []).map((linha: any) => ({
    id: linha.produtos.id,
    nome: linha.produtos.nome,
    preco: Number(linha.produtos.preco),
    imagem: linha.produtos.imagem,
  }));
}