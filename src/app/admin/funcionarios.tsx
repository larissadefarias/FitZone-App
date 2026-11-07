import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { supabase } from '../../services/supabase';
import { avisar } from '../../services/aviso';

type Registro = {
  usuario_id: string;
  papel: string;
  created_at: string;
  nome?: string;
};

// Alert.alert com botões não funciona no navegador, então lá usamos window.confirm.
function confirmar(
  titulo: string,
  mensagem: string,
  textoConfirmar: string,
): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(`${titulo}\n\n${mensagem}`));
  }

  return new Promise((resolve) => {
    Alert.alert(
      titulo,
      mensagem,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
        { text: textoConfirmar, style: 'destructive', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}

export default function Funcionarios() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [autorizado, setAutorizado] = useState(false);
  const [erro, setErro] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [adicionando, setAdicionando] = useState(false);

  const carregar = useCallback(async (refresh = false) => {
    if (refresh) setAtualizando(true);
    else setCarregando(true);

    setErro('');

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setAutorizado(false);
        setRegistros([]);
        setErro('Entre na sua conta para continuar.');
        return;
      }

      const { data: meuRegistro, error: erroPermissao } = await supabase
        .from('administradores')
        .select('papel')
        .eq('usuario_id', user.id)
        .maybeSingle();

      if (erroPermissao) throw erroPermissao;

      // Na estrutura atual, papel "admin" identifica o administrador-chefe.
      if (meuRegistro?.papel !== 'admin') {
        setAutorizado(false);
        setRegistros([]);
        setErro('Apenas o administrador-chefe pode gerenciar funcionários.');
        return;
      }

      setAutorizado(true);

      const { data, error } = await supabase
        .from('administradores')
        .select('usuario_id, papel, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const lista = (data ?? []) as Registro[];

      // Busca os nomes na tabela de perfis, sem depender de JOIN.
      const ids = lista.map((item) => item.usuario_id);
      let nomes: Record<string, string> = {};

      if (ids.length > 0) {
        const { data: perfis, error: erroPerfis } = await supabase
          .from('perfis')
          .select('id, nome')
          .in('id', ids);

        if (erroPerfis) {
          console.warn('Não foi possível carregar os nomes:', erroPerfis.message);
        } else {
          nomes = Object.fromEntries(
            (perfis ?? []).map((perfil) => [perfil.id, perfil.nome || '']),
          );
        }
      }

      setRegistros(
        lista.map((item) => ({
          ...item,
          nome: nomes[item.usuario_id] || '',
        })),
      );
    } catch (e) {
      console.error('Erro ao carregar funcionários:', e);
      setErro('Não foi possível carregar os registros. Confira as permissões do Supabase.');
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

  async function adicionarFuncionario() {
    const email = novoEmail.trim();

    if (!email || !email.includes('@')) {
      avisar('Atenção', 'Informe o e-mail da conta que já se cadastrou no FitZone.');
      return;
    }

    setAdicionando(true);

    // A busca do e-mail e a checagem de permissão acontecem dentro do banco.
    const { error } = await supabase.rpc('adicionar_funcionario', {
      p_email: email,
    });

    setAdicionando(false);

    if (error) {
      console.log('Erro ao adicionar funcionário:', error.message);
      avisar(
        'Não foi possível adicionar',
        error.message.includes('Could not find the function')
          ? 'A função adicionar_funcionario não existe no banco. Rode o SQL dela no Supabase.'
          : error.message,
      );
      return;
    }

    setNovoEmail('');
    avisar('Pronto!', 'Funcionário vinculado ao painel.');
    await carregar(true);
  }

  async function removerFuncionario(item: Registro) {
    if (item.papel !== 'funcionario') {
      avisar(
        'Ação não permitida',
        'Esta ação só pode remover o vínculo de um funcionário.',
      );
      return;
    }

    const ok = await confirmar(
      'Remover acesso administrativo?',
      `O vínculo de ${item.nome || 'este funcionário'} será removido. A conta de login continuará existindo.`,
      'Remover acesso',
    );

    if (!ok) return;

    // O .select() devolve as linhas removidas; vazio significa que o banco recusou.
    const { data, error } = await supabase
      .from('administradores')
      .delete()
      .eq('usuario_id', item.usuario_id)
      .eq('papel', 'funcionario')
      .select('usuario_id');

    if (error) {
      console.log('Erro ao remover funcionário:', error.message);
      avisar('Erro', 'Não foi possível remover o vínculo: ' + error.message);
      return;
    }

    if (!data || data.length === 0) {
      avisar(
        'Nada foi removido',
        'O banco não permitiu a remoção. Confira as policies da tabela administradores.',
      );
      return;
    }

    avisar('Concluído', 'Vínculo administrativo removido.');
    carregar(true);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          backgroundColor: '#fff',
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 6 }}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={{ fontSize: 21, fontWeight: 'bold', marginLeft: 12 }}>
          Funcionários
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
          <Ionicons name="alert-circle-outline" size={42} color="#e52323" />
          <Text style={{ textAlign: 'center', color: '#555', marginTop: 12 }}>
            {erro}
          </Text>
          {erro.startsWith('Entre') && (
            <TouchableOpacity
              onPress={() => router.push('/login')}
              style={{
                backgroundColor: '#e52323',
                padding: 12,
                borderRadius: 8,
                marginTop: 16,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Entrar</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : autorizado ? (
        <ScrollView
          contentContainerStyle={{ padding: 14 }}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => carregar(true)}
            />
          }
        >
          {/* FORMULÁRIO: fica FORA do map, uma única vez no topo */}
          <View
            style={{
              backgroundColor: '#fff',
              padding: 16,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
              Adicionar funcionário
            </Text>

            <Text style={{ color: '#666', marginTop: 6, marginBottom: 12 }}>
              Informe o e-mail da conta que já se cadastrou no FitZone.
            </Text>

            <TextInput
              value={novoEmail}
              onChangeText={setNovoEmail}
              placeholder="E-mail do funcionário"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
                color: '#222',
              }}
            />

            <TouchableOpacity
              disabled={adicionando}
              onPress={adicionarFuncionario}
              style={{
                backgroundColor: '#e52323',
                padding: 14,
                borderRadius: 8,
                alignItems: 'center',
                opacity: adicionando ? 0.6 : 1,
              }}
            >
              {adicionando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  Adicionar funcionário
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={{ color: '#666', marginBottom: 14 }}>
            Usuários com acesso administrativo: {registros.length}
          </Text>

          {registros.length === 0 ? (
            <Text style={{ color: '#666', textAlign: 'center', marginTop: 30 }}>
              Nenhum registro encontrado.
            </Text>
          ) : (
            registros.map((item) => {
              const chefe = item.papel === 'admin';
              const funcionario = item.papel === 'funcionario';

              return (
                <View
                  key={item.usuario_id}
                  style={{
                    backgroundColor: '#fff',
                    padding: 16,
                    borderRadius: 12,
                    marginBottom: 12,
                    elevation: 2,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={{
                        backgroundColor: '#fde8e8',
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Ionicons
                        name={chefe ? 'shield-checkmark' : 'person'}
                        size={23}
                        color="#e52323"
                      />
                    </View>

                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                        {item.nome || 'Nome não disponível'}
                      </Text>
                      <Text style={{ color: '#777', fontSize: 12, marginTop: 4 }}>
                        {chefe
                          ? 'Administrador-chefe'
                          : funcionario
                            ? 'Funcionário'
                            : `Papel: ${item.papel}`}
                      </Text>
                    </View>

                    {funcionario && (
                      <TouchableOpacity
                        onPress={() => removerFuncionario(item)}
                        style={{ padding: 8 }}
                      >
                        <Ionicons name="trash-outline" size={22} color="#e52323" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <Text style={{ color: '#777', fontSize: 12, marginTop: 14 }}>
                    Cadastro: {new Date(item.created_at).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              );
            })
          )}

          <Text style={{ color: '#777', fontSize: 12, marginTop: 4 }}>
            Esta tela lista os vínculos da tabela administradores; ela não lista todos os clientes cadastrados.
          </Text>
        </ScrollView>
      ) : null}
    </View>
  );
}
