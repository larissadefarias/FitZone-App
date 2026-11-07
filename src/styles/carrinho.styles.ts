import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 25,
    color: '#111111',
  },

  botaoVoltar: {
    marginTop: 40,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  botaoVoltarTexto: {
    color: '#e52323',
    fontSize: 16,
    fontWeight: 'bold',
  },

  produto: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e5e9',
    borderRadius: 15,
    padding: 12,
  },

  checkboxArea: {
    marginRight: 12,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  checkboxChecked: {
    backgroundColor: '#e52323',
    borderColor: '#e52323',
  },

  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  imagem: {
    width: 110,
    height: 110,
  },

  informacoes: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },

  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
  },

  preco: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#111111',
  },

  quantidadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  botaoQuantidade: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#eeeeee',
    justifyContent: 'center',
    alignItems: 'center',
  },

  botaoTexto: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  quantidade: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },

  resumo: {
    marginTop: 25,
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#f5f5f5',
  },

  resumoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  linhaTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
  },

  totalTexto: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  totalValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e52323',
  },

  finalizar: {
    backgroundColor: '#e52323',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 30,
  },

  finalizarTexto: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default styles;
