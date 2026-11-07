export const imagens: Record<string, any> = {
  "bermuda1.png": require("../../assets/images/produtos/bermuda1.png"),
  "bola1.png": require("../../assets/images/produtos/bola1.png"),
  "Boné nike.webp": require("../../assets/images/produtos/bone-nike.webp"),
  "calcalegging.png": require("../../assets/images/produtos/calcalegging.png"),
  "camisa1.png": require("../../assets/images/produtos/camisa1.png"),
  "camisavasco.png": require("../../assets/images/produtos/camisavasco.png"),
  "chuteira1.jpeg": require("../../assets/images/produtos/chuteira1.jpeg"),
  "chuteira2.jpg": require("../../assets/images/produtos/chuteira2.jpg"),
  "chuteira3.png": require("../../assets/images/produtos/chuteira3.png"),
  "conjunto1.jpg": require("../../assets/images/produtos/conjunto1.jpg"),
  "luvas.jpg": require("../../assets/images/produtos/luvas.jpg"),
  "luvas2.jpg": require("../../assets/images/produtos/luvas2.jpg"),
  "mochila1.jpg": require("../../assets/images/produtos/mochila1.jpg"),
  "mochila2.jpg": require("../../assets/images/produtos/mochila2.jpg"),
  "tapete.jpg": require("../../assets/images/produtos/tapete.jpg"),
  "tenis1.png": require("../../assets/images/produtos/tenis1.png"),
  "tenis2.jpg": require("../../assets/images/produtos/tenis2.jpg"),
};

export function fonteImagem(nome?: string | null) {
  if (!nome) return undefined;
  if (nome.startsWith('http')) return { uri: nome };
  return imagens[nome];
}