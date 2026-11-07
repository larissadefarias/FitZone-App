import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import styles from '../styles/favoritos.styles';
import { fonteImagem } from '../services/imagens';
import {
  ProdutoFavorito,
  getFavoritosComProduto,
  toggleFavorite,
  usuarioLogado,
} from '../services/carrinhoSupabase';

const moeda = (valor: number) => `R$ ${valor.toFixed(2).replace('.', ',')}`;

export default function Favoritos() {
  const [itens, setItens] = useState<ProdutoFavorito[]>([]);
  const [logado, setLogado] = useState(true);
  const [carregando, setCarregando] = useState(true);

  // A aba continua montada: recarrega sempre que ganha foco
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

        const lista = await getFavoritosComProduto();
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

  async function remover(id: number) {
    setItens((atual) => atual.filter((item) => item.id !== id));
    await toggleFavorite(id);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>

      <ScrollView contentContainerStyle={styles.content}>
        {carregando ? (
          <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#e52323" />
        ) : !logado ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Entre na sua conta para ver seus favoritos.</Text>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          </View>
        ) : itens.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Você ainda não marcou nenhum favorito.</Text>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/produtos')}>
              <Text style={styles.buttonText}>Explorar produtos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          itens.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image
                source={fonteImagem(item.imagem)}
                style={styles.image}
                resizeMode="contain"
              />
              <View style={styles.info}>
                <Text style={styles.productName}>{item.nome}</Text>
                <Text style={styles.price}>{moeda(item.preco)}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => remover(item.id)}
              >
                <Text style={styles.removeText}>Remover</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}