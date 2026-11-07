import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  conteudo: {
    paddingBottom: 35,
  },

  header: {
    backgroundColor: '#e52323',
    paddingHorizontal: 22,
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  logo: {
    color: '#ffffff',
    fontSize: 29,
    fontWeight: 'bold',
  },

  subtitulo: {
    color: '#ffffff',
    fontSize: 13,
    marginTop: 4,
    opacity: 0.9,
  },

  iconeHeader: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tituloContainer: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 20,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222222',
  },

  descricao: {
    fontSize: 14,
    color: '#777777',
    marginTop: 6,
  },

  lista: {
    paddingHorizontal: 18,
  },

  card: {
    height: 155,
    marginBottom: 17,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.14,
    shadowRadius: 6,
  },

  areaTexto: {
    flex: 1,
    padding: 18,
    justifyContent: 'center',
    position: 'relative',
  },

  icone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e52323',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  textos: {
    paddingRight: 4,
  },

  nome: {
    color: '#222222',
    fontSize: 20,
    fontWeight: 'bold',
  },

  descricaoCard: {
    color: '#888888',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },

  seta: {
    position: 'absolute',
    right: 13,
    top: 13,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  areaImagem: {
    width: '42%',
    height: '100%',
    backgroundColor: '#eeeeee',
    overflow: 'hidden',
  },

  imagem: {
    width: '100%',
    height: '100%',
  },
});

export default styles;
