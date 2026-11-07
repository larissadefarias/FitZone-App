import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { saveRecentlyViewed } from "../../services/storage";
import {
  addToCart,
  isFavorite,
  toggleFavorite,
} from "../../services/carrinhoSupabase";
import { avisar } from "../../services/aviso";
import styles from '../../styles/produtoDetalhe.styles';
import { supabase } from "../../services/supabase";
import { imagens } from "../../services/imagens";

const opcaoAtiva = { backgroundColor: "#e52323", borderColor: "#e52323" };
const textoAtivo = { color: "#ffffff" };

export default function ProdutoDetalhes() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [favoritado, setFavoritado] = useState(false);
  const [produto, setProduto] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [tamanhoSel, setTamanhoSel] = useState<string | null>(null);
  const [corSel, setCorSel] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) console.log("Erro ao buscar produto:", error.message);
      setProduto(data);

      // Se só existe uma opção, já vem escolhida.
      setTamanhoSel(data?.tamanhos?.length === 1 ? data.tamanhos[0] : null);
      setCorSel(data?.cores?.length === 1 ? data.cores[0] : null);

      setCarregando(false);
    }

    if (id) carregar();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const productId = Number(id);

    isFavorite(productId).then(setFavoritado);
    saveRecentlyViewed(productId);
  }, [id]);

  const handleFavorito = async () => {
    const novoEstado = await toggleFavorite(Number(id));

    if (novoEstado === null) {
      avisar("Atenção", "Entre na sua conta para favoritar produtos.");
      router.push("/login");
      return;
    }

    setFavoritado(novoEstado);
  };

  const handleAdicionarSacola = async () => {
    // O "?." é necessário: esta função é criada antes do produto carregar,
    // e o React Compiler lê essas propriedades logo na primeira renderização.
    const precisaTamanho = (produto?.tamanhos?.length ?? 0) > 0;
    const precisaCor = (produto?.cores?.length ?? 0) > 0;

    if (precisaTamanho && !tamanhoSel) {
      avisar("Atenção", "Escolha um tamanho antes de adicionar ao carrinho.");
      return;
    }

    if (precisaCor && !corSel) {
      avisar("Atenção", "Escolha uma cor antes de adicionar ao carrinho.");
      return;
    }

    const resultado = await addToCart(
      Number(id),
      tamanhoSel ?? "",
      corSel ?? "",
    );

    if (resultado === "login") {
      avisar("Atenção", "Entre na sua conta para adicionar produtos ao carrinho.");
      router.push("/login");
      return;
    }

    if (resultado === "erro") {
      avisar("Erro", "Não foi possível adicionar ao carrinho. Tente novamente.");
      return;
    }

    router.push("/carrinho");
  };

  if (carregando) {
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        size="large"
        color="#e52323"
      />
    );
  }

  if (!produto) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.erro}>
          <Text style={styles.erroTexto}>Produto não encontrado.</Text>

          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => router.back()}
          >
            <Text style={styles.textoBotaoVoltar}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topo}>
          <TouchableOpacity
            style={styles.botaoIcone}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>

          <Text style={styles.tituloTopo}>Detalhes do produto</Text>

          <TouchableOpacity style={styles.botaoIcone} onPress={handleFavorito}>
            <Ionicons
              name={favoritado ? 'heart' : 'heart-outline'}
              size={24}
              color="#e52323"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.imagemContainer}>
          <Image
            source={
              produto.imagem?.startsWith("http")
                ? { uri: produto.imagem }
                : imagens[produto.imagem]
            }
            style={styles.imagem}
          />
        </View>

        <View style={styles.conteudo}>
          <Text style={styles.categoria}>
            {produto.categorias
              ?.split(",")
              .map((c: string) => c.trim())
              .join(" • ")}
          </Text>

          <Text style={styles.nome}>{produto.nome}</Text>

          <View style={styles.avaliacao}>
            <Ionicons name="star" size={18} color="#f4b400" />
            <Text style={styles.nota}>{produto.avaliacao?.toFixed(1)}</Text>
            {produto.num_avaliacoes > 0 && (
              <Text style={styles.avaliacoes}>
                {produto.num_avaliacoes} avaliações
              </Text>
            )}
          </View>

          <Text style={styles.preco}>
            {Number(produto.preco).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>

          <View style={styles.linha} />

          <Text style={styles.tituloSecao}>Descrição</Text>
          <Text style={styles.descricao}>{produto.descricao}</Text>

          {produto.tamanhos?.length > 0 && (
            <>
              <Text style={styles.tituloSecao}>Tamanho</Text>

              <View style={styles.opcoes}>
                {produto.tamanhos.map((tamanho: string) => (
                  <TouchableOpacity
                    key={tamanho}
                    style={[styles.opcao, tamanhoSel === tamanho && opcaoAtiva]}
                    onPress={() => setTamanhoSel(tamanho)}
                  >
                    <Text
                      style={[
                        styles.textoOpcao,
                        tamanhoSel === tamanho && textoAtivo,
                      ]}
                    >
                      {tamanho}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {produto.cores?.length > 0 && (
            <>
              <Text style={styles.tituloSecao}>Cor</Text>

              <View style={styles.opcoes}>
                {produto.cores.map((cor: string) => (
                  <TouchableOpacity
                    key={cor}
                    style={[styles.opcao, corSel === cor && opcaoAtiva]}
                    onPress={() => setCorSel(cor)}
                  >
                    <Text
                      style={[styles.textoOpcao, corSel === cor && textoAtivo]}
                    >
                      {cor}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {produto.caracteristicas?.length > 0 && (
            <>
              <Text style={styles.tituloSecao}>Características</Text>

              {produto.caracteristicas.map((caracteristica: string) => (
                <View key={caracteristica} style={styles.caracteristica}>
                  <Ionicons
                    name="checkmark-circle"
                    size={19}
                    color="#e52323"
                  />
                  <Text style={styles.textoCaracteristica}>
                    {caracteristica}
                  </Text>
                </View>
              ))}
            </>
          )}

          <TouchableOpacity style={styles.botaoSacola} onPress={handleAdicionarSacola}>
            <Ionicons name="bag-outline" size={21} color="#ffffff" />
            <Text style={styles.textoBotaoSacola}>
              Adicionar à sacola
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
