import React from 'react';

import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import styles from '../styles/categorias.styles';

import { categorias } from '../data/categorias';

export default function Categorias() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>FitZone</Text>

            <Text style={styles.subtitulo}>
              Encontre o que você precisa
            </Text>
          </View>

          <View style={styles.iconeHeader}>
            <Ionicons
              name="grid-outline"
              size={23}
              color="#e52323"
            />
          </View>
        </View>

        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>
            Categorias
          </Text>

          <Text style={styles.descricao}>
            Explore nossos produtos por categoria
          </Text>
        </View>

        <View style={styles.lista}>
          {categorias.map((categoria) => (
            <TouchableOpacity
              key={categoria.id}
              activeOpacity={0.88}
              style={styles.card}
              onPress={() =>
  router.push({
    pathname: "/produtos",
    params: { categoria: categoria.nome },
  })
}
            >
              <View style={styles.areaTexto}>
                <View style={styles.icone}>
                  <Ionicons
                    name={categoria.icone as any}
                    size={23}
                    color="#ffffff"
                  />
                </View>

                <View style={styles.textos}>
                  <Text style={styles.nome}>
                    {categoria.nome}
                  </Text>

                  <Text style={styles.descricaoCard}>
                    {categoria.descricao}
                  </Text>
                </View>

                <View style={styles.seta}>
                  <Ionicons
                    name="chevron-forward"
                    size={19}
                    color="#e52323"
                  />
                </View>
              </View>

              <View style={styles.areaImagem}>
                <Image
                  source={categoria.imagem}
                  style={styles.imagem}
                  resizeMode="cover"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
