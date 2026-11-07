
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const vermelho = '#e52323';

const secoes = [
  {
    titulo: 'Produtos',
    descricao: 'Cadastrar, editar preços e gerenciar produtos',
    icone: 'pricetags-outline' as const,
    rota: '/admin/produtos',
  },
  {
    titulo: 'Pedidos',
    descricao: 'Consultar compras e atualizar status',
    icone: 'receipt-outline' as const,
    rota: '/admin/pedidos',
  },
  {
    titulo: 'Funcionários',
    descricao: 'Conceder e remover cargos administrativos',
    icone: 'people-outline' as const,
    rota: '/admin/funcionarios',
  },
];

export default function Admin() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}
        >
          <Ionicons name="arrow-back" size={24} color={vermelho} />
          <Text style={{ marginLeft: 8, fontSize: 16 }}>Voltar</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#222' }}>
          Painel Administrativo
        </Text>
        <Text style={{ color: '#666', marginTop: 8, marginBottom: 24 }}>
          Gerencie a loja FitZone em um só lugar.
        </Text>

        {secoes.map((secao) => (
          <TouchableOpacity
            key={secao.titulo}
            onPress={() => router.push(secao.rota as any)}
            style={{
              backgroundColor: '#fff',
              borderRadius: 14,
              padding: 18,
              marginBottom: 14,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#eee',
            }}
          >
            <View
              style={{
                backgroundColor: '#fde8e8',
                borderRadius: 12,
                padding: 12,
                marginRight: 14,
              }}
            >
              <Ionicons name={secao.icone} size={28} color={vermelho} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#222' }}>
                {secao.titulo}
              </Text>
              <Text style={{ color: '#666', marginTop: 5 }}>
                {secao.descricao}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={22} color={vermelho} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
