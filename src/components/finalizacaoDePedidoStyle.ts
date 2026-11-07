import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 25,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 25,
    marginBottom: 15,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },

  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },

  summary: {
    marginTop: 25,
    padding: 18,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },

  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },

  summaryText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },

  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E52323',
    marginTop: 12,
  },

  button: {
    backgroundColor: '#E52323',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 30,
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },

  scroll: {
    flex: 1,
    backgroundColor: '#fff',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
    position: 'relative',
  },

  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalTitle: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },

  modalText: {
    marginTop: 8,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});

export default styles;