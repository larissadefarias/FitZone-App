import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  conteudo: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },

  tituloTopo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },

  perfilTopo: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 25,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e52323',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  avatarTexto: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  nomeUsuario: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111111',
  },

  emailUsuario: {
    fontSize: 14,
    color: '#777777',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },

  cardTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 14,
  },

  linhaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },

  linhaInfoUltima: {
    borderBottomWidth: 0,
  },

  iconeInfo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#e52323',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  textosInfo: {
    flex: 1,
  },

  rotulo: {
    fontSize: 12,
    color: '#888888',
  },

  valor: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginTop: 2,
  },

  atalho: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },

  atalhoUltimo: {
    borderBottomWidth: 0,
  },

  atalhoTexto: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    marginLeft: 14,
  },

  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e52323',
    backgroundColor: '#ffffff',
  },

  botaoSairTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e52323',
  },

  vazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  vazioTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 14,
  },

  vazioTexto: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },

  botaoPrincipal: {
    backgroundColor: '#e52323',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 14,
    marginBottom: 12,
  },

  botaoPrincipalTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  botaoSecundario: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e52323',
    backgroundColor: '#ffffff',
  },

  botaoSecundarioTexto: {
    color: '#e52323',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
