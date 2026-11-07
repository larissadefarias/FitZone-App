import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { supabase } from '../services/supabase';
import { encerrarSessao } from '../styles/sessao';
import styles from '../styles/perfil.styles';

type Usuario = {
  nome?: string;
  email?: string;
  dataNascimento?: string;
  cargo?: 'chefe' | 'admin' | null;
};

export default function Perfil() {
const [usuario, setUsuario] = useState<Usuario | null>(null);
const [carregando, setCarregando] = useState(true);
const [cargo, setCargo] = useState<'chefe' | 'admin' | null>(null);

  // Recarrega sempre que a aba ganha foco (login, edição de cadastro, logout)
  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregar() {
        setCarregando(true);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
  if (ativo) {
    setUsuario(null);
    setCargo(null);
    setCarregando(false);
  }
  return;
}

        const user = session.user;
        const { data: registroAdmin, error: erroAdmin } = await supabase
  .from('administradores')
  .select('papel')
  .eq('usuario_id', user.id)
  .maybeSingle();

if (erroAdmin) {
  console.error('Erro ao buscar cargo:', erroAdmin.message);
}

if (ativo) {
  setCargo(
    registroAdmin?.papel === 'admin'
      ? 'chefe'
      : registroAdmin?.papel === 'funcionario'
        ? 'admin'
        : null
  );
}
        const { data: perfil } = await supabase
          .from('perfis')
          .select('nome, data_nascimento')
          .eq('id', user.id)
          .maybeSingle();

        if (ativo) {
          setUsuario({
            nome: perfil?.nome ?? user.user_metadata?.nome ?? '',
            email: user.email ?? '',
            dataNascimento: perfil?.data_nascimento ?? '',
          });
          setCarregando(false);
        }
      }

      carregar();

      return () => {
        ativo = false;
      };
    }, []),
  );

  const inicial = usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : '?';

  const sair = async () => {
    await supabase.auth.signOut();
    encerrarSessao();
    setUsuario(null);
    router.replace('/login');
  };

  if (carregando) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#e52323" />
      </SafeAreaView>
    );
  }

  // NÃO LOGADO
  if (!usuario) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.vazio}>
          <Ionicons name="person-circle-outline" size={80} color="#cccccc" />
          <Text style={styles.vazioTitulo}>Você ainda não está logado</Text>
          <Text style={styles.vazioTexto}>
            Entre ou crie sua conta para ver seu perfil.
          </Text>

          <TouchableOpacity
            style={styles.botaoPrincipal}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.botaoPrincipalTexto}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoSecundario}
            onPress={() =>
              router.push({ pathname: '/cadastro', params: { editar: '0' } })
            }
          >
            <Text style={styles.botaoSecundarioTexto}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // LOGADO
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.conteudo}>
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <Text style={styles.tituloTopo}>Meu Perfil</Text>
        </View>

        {/* AVATAR */}
        <View style={styles.perfilTopo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>{inicial}</Text>
          </View>

          <Text style={styles.nomeUsuario}>{usuario.nome}</Text>
          <Text style={styles.emailUsuario}>{usuario.email}</Text>

          {cargo && (
  <View
    style={{
      marginTop: 8,
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 20,
      backgroundColor: '#fde8e8',
    }}
  >
    <Text style={{ color: '#c62828', fontWeight: 'bold' }}>
      {cargo === 'chefe' ? 'Administrador-chefe' : 'Administrador'}
    </Text>
  </View>
)}
        </View>

        {/* DADOS */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Dados pessoais</Text>

          <View style={styles.linhaInfo}>
            <View style={styles.iconeInfo}>
              <Ionicons name="person-outline" size={20} color="#ffffff" />
            </View>
            <View style={styles.textosInfo}>
              <Text style={styles.rotulo}>Nome de usuário</Text>
              <Text style={styles.valor}>{usuario.nome || '-'}</Text>
            </View>
          </View>

          <View style={styles.linhaInfo}>
            <View style={styles.iconeInfo}>
              <Ionicons name="mail-outline" size={20} color="#ffffff" />
            </View>
            <View style={styles.textosInfo}>
              <Text style={styles.rotulo}>E-mail</Text>
              <Text style={styles.valor}>{usuario.email || '-'}</Text>
            </View>
          </View>

          <View style={[styles.linhaInfo, styles.linhaInfoUltima]}>
            <View style={styles.iconeInfo}>
              <Ionicons name="calendar-outline" size={20} color="#ffffff" />
            </View>
            <View style={styles.textosInfo}>
              <Text style={styles.rotulo}>Data de nascimento</Text>
              <Text style={styles.valor}>{usuario.dataNascimento || '-'}</Text>
            </View>
          </View>
        </View>

        {/* ATALHOS */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Minha conta</Text>

          <TouchableOpacity
            style={styles.atalho}
            onPress={() =>
              router.push({ pathname: '/cadastro', params: { editar: '1' } })
            }
          >
            <Ionicons name="create-outline" size={22} color="#e52323" />
            <Text style={styles.atalhoTexto}>Editar cadastro</Text>
            <Ionicons name="chevron-forward" size={19} color="#e52323" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.atalho} onPress={() => router.push('/favoritos')}>
            <Ionicons name="heart-outline" size={22} color="#e52323" />
            <Text style={styles.atalhoTexto}>Meus favoritos</Text>
            <Ionicons name="chevron-forward" size={19} color="#e52323" />
          </TouchableOpacity>


<TouchableOpacity
  style={styles.atalho}
  onPress={() => router.push('/meus-pedidos')}
>
  <Ionicons name="receipt-outline" size={22} color="#e52323" />
  <Text style={styles.atalhoTexto}>Meus pedidos</Text>
  <Ionicons name="chevron-forward" size={19} color="#e52323" />
</TouchableOpacity>


          <TouchableOpacity
            style={[styles.atalho, styles.atalhoUltimo]}
            onPress={() => router.push('/carrinho')}
          >
            <Ionicons name="bag-outline" size={22} color="#e52323" />
            <Text style={styles.atalhoTexto}>Meu carrinho</Text>
            <Ionicons name="chevron-forward" size={19} color="#e52323" />
          </TouchableOpacity>
        </View>

        {/* SAIR */}
        <TouchableOpacity style={styles.botaoSair} onPress={sair}>
          <Ionicons name="log-out-outline" size={21} color="#e52323" />
          <Text style={styles.botaoSairTexto}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}