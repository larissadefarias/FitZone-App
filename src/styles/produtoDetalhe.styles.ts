import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  topo: {
    height: 70,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
  },

  tituloTopo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },

  botaoIcone: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  imagemContainer: {
    height: 330,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },

  imagem: {
    width: "85%",
    height: "85%",
    resizeMode: "contain",
  },

  conteudo: {
    padding: 22,
  },

  categoria: {
    fontSize: 13,
    color: "#e52323",
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  nome: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 6,
  },

  avaliacao: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  nota: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333333",
    marginLeft: 6,
  },

  avaliacoes: {
    fontSize: 13,
    color: "#888888",
    marginLeft: 7,
  },

  preco: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#111111",
    marginTop: 15,
  },

  linha: {
    height: 1,
    backgroundColor: "#ffffff",
    marginVertical: 22,
  },

  tituloSecao: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 18,
    marginBottom: 10,
  },

  descricao: {
    fontSize: 15,
    lineHeight: 23,
    color: "#666666",
  },

  opcoes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  opcao: {
    minWidth: 55,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ffffff",
    alignItems: "center",
  },

  textoOpcao: {
    color: "#555555",
    fontWeight: "600",
  },

  caracteristica: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  textoCaracteristica: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 8,
  },

  botaoSacola: {
    height: 54,
    borderRadius: 15,
    backgroundColor: "#e52323",
    marginTop: 28,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  textoBotaoSacola: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  erro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  erroTexto: {
    fontSize: 18,
    color: "#333333",
    marginBottom: 20,
  },

  botaoVoltar: {
    backgroundColor: "#e52323",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },

  textoBotaoVoltar: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default styles;
