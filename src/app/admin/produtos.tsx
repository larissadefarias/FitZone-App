import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../../services/supabase';

type Produto = {
  id: number;
  nome: string;
  preco: number;
  imagem: string | null;
  descricao: string | null;
  categorias: string | null;
};

const vermelho = '#e52323';
const textoEscuro = '#222';
const cinza = '#666';

export default function GerenciarProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editPreco, setEditPreco] = useState('');
  const [editCategoria, setEditCategoria] = useState('');
  const [editImagem, setEditImagem] = useState('');
  const [editDescricao, setEditDescricao] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoPreco, setNovoPreco] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('');
  const [novaImagem, setNovaImagem] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [cadastrando, setCadastrando] = useState(false);
  const [cadastroModalVisivel, setCadastroModalVisivel] = useState(false);

  async function carregarProdutos() {
    setCarregando(true);

    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('id, nome, preco, imagem, descricao, categorias')
        .order('id', { ascending: true });

      console.log('Produtos retornados:', data?.length);
      console.log('Erro do Supabase:', error);

      if (error) {
        console.error('Erro ao carregar produtos:', error.message);
        Alert.alert('Erro', `Não foi possível carregar os produtos: ${error.message}`);
        return;
      }

      setProdutos((data ?? []) as Produto[]);
    } catch (erro) {
      console.error('Erro inesperado ao carregar produtos:', erro);
      Alert.alert('Erro', 'Ocorreu um erro inesperado ao carregar os produtos.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    void carregarProdutos();
  }, []);

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase();

    if (!termo) return produtos;

    return produtos.filter((produto) =>
      `${produto.nome ?? ''} ${produto.categorias ?? ''}`
        .toLocaleLowerCase()
        .includes(termo)
    );
  }, [produtos, busca]);

  function abrirEdicao(produto: Produto) {
    setProdutoEditando(produto);
    setEditNome(produto.nome ?? '');
    setEditPreco(String(produto.preco ?? ''));
    setEditCategoria(produto.categorias ?? '');
    setEditImagem(produto.imagem ?? '');
    setEditDescricao(produto.descricao ?? '');
  }

  function fecharEdicao() {
    if (!salvando) setProdutoEditando(null);
  }

  async function salvarProduto() {
    if (!produtoEditando) return;

    const nome = editNome.trim();
    const precoTexto = editPreco.trim().replace(',', '.');
    const preco = Number(precoTexto);
    const categorias = editCategoria.trim();

    if (!nome) {
      Alert.alert('Verifique', 'O nome do produto não pode ficar vazio.');
      return;
    }

    if (!precoTexto || !Number.isFinite(preco) || preco < 0) {
      Alert.alert('Verifique', 'Digite um preço válido, como 89,90.');
      return;
    }

    if (!categorias) {
      Alert.alert('Verifique', 'Digite a categoria do produto.');
      return;
    }

    setSalvando(true);

    try {
      const { error } = await supabase
        .from('produtos')
        .update({
          nome,
          preco,
          categorias,
          imagem: editImagem.trim() || null,
          descricao: editDescricao.trim() || null,
        })
        .eq('id', produtoEditando.id);

      if (error) {
        console.error('Erro ao salvar produto:', error.message);
        Alert.alert('Erro ao salvar', `Não foi possível salvar as alterações: ${error.message}`);
        return;
      }

      setProdutoEditando(null);
      await carregarProdutos();
      Alert.alert('Sucesso', 'Produto atualizado!');
    } catch (erro) {
      console.error('Erro inesperado ao salvar produto:', erro);
      Alert.alert('Erro', 'Ocorreu um erro inesperado ao salvar o produto.');
    } finally {
      setSalvando(false);
    }
  }

  async function executarExclusao(produto: Produto) {
    const { data, error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', produto.id)
      .select('id');

    if (error) {
      console.error('Erro ao excluir produto:', error.message);
      Alert.alert('Erro', `Não foi possível excluir o produto: ${error.message}`);
      return;
    }

    if (!data || data.length === 0) {
      Alert.alert(
        'Produto não excluído',
        'O Supabase não removeu o produto. Verifique as permissões da tabela.'
      );
      return;
    }

    setProdutoEditando(null);
    await carregarProdutos();
    Alert.alert('Sucesso', 'Produto excluído com sucesso!');
  }

  function excluirProduto(produto: Produto) {
    const confirmar = () => {
      void executarExclusao(produto).catch((erro) => {
        console.error('Erro inesperado ao excluir:', erro);
        Alert.alert('Erro', 'Ocorreu um erro inesperado ao excluir o produto.');
      });
    };

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' &&
          window.confirm(`Tem certeza que deseja excluir "${produto.nome}"? Essa ação não pode ser desfeita.`)) {
        confirmar();
      }
      return;
    }

    Alert.alert(
      'Excluir produto',
      `Tem certeza que deseja excluir "${produto.nome}"? Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: confirmar },
      ]
    );
  }

  async function cadastrarProduto() {
    const nome = novoNome.trim();
    const precoTexto = novoPreco.trim().replace(',', '.');
    const preco = Number(precoTexto);
    const categorias = novaCategoria.trim();

    if (!nome) {
      Alert.alert('Verifique', 'Digite o nome do produto.');
      return;
    }

    if (!precoTexto || !Number.isFinite(preco) || preco < 0) {
      Alert.alert('Verifique', 'Digite um preço válido, como 89,90.');
      return;
    }

    if (!categorias) {
      Alert.alert('Verifique', 'Digite a categoria do produto.');
      return;
    }

    setCadastrando(true);

    try {
      const { error } = await supabase.from('produtos').insert({
        nome,
        preco,
        categorias,
        imagem: novaImagem.trim() || null,
        descricao: novaDescricao.trim() || null,
      });

      if (error) {
        console.error('Erro ao cadastrar produto:', error.message);
        Alert.alert('Erro ao cadastrar', `Não foi possível cadastrar o produto: ${error.message}`);
        return;
      }

      setNovoNome('');
      setNovoPreco('');
      setNovaCategoria('');
      setNovaImagem('');
      setNovaDescricao('');
      setCadastroModalVisivel(false);

      await carregarProdutos();
      Alert.alert('Sucesso', 'Produto cadastrado!');
    } catch (erro) {
      console.error('Erro inesperado ao cadastrar produto:', erro);
      Alert.alert('Erro', 'Ocorreu um erro inesperado ao cadastrar o produto.');
    } finally {
      setCadastrando(false);
    }
  }

  function campo(
    label: string,
    value: string,
    onChangeText: (value: string) => void,
    placeholder: string,
    options?: { multiline?: boolean; decimal?: boolean }
  ) {
    return (
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontWeight: '600', color: textoEscuro, marginBottom: 6 }}>
          {label}
        </Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          autoCapitalize="none"
          keyboardType={options?.decimal ? 'decimal-pad' : 'default'}
          multiline={options?.multiline}
          textAlignVertical={options?.multiline ? 'top' : 'center'}
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 9,
            padding: 12,
            color: textoEscuro,
            backgroundColor: '#fff',
            minHeight: options?.multiline ? 90 : 44,
          }}
        />
      </View>
    );
  }

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color={vermelho} />
        <Text style={{ marginTop: 12, color: cinza }}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
        >
          <Ionicons name="arrow-back" size={24} color={vermelho} />
          <Text style={{ marginLeft: 8, fontSize: 16, color: textoEscuro }}>
            Voltar ao painel
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 27, fontWeight: 'bold', color: textoEscuro }}>
          Gerenciar produtos
        </Text>
        <Text style={{ color: cinza, marginTop: 6, marginBottom: 18 }}>
          Busque um produto e edite os detalhes em uma janela, sem deixar a lista.
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderColor: '#ddd',
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 12,
            marginBottom: 20,
          }}
        >
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar por nome ou categoria..."
            autoCapitalize="none"
            style={{ flex: 1, padding: 12, color: textoEscuro }}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')} accessibilityLabel="Limpar busca">
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={() => setCadastroModalVisivel(true)}
          activeOpacity={0.8}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#f0caca',
            borderRadius: 14,
            padding: 16,
            marginBottom: 22,
            gap: 12,
          }}
        >
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              backgroundColor: '#fff0f0',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="add-circle-outline" size={27} color={vermelho} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: textoEscuro }}>
              Cadastrar novo produto
            </Text>
            <Text style={{ color: cinza, fontSize: 12, marginTop: 4 }}>
              Toque aqui para preencher os dados do produto
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={21} color={vermelho} />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ fontSize: 19, fontWeight: 'bold', color: textoEscuro }}>
            Produtos cadastrados
          </Text>
          <Text style={{ color: cinza }}>
            {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'produto' : 'produtos'}
          </Text>
        </View>

        {produtosFiltrados.map((produto) => (
          <View
            key={produto.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#eee',
              borderRadius: 12,
              padding: 12,
              marginBottom: 10,
              gap: 12,
            }}
          >
            {produto.imagem && /^https?:\/\//i.test(produto.imagem) ? (
              <Image
                source={{ uri: produto.imagem }}
                style={{ width: 62, height: 62, borderRadius: 9, backgroundColor: '#f3f3f3' }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ width: 62, height: 62, borderRadius: 9, backgroundColor: '#f8eeee', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="image-outline" size={26} color={vermelho} />
              </View>
            )}

            <View style={{ flex: 1, minWidth: 0 }}>
              <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 16, color: textoEscuro }}>
                {produto.nome}
              </Text>
              <Text numberOfLines={1} style={{ color: cinza, fontSize: 12, marginTop: 3 }}>
                {produto.categorias || 'Sem categoria'} · #{produto.id}
              </Text>
              <Text style={{ color: textoEscuro, fontWeight: '600', marginTop: 5 }}>
                R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => abrirEdicao(produto)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#fff4f4', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 }}
            >
              <Ionicons name="create-outline" size={17} color={vermelho} />
              <Text style={{ color: vermelho, fontWeight: 'bold' }}>Editar</Text>
            </TouchableOpacity>
          </View>
        ))}

        {produtosFiltrados.length === 0 && (
          <View style={{ alignItems: 'center', padding: 28, backgroundColor: '#fff', borderRadius: 12 }}>
            <Ionicons name="search-outline" size={30} color="#aaa" />
            <Text style={{ color: cinza, marginTop: 10 }}>
              {busca ? 'Nenhum produto corresponde à busca.' : 'Nenhum produto cadastrado.'}
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={cadastroModalVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!cadastrando) setCadastroModalVisivel(false);
        }}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <View style={{ width: '100%', maxWidth: 560, maxHeight: '92%', backgroundColor: '#f8f8f8', borderRadius: 16, overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: textoEscuro }}>
                  Cadastrar novo produto
                </Text>
                <Text style={{ color: cinza, marginTop: 3 }}>
                  Preencha os dados do produto
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setCadastroModalVisivel(false)}
                disabled={cadastrando}
                accessibilityLabel="Fechar cadastro"
                style={{ padding: 4 }}
              >
                <Ionicons name="close" size={25} color={textoEscuro} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 18 }} keyboardShouldPersistTaps="handled">
              {campo('Nome', novoNome, setNovoNome, 'Ex.: Tênis de corrida')}
              {campo('Preço (R$)', novoPreco, setNovoPreco, 'Ex.: 199,90', { decimal: true })}
              {campo('Categoria', novaCategoria, setNovaCategoria, 'Ex.: Calçados')}
              {campo('Imagem (URL ou caminho)', novaImagem, setNovaImagem, 'Ex.: tenis1.png')}
              {campo('Descrição', novaDescricao, setNovaDescricao, 'Descreva o produto', { multiline: true })}

              <TouchableOpacity
                disabled={cadastrando}
                onPress={cadastrarProduto}
                style={{ backgroundColor: vermelho, padding: 14, borderRadius: 9, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, opacity: cadastrando ? 0.6 : 1 }}
              >
                {cadastrando ? <ActivityIndicator color="#fff" /> : <Ionicons name="add-circle-outline" size={19} color="#fff" />}
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  {cadastrando ? 'Cadastrando...' : 'Cadastrar produto'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={produtoEditando !== null}
        transparent
        animationType="fade"
        onRequestClose={fecharEdicao}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <View style={{ width: '100%', maxWidth: 560, maxHeight: '92%', backgroundColor: '#f8f8f8', borderRadius: 16, overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: textoEscuro }}>
                  Editar produto
                </Text>
                {produtoEditando && (
                  <Text style={{ color: cinza, marginTop: 3 }}>
                    Produto #{produtoEditando.id}
                  </Text>
                )}
              </View>
              <TouchableOpacity onPress={fecharEdicao} disabled={salvando} accessibilityLabel="Fechar edição" style={{ padding: 4 }}>
                <Ionicons name="close" size={25} color={textoEscuro} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 18 }} keyboardShouldPersistTaps="handled">
              {campo('Nome', editNome, setEditNome, 'Nome do produto')}
              {campo('Preço (R$)', editPreco, setEditPreco, 'Ex.: 89,90', { decimal: true })}
              {campo('Categoria', editCategoria, setEditCategoria, 'Ex.: Calçados')}
              {campo('Imagem (URL ou caminho)', editImagem, setEditImagem, 'URL ou caminho da imagem')}
              {campo('Descrição', editDescricao, setEditDescricao, 'Descrição do produto', { multiline: true })}

              <TouchableOpacity
                disabled={salvando}
                onPress={salvarProduto}
                style={{ backgroundColor: vermelho, padding: 14, borderRadius: 9, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, opacity: salvando ? 0.6 : 1 }}
              >
                {salvando
                  ? <ActivityIndicator color="#fff" />
                  : <Ionicons name="save-outline" size={19} color="#fff" />}
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  {salvando ? 'Salvando...' : 'Salvar alterações'}
                </Text>
              </TouchableOpacity>

              {produtoEditando && (
                <TouchableOpacity
                  disabled={salvando}
                  onPress={() => excluirProduto(produtoEditando)}
                  style={{ borderColor: vermelho, borderWidth: 1, padding: 13, borderRadius: 9, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 10, backgroundColor: '#fff' }}
                >
                  <Ionicons name="trash-outline" size={18} color={vermelho} />
                  <Text style={{ color: vermelho, fontWeight: 'bold' }}>Excluir produto</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
