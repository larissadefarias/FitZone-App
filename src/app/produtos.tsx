import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  router,
  useLocalSearchParams,
  useFocusEffect,
} from "expo-router";

import { getRecentlyViewed } from "../services/storage";

import styles from "../styles/produtos.styles";
import { categorias as categoriasLocais } from "../data/produtos";
import { supabase } from "../services/supabase";
import { imagens as imagensProdutos } from "../services/imagens";

export default function Produtos() {
  const { categoria } = useLocalSearchParams<{ categoria?: string }>();

  const [categoriaSelecionada, setCategoriaSelecionada] = useState(
    categoria || "Todos"
  );

  const [busca, setBusca] = useState("");
  const [produtosBanco, setProdutosBanco] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  
useEffect(() => {
  async function carregarProdutos() {
  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .order("id", { ascending: true });

  console.log("Produtos recebidos do Supabase:", data);
  console.log("Erro do Supabase:", error);

  if (error) {
    console.error("Erro ao carregar produtos:", error.message);
    setCarregando(false);
    return;
  }


    setProdutosBanco(
  (data ?? []).map((produto) => ({
    ...produto,
    imagem:
      typeof produto.imagem === "string"
        ? imagensProdutos[produto.imagem] ?? null
        : produto.imagem,
    preco: `R$ ${Number(produto.preco).toFixed(2).replace(".", ",")}`,
    categorias: String(produto.categorias)
      .split(",")
      .map((categoria) => categoria.trim()),
  }))
);

    setCarregando(false);
  }

  carregarProdutos();
}, []);


  const [filtroAberto, setFiltroAberto] = useState(false);

  const [produtoRecente, setProdutoRecente] = useState<any | null>(null);

  // A tela continua montada: atualiza o filtro quando a categoria recebida muda
  useEffect(() => {
    setCategoriaSelecionada(categoria || "Todos");
  }, [categoria]);

  useFocusEffect(
  useCallback(() => {
    const idRecente = getRecentlyViewed();

    const encontrado =
      idRecente == null
        ? null
        : produtosBanco.find(
    (produto) => produto.id === idRecente
  ) ?? null;

    setProdutoRecente(encontrado);
  }, [produtosBanco])
);

  const produtosFiltrados = produtosBanco.filter((produto) => {
    const correspondeCategoria =
      categoriaSelecionada === "Todos" ||
      produto.categorias.some(
        (cat) =>
          cat.toLowerCase() === categoriaSelecionada.toLowerCase()
      );

    
  const correspondeBusca = String(produto.nome ?? "")
  .toLowerCase()
  .includes(busca.trim().toLowerCase());


    return correspondeCategoria && correspondeBusca;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* CABEÇALHO */}
        <View style={styles.header}>

          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => router.replace('/')}
          >
            <Ionicons
              name="arrow-back"
              size={25}
              color="#ffffff"
            />
          </TouchableOpacity>

          <View>
            <Text style={styles.logo}>
              FitZone
            </Text>

            <Text style={styles.subtitulo}>
              Produtos esportivos
            </Text>
          </View>

          <TouchableOpacity
            style={styles.iconeBotao}
            onPress={() => router.push("/carrinho")}
          >
            <Ionicons
              name="bag-outline"
              size={25}
              color="#ffffff"
            />
          </TouchableOpacity>

        </View>

        {/* PESQUISA */}
        <View style={styles.pesquisaContainer}>

          <Ionicons
            name="search-outline"
            size={21}
            color="#777777"
          />

          <TextInput
            placeholder="Buscar produtos..."
            placeholderTextColor="#888888"
            style={styles.pesquisa}
            value={busca}
            onChangeText={setBusca}
          />

          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color="#999999"
              />
            </TouchableOpacity>
          )}

        </View>

{/* TÍTULO */}
<View style={styles.tituloLinha}>
  <View>
    <Text style={styles.titulo}>
      Todos os produtos
    </Text>

    <Text style={styles.quantidade}>
      {produtosFiltrados.length} produtos encontrados
    </Text>
  </View>

  <TouchableOpacity
    style={styles.filtroBotao}
    onPress={() => setFiltroAberto(!filtroAberto)}
  >
    <Ionicons
      name="options-outline"
      size={20}
      color="#e52323"
    />
  </TouchableOpacity>
</View>

{/* PAINEL DE FILTRO */}
{filtroAberto && (
  <View style={styles.painelFiltro}>
    <Text style={styles.tituloFiltro}>
      Filtrar por categoria
    </Text>

    <View style={styles.opcoesFiltro}>
      {categoriasLocais.map((categoria) => {
        const selecionada =
          categoriaSelecionada === categoria;

        return (
          <TouchableOpacity
            key={categoria}
            style={[
              styles.opcaoFiltro,
              selecionada && styles.opcaoFiltroAtiva,
            ]}
            onPress={() => {
              setCategoriaSelecionada(categoria);
              setFiltroAberto(false);
            }}
          >
            <Text
              style={[
                styles.textoOpcaoFiltro,
                selecionada && styles.textoOpcaoFiltroAtiva,
              ]}
            >
              {categoria}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>

    <TouchableOpacity
      style={styles.botaoLimparFiltro}
      onPress={() => {
        setCategoriaSelecionada("Todos");
        setFiltroAberto(false);
      }}
    >
      <Text style={styles.textoLimparFiltro}>
        Limpar filtro
      </Text>
    </TouchableOpacity>
  </View>
)}

{/* CATEGORIAS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categorias}
        >

          {categoriasLocais.map((categoria) => (
            <TouchableOpacity
              key={categoria}
              style={
                categoriaSelecionada === categoria
                  ? styles.categoriaAtiva
                  : styles.categoria
              }
              onPress={() => setCategoriaSelecionada(categoria)}
            >
              <Text
                style={
                  categoriaSelecionada === categoria
                    ? styles.textoCategoriaAtiva
                    : styles.textoCategoria
                }
              >
                {categoria}
              </Text>
            </TouchableOpacity>
          ))}

        </ScrollView>

        {/* PRODUTOS */}
        {carregando && (
  <Text style={{ textAlign: "center", marginVertical: 20 }}>
    Carregando produtos...
  </Text>
)}
        <View style={styles.gradeProdutos}>

          {produtosFiltrados.map((produto) => (

            <TouchableOpacity
              key={produto.id}
              style={styles.cardProduto}
              activeOpacity={0.85}
              onPress={() =>
                router.push(`/produto/${produto.id}`)
              }
            >

              <View style={styles.imagemContainer}>

                {produto.imagem && (
  <Image
    source={produto.imagem}
    style={styles.imagemProduto}
    resizeMode="contain"
  />
)}

                <View style={styles.favorito}>
                  <Ionicons
                    name="heart-outline"
                    size={20}
                    color="#e52323"
                  />
                </View>

              </View>

              <View style={styles.informacoesProduto}>

                <View style={styles.tagCategoria}>
                  <Text style={styles.textoTag}>
                    {produto.categorias.join(" • ")}
                  </Text>
                </View>

                <Text
                  style={styles.nomeProduto}
                  numberOfLines={2}
                >
                  {produto.nome}
                </Text>

                <View style={styles.avaliacao}>

                  <Ionicons
                    name="star"
                    size={15}
                    color="#f4b400"
                  />

                  <Text style={styles.textoAvaliacao}>
                    {produto.avaliacao}
                  </Text>

                </View>

                <Text style={styles.precoProduto}>
                  {produto.preco}
                </Text>

              </View>

            </TouchableOpacity>

          ))}

        </View>

        {/* NENHUM PRODUTO */}
        {!carregando && produtosFiltrados.length === 0 && (
          <View style={styles.semProdutos}>

            <Ionicons
              name="search-outline"
              size={55}
              color="#cccccc"
            />

            <Text style={styles.semProdutosTitulo}>
              Nenhum produto encontrado
            </Text>

            <Text style={styles.semProdutosTexto}>
              Tente buscar por outro nome ou categoria.
            </Text>

          </View>
        )}

        {/* VOCÊ VIU RECENTEMENTE */}
{produtoRecente && (
  <View
    style={{
      marginHorizontal: 20,
      marginTop: 28,
      marginBottom: 20,
    }}
  >
    <Text
      style={{
        fontSize: 21,
        fontWeight: "bold",
        color: "#222222",
        marginBottom: 14,
      }}
    >
      Você viu recentemente
    </Text>

    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() =>
        router.push(`/produto/${produtoRecente.id}`)
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "#eeeeee",
      }}
    >
      <Image
        source={produtoRecente.imagem}
        style={{
          width: 95,
          height: 95,
          resizeMode: "contain",
        }}
      />

      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: "#222222",
            marginBottom: 8,
          }}
          numberOfLines={2}
        >
          {produtoRecente.nome}
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: "#e52323",
          }}
        >
          {produtoRecente.preco}
        </Text>

        <Text
          style={{
            fontSize: 12,
            color: "#777777",
            marginTop: 8,
          }}
        >
          Toque para ver novamente
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={22}
        color="#888888"
      />
    </TouchableOpacity>
  </View>
)}
        <View style={styles.espacamentoFinal} />


      </ScrollView>
    </SafeAreaView>
  );
}
