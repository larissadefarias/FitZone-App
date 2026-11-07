import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },

  header: {
    backgroundColor: "#e52323",
    paddingHorizontal: 22,
    paddingVertical: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  botaoVoltar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitulo: {
    color: "#ffffff",
    fontSize: 13,
    marginTop: 3,
  },

  iconeBotao: {
    width: 45,
    height: 45,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },

  pesquisaContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e5e9",
  },

  pesquisa: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#333333",
  },

  tituloLinha: {
    marginHorizontal: 20,
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222222",
  },

  quantidade: {
    fontSize: 13,
    color: "#888888",
    marginTop: 5,
  },

  filtroBotao: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#eeeeee",
  },

  categorias: {
    paddingHorizontal: 20,
    paddingVertical: 22,
    gap: 10,
  },

  categoriaAtiva: {
    backgroundColor: "#e52323",
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 22,
  },

  textoCategoriaAtiva: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  categoria: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#e2e5e9",
  },

  textoCategoria: {
    color: "#666666",
  },

  gradeProdutos: {
    paddingHorizontal: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  cardProduto: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    marginBottom: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },

  imagemContainer: {
    height: 165,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  imagemProduto: {
    width: "88%",
    height: "88%",
    resizeMode: "contain",
  },

  favorito: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },

  informacoesProduto: {
    padding: 13,
  },

  tagCategoria: {
    alignSelf: "flex-start",
    backgroundColor: "#fff0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 7,
  },

  textoTag: {
    color: "#e52323",
    fontSize: 10,
    fontWeight: "bold",
  },

  nomeProduto: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333333",
    minHeight: 38,
  },

  avaliacao: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  textoAvaliacao: {
    fontSize: 12,
    color: "#777777",
    marginLeft: 5,
  },

  precoProduto: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111111",
    marginTop: 9,
  },

  semProdutos: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 70,
  },

  semProdutosTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444444",
    marginTop: 15,
  },

  semProdutosTexto: {
    fontSize: 14,
    color: "#999999",
    marginTop: 6,
    textAlign: "center",
  },

  painelFiltro: {
  marginHorizontal: 20,
  marginTop: 12,
  padding: 16,
  backgroundColor: "#ffffff",
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "#e2e5e9",
},

tituloFiltro: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#222222",
  marginBottom: 14,
},

opcoesFiltro: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 10,
},

opcaoFiltro: {
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 22,
  backgroundColor: "#f7f7f7",
  borderWidth: 1,
  borderColor: "#e2e5e9",
},

opcaoFiltroAtiva: {
  backgroundColor: "#e52323",
  borderColor: "#e52323",
},

textoOpcaoFiltro: {
  fontSize: 13,
  color: "#555555",
},

textoOpcaoFiltroAtiva: {
  color: "#ffffff",
  fontWeight: "bold",
},

botaoLimparFiltro: {
  alignSelf: "flex-end",
  marginTop: 16,
  paddingVertical: 8,
  paddingHorizontal: 12,
},

textoLimparFiltro: {
  color: "#e52323",
  fontWeight: "bold",
  fontSize: 14,
},

  espacamentoFinal: {
    height: 30,
  },

});

export default styles;
