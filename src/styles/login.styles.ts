import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    backgroundColor: '#eeeeee',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  header: {
    backgroundColor: '#D71920',
    paddingVertical: 24,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 38,
    fontWeight: 'bold',
  },
  content: {
    padding: 24,
  },
  input: {
    height: 64,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 18,
    marginBottom: 16,
    fontSize: 16,
    color: '#222222',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: '#555',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#D71920',
    borderColor: '#D71920',
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
  },
  optionText: {
    color: '#222222',
    fontSize: 14,
  },
  link: {
    color: '#0000ee',
    fontSize: 14,
  },
  loginButton: {
    height: 58,
    backgroundColor: '#D71920',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    flexWrap: 'wrap',
  },
  registerText: {
    color: '#222222',
    fontSize: 14,
  },
});

export default styles;
