import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';
import styles from '../styles/index.styles';
import { supabase } from '../services/supabase';
import { MenuLateral } from '../components/MenuLateral';
import { CalculadoraFrete } from '../components/CalculadoraFrete';

const imagensProdutos: Record<string, any> = {
  "bermuda1.png": require("../../assets/images/produtos/bermuda1.png"),
  "bola1.png": require("../../assets/images/produtos/bola1.png"),
  "Boné nike.webp": require("../../assets/images/produtos/bone-nike.webp"),
  "bone-nike.webp": require("../../assets/images/produtos/bone-nike.webp"),
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

export default function HomeScreen() {
  const [busca, setBusca] = useState("");
  const [produtos, setProdutos] = useState<any[]>([]);
  const [menuAberto, setMenuAberto] = useState(false);
  const [freteAberto, setFreteAberto] = useState(false);

  useEffect(() => {
    async function carregarProdutos() {
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error(
          "Erro ao carregar produtos na tela inicial:",
          error.message
        );
        return;
      }

      setProdutos(data ?? []);
    }

    carregarProdutos();
  }, []);

  const produtosFiltrados = produtos.filter((produto) =>
    String(produto.nome ?? "")
      .toLowerCase()
      .includes(busca.trim().toLowerCase())
  );

  return (
    <View style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* CABEÇALHO */}
        <View style={styles.header}>

          <TouchableOpacity
            onPress={() => setMenuAberto(true)}
            hitSlop={12}
          >
            <Octicons
              name="three-bars"
              size={24}
              color="black"
            />
          </TouchableOpacity>

          <Text style={styles.logo}>
            Fit<Text style={styles.logoRed}>Zone</Text>
          </Text>

          <View style={styles.headerIcons}>

            <TouchableOpacity onPress={() => router.push("/perfil")}>
              <Feather name="user" size={24} color="black" />
            </TouchableOpacity>

          </View>

        </View>

        {/* PESQUISA */}
        <View style={styles.searchContainer}>

          <MaterialCommunityIcons
            name="magnify"
            size={24}
            color="black"
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produtos..."
            placeholderTextColor="#8b95a5"
            value={busca}
            onChangeText={setBusca}
          />

        </View>

        {/* BANNER E BENEFÍCIOS (somem durante a busca) */}
        {busca.trim() === "" && (
          <>
            <View style={styles.banner}>

              <Text style={styles.bannerTitle}>
                MOVIMENTO
              </Text>

              <Text style={styles.bannerTitle}>
                PERFORMANCE
              </Text>

              <Text style={styles.bannerRed}>
                EVOLUÇÃO
              </Text>

              <Text style={styles.bannerDescription}>
                Mais que esportes,{'\n'}
                um estilo de vida.
              </Text>

              <TouchableOpacity
                style={styles.bannerButton}
                onPress={() => router.push('/produtos')}
              >
                <Text style={styles.bannerButtonText}>
                  Explorar produtos →
                </Text>
              </TouchableOpacity>

            </View>

            {/* BENEFÍCIOS */}
            <View style={styles.benefits}>

              {/* BENEFÍCIO 1 (abre a calculadora de frete) */}
              <TouchableOpacity
                style={styles.benefit}
                activeOpacity={0.7}
                onPress={() => setFreteAberto(true)}
              >

                <AntDesign
                  style={styles.benefitIcon}
                  name="car"
                  size={24}
                  color="#e52323"
                />

                <Text style={styles.benefitText}>
                  Frete rápido para{'\n'}
                  todo o Brasil
                </Text>

                <Text
                  style={{
                    color: '#e52323',
                    fontSize: 11,
                    fontWeight: 'bold',
                    marginTop: 4,
                    textAlign: 'center',
                  }}
                >
                  Calcular frete
                </Text>

              </TouchableOpacity>

              {/* BENEFÍCIO 2 */}
              <View style={styles.benefit}>

                <MaterialCommunityIcons
                  style={styles.benefitIcon}
                  name="security"
                  size={24}
                  color="#e52323"
                />

                <Text style={styles.benefitText}>
                  Compra segura{'\n'}
                  e protegida
                </Text>

              </View>

              {/* BENEFÍCIO 3 */}
              <View style={styles.benefit}>

                <Text style={styles.benefitIcon}>
                  ☆
                </Text>

                <Text style={styles.benefitText}>
                  Qualidade e{'\n'}
                  excelência
                </Text>

              </View>
            </View>
          </>
        )}

        {/* LISTA DE PRODUTOS */}
        <ScrollView
          horizontal={busca.trim() === ""}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.products}
        >
          {produtosFiltrados.length > 0 ? (
            produtosFiltrados.map((produto) => (
              <TouchableOpacity
                key={produto.id}
                style={styles.productCard}
                onPress={() => router.push(`/produto/${produto.id}`)}
              >
                <Image
                  source={imagensProdutos[produto.imagem]}
                  style={styles.productImage}
                  resizeMode="contain"
                />

                <Text style={styles.productName}>
                  {produto.nome}
                </Text>

                <Text style={styles.productPrice}>
                  {`R$ ${Number(produto.preco).toFixed(2).replace(".", ",")}`}
                </Text>

                <Text style={styles.rating}>
                  ★ {produto.avaliacao ?? "Sem avaliação"}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ padding: 16 }}>
              Nenhum produto encontrado.
            </Text>
          )}
        </ScrollView>

      </ScrollView>

      {/* MENU LATERAL (abre pelo botão das três linhas) */}
      <MenuLateral
        visivel={menuAberto}
        onFechar={() => setMenuAberto(false)}
      />

      {/* CALCULADORA DE FRETE (abre pelo item "Frete rápido") */}
      <CalculadoraFrete
        visivel={freteAberto}
        onFechar={() => setFreteAberto(false)}
      />
    </View>
  );
}
