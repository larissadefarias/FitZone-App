
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';

type Pedido = {
  id: number;
  usuario_id: string;
  total: number;
  status: string;
  created_at: string;
  nome_cliente?: string | null;
};

type ItemPedido = {
  pedido_id: number;
  nome: string;
  preco_unitario: number;
  quantidade: number;
  tamanho?: string | null;
  cor?: string | null;
};

const moeda = (valor: number) =>
  `R$ ${Number(valor || 0).toFixed(2).replace('.', ',')}`;

function statusInfo(status: string) {
  const s = (status || '').toLowerCase().trim();

  if (s.includes('cancel')) {
    return { titulo: 'Cancelado', cor: '#b91c1c', icone: 'close-circle' as const };
  }
  if (s.includes('entreg')) {
    return { titulo: 'Entregue', cor: '#15803d', icone: 'checkmark-circle' as const };
  }
  if (s.includes('envi') || s.includes('transporte')) {
    return { titulo: 'Enviado', cor: '#2563eb', icone: 'bicycle' as const };
  }
  if (s.includes('prepara') || s.includes('process')) {
    return { titulo: 'Em preparação', cor: '#b45309', icone: 'time' as const };
  }

  return { titulo: 'Pedido recebido', cor: '#b45309', icone: 'receipt' as const };
}

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [itens, setItens] = useState<ItemPedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async (refresh = false) => {
    if (refresh) setAtualizando(true);
    else setCarregando(true);

    setErro('');

    try {
      const { data: { user }, error: erroAuth } =
        await supabase.auth.getUser();

      if (erroAuth || !user) {
        setPedidos([]);
        setItens([]);
        setErro('Entre na sua conta para consultar seus pedidos.');
        return;
      }

      const { data, error } = await supabase
        .from('pedidos')
        .select('id, usuario_id, total, status, created_at, nome_cliente')
        .eq('usuario_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const lista = (data ?? []) as Pedido[];
      setPedidos(lista);

      if (lista.length > 0) {
        const ids = lista.map((p) => p.id);

        const { data: dadosItens, error: erroItens } = await supabase
          .from('pedido_itens')
          .select('pedido_id, nome, preco_unitario, quantidade, tamanho, cor')
          .in('pedido_id', ids);

        if (erroItens) throw erroItens;

        setItens((dadosItens ?? []) as ItemPedido[]);
      } else {
        setItens([]);
      }
    } catch (e) {
      console.error('Erro ao carregar pedidos:', e);
      setErro('Não foi possível carregar seus pedidos. Tente novamente.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
      }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 6 }}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={{ fontSize: 21, fontWeight: 'bold', marginLeft: 12 }}>
          Meus Pedidos
        </Text>
      </View>

      {carregando ? (
        <ActivityIndicator
          size="large"
          color="#e52323"
          style={{ marginTop: 40 }}
        />
      ) : erro ? (
        <View style={{ padding: 24, alignItems: 'center' }}>
          <Text style={{ color: '#555', textAlign: 'center' }}>{erro}</Text>
          <TouchableOpacity
            onPress={() => erro.startsWith('Entre') ? router.push('/login') : carregar()}
            style={{
              backgroundColor: '#e52323',
              padding: 12,
              borderRadius: 8,
              marginTop: 16,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              {erro.startsWith('Entre') ? 'Entrar' : 'Tentar novamente'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : pedidos.length === 0 ? (
        <View style={{ padding: 28, alignItems: 'center' }}>
          <Ionicons name="receipt-outline" size={58} color="#aaa" />
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 12 }}>
            Você ainda não tem pedidos
          </Text>
          <Text style={{ color: '#666', textAlign: 'center', marginTop: 8 }}>
            Quando fizer uma compra, ela aparecerá aqui.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/produtos')}
            style={{
              backgroundColor: '#e52323',
              padding: 13,
              borderRadius: 8,
              marginTop: 18,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Explorar produtos
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 14, paddingBottom: 30 }}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => carregar(true)}
            />
          }
        >
          {pedidos.map((pedido) => {
            const status = statusInfo(pedido.status);
            const itensDoPedido = itens.filter(
              (item) => item.pedido_id === pedido.id,
            );

            return (
              <View
                key={pedido.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 14,
                  elevation: 2,
                }}
              >
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                      Pedido #{pedido.id}
                    </Text>
                    <Text style={{ color: '#777', marginTop: 4 }}>
                      {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>

                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: `${status.cor}15`,
                    borderRadius: 20,
                    paddingHorizontal: 9,
                    paddingVertical: 6,
                  }}>
                    <Ionicons name={status.icone} size={16} color={status.cor} />
                    <Text style={{
                      color: status.cor,
                      fontWeight: 'bold',
                      marginLeft: 5,
                      fontSize: 12,
                    }}>
                      {status.titulo}
                    </Text>
                  </View>
                </View>

                <View style={{
                  height: 1,
                  backgroundColor: '#eee',
                  marginVertical: 12,
                }} />

                {itensDoPedido.length === 0 ? (
                  <Text style={{ color: '#777' }}>
                    Nenhum item encontrado para este pedido.
                  </Text>
                ) : (
                  itensDoPedido.map((item, index) => (
                    <View key={`${pedido.id}-${index}`} style={{ marginBottom: 12 }}>
                      <Text style={{ fontWeight: '600', color: '#333' }}>
                        {item.nome}
                      </Text>
                      <Text style={{ color: '#777', marginTop: 3 }}>
                        Quantidade: {item.quantidade}
                        {item.tamanho ? ` • Tam: ${item.tamanho}` : ''}
                        {item.cor ? ` • Cor: ${item.cor}` : ''}
                      </Text>
                      <Text style={{ color: '#555', marginTop: 3 }}>
                        {moeda(Number(item.preco_unitario) * Number(item.quantidade))}
                      </Text>
                    </View>
                  ))
                )}

                <View style={{
                  borderTopWidth: 1,
                  borderTopColor: '#eee',
                  paddingTop: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                    Total
                  </Text>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#e52323',
                  }}>
                    {moeda(Number(pedido.total))}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
