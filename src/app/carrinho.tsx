import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import styles from '../styles/carrinho.styles';
import { avisar } from '../services/aviso';
import { fonteImagem } from '../services/imagens';
import {
  CartItem,
  getCart,
  removeFromCart,
  setCartItemSelected,
  updateCartItemQuantity,
  usuarioLogado,
} from '../services/carrinhoSupabase';

// Mantenha igual ao valor "c_gratis_acima" da função calcular_frete no banco.
const FRETE_GRATIS_ACIMA = 299;

const moeda = (valor: number) => `R$ ${valor.toFixed(2).replace('.', ',')}`;

export default function Carrinho() {
  const [itens, setItens] = useState<CartItem[]>([]);
  const [logado, setLogado] = useState(true);
  const [carregando, setCarregando] = useState(true);

  // A tela continua montada dentro das abas: recarrega sempre que ganha foco.
  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregar() {
        setCarregando(true);

        const user = await usuarioLogado();
        if (!user) {
          if (ativo) {
            setLogado(false);
            setItens([]);
            setCarregando(false);
          }
          return;
        }

        const lista = await getCart();
        if (ativo) {
          setLogado(true);
          setItens(lista);
          setCarregando(false);
        }
      }

      carregar();

      return () => {
        ativo = false;
      };
    }, []),
  );

  const subtotal = useMemo(
    () =>
      itens
        .filter((item) => item.selecionado)
        .reduce((soma, item) => soma + item.preco * item.quantidade, 0),
    [itens],
  );

  // Acima do valor mínimo o frete é grátis para qualquer CEP.
  // Abaixo dele, o valor só é conhecido depois que o CEP é informado na finalização.
  const freteGratis = subtotal >= FRETE_GRATIS_ACIMA;

  async function alternarSelecao(item: CartItem) {
    const novo = !item.selecionado;
    setItens((atual) =>
      atual.map((i) => (i.id === item.id ? { ...i, selecionado: novo } : i)),
    );
    await setCartItemSelected(item.id, novo);
  }

  async function alterarQuantidade(item: CartItem, nova: number) {
    if (nova < 1) return;
    setItens((atual) =>
      atual.map((i) => (i.id === item.id ? { ...i, quantidade: nova } : i)),
    );
    await updateCartItemQuantity(item.id, nova);
  }

  async function remover(item: CartItem) {
    setItens((atual) => atual.filter((i) => i.id !== item.id));
    await removeFromCart(item.id);
  }

  function finalizar() {
    if (!itens.some((item) => item.selecionado)) {
      avisar('Atenção', 'Marque pelo menos um item para finalizar a compra.');
      return;
    }
    router.push('/finalizacaoDePedido');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()}>
        <Text style={styles.botaoVoltarTexto}>Voltar</Text>
      </TouchableOpacity>

      <ScrollView>
        <Text style={styles.titulo}>Meu Carrinho</Text>

        {carregando ? (
          <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#e52323" />
        ) : !logado ? (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#555', textAlign: 'center' }}>
              Entre na sua conta para ver o seu carrinho.
            </Text>
            <TouchableOpacity
              style={[styles.finalizar, { alignSelf: 'stretch', marginTop: 20 }]}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.finalizarTexto}>Entrar</Text>
            </TouchableOpacity>
          </View>
        ) : itens.length === 0 ? (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#555', textAlign: 'center' }}>
              Seu carrinho está vazio.
            </Text>
            <TouchableOpacity
              style={[styles.finalizar, { alignSelf: 'stretch', marginTop: 20 }]}
              onPress={() => router.push('/produtos')}
            >
              <Text style={styles.finalizarTexto}>Explorar produtos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {itens.map((item) => (
              <View key={item.id} style={styles.produto}>
                <TouchableOpacity
                  style={styles.checkboxArea}
                  onPress={() => alternarSelecao(item)}
                >
                  <View
                    style={[styles.checkbox, item.selecionado && styles.checkboxChecked]}
                  >
                    {item.selecionado && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>

                <Image
                  source={fonteImagem(item.imagem)}
                  style={styles.imagem}
                  resizeMode="contain"
                />

                <View style={styles.informacoes}>
                  <Text style={styles.nome}>{item.nome}</Text>

                  {!!(item.tamanho || item.cor) && (
                    <Text style={{ color: '#777', marginTop: 2 }}>
                      {[
                        item.tamanho ? `Tam: ${item.tamanho}` : '',
                        item.cor ? `Cor: ${item.cor}` : '',
                      ]
                        .filter(Boolean)
                        .join(' • ')}
                    </Text>
                  )}

                  <Text style={styles.preco}>{moeda(item.preco)}</Text>

                  <View style={styles.quantidadeContainer}>
                    <TouchableOpacity
                      style={styles.botaoQuantidade}
                      onPress={() => alterarQuantidade(item, item.quantidade - 1)}
                    >
                      <Text style={styles.botaoTexto}>−</Text>
                    </TouchableOpacity>

                    <Text style={styles.quantidade}>{item.quantidade}</Text>

                    <TouchableOpacity
                      style={styles.botaoQuantidade}
                      onPress={() => alterarQuantidade(item, item.quantidade + 1)}
                    >
                      <Text style={styles.botaoTexto}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity onPress={() => remover(item)}>
                    <Text style={{ color: '#e52323', marginTop: 8 }}>Remover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.resumo}>
              <Text style={styles.resumoTitulo}>Resumo da compra</Text>

              <View style={styles.linha}>
                <Text>Subtotal</Text>
                <Text>{moeda(subtotal)}</Text>
              </View>

              <View style={styles.linha}>
                <Text>Frete</Text>
                <Text>{freteGratis ? 'Grátis' : 'Calculado na finalização'}</Text>
              </View>

              <View style={styles.linhaTotal}>
                <Text style={styles.totalTexto}>
                  {freteGratis ? 'Total' : 'Total (sem frete)'}
                </Text>
                <Text style={styles.totalValor}>{moeda(subtotal)}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.finalizar} onPress={finalizar}>
              <Text style={styles.finalizarTexto}>Finalizar compra</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}
