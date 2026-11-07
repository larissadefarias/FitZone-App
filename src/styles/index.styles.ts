import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  header: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },

  logo: {
    fontSize: 35,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#111111',
  },

  logoRed: {
    color: '#e52323',
  },

  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  searchContainer: {
    height: 50,
    marginHorizontal: 20,
    marginBottom: 18,
    borderRadius: 25,
    backgroundColor: '#f1f3f6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },

  banner: {
    marginHorizontal: 20,
    height: 300,
    borderRadius: 20,
    backgroundColor: '#15191b',
    padding: 25,
    justifyContent: 'center',
    overflow: 'hidden',
  },

  bannerTitle: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },

  bannerRed: {
    color: '#e52323',
    fontSize: 30,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 15,
  },

  bannerDescription: {
    color: '#ffffff',
    fontSize: 17,
    lineHeight: 24,
    marginBottom: 20,
  },

  bannerButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },

  bannerButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111111',
  },

  benefits: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 22,
    paddingHorizontal: 10,
  },

  benefit: {
    flex: 1,
    alignItems: 'center',
  },

  benefitIcon: {
    fontSize: 25,
    marginBottom: 8,
    color: '#e52323',
  },

  benefitText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#222222',
    lineHeight: 18,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    marginHorizontal: 20,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#111111',
  },

  seeAll: {
    color: '#e52323',
    fontSize: 15,
    fontWeight: 'bold',
  },

  products: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 20,
  },

  productCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e5e9',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },

  productImage: {
    width: 150,
    height: 140,
    resizeMode: 'contain',
  },

  productName: {
    fontSize: 14,
    color: '#222222',
    paddingHorizontal: 10,
    paddingTop: 10,
  },

  productPrice: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111111',
    paddingHorizontal: 10,
    paddingTop: 5,
  },

  rating: {
    fontSize: 12,
    color: '#777777',
    padding: 10,
  },

  bottomMenu: {
    height: 75,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  bottomItem: {
    alignItems: 'center',
  },

  bottomIcon: {
    fontSize: 23,
    color: '#222222',
  },

  bottomText: {
    fontSize: 11,
    color: '#222222',
    marginTop: 4,
  },

  bottomTextActive: {
    fontSize: 11,
    color: '#e52323',
    fontWeight: 'bold',
    marginTop: 4,
  },

});

export default styles;
