import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../services/supabase';
import { encerrarSessao } from '../styles/sessao';

type Props = {
  visivel: boolean;
  onFechar: () => void;
};

type Atalho = {
  rotulo: string;
  icone: React.ComponentProps<typeof Ionicons>['name'];
  rota: string;
};

const ATALHOS: Atalho[] = [
  { rotulo: 'Início', icone: 'home-outline', rota: '/' },
  { rotulo: 'Categorias', icone: 'grid-outline', rota: '/categorias' },
  { rotulo: 'Todos os produtos', icone: 'pricetags-outline', rota: '/produtos' },
  { rotulo: 'Favoritos', icone: 'heart-outline', rota: '/favoritos' },
  { rotulo: 'Meu carrinho', icone: 'bag-outline', rota: '/carrinho' },
  { rotulo: 'Meu perfil', icone: 'person-outline', rota: '/perfil' },
];

export function MenuLateral({ visivel, onFechar }: Props) {
  const [logado, setLogado] = useState(false);
  const [nome, setNome] = useState('');
  const [equipe, setEquipe] = useState(false);

  // Confere quem está logado toda vez que o menu abre.
  useEffect(() => {
    if (!visivel) return;

    let ativo = true;

    async function carregar() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        if (ativo) {
          setLogado(false);
          setNome('');
          setEquipe(false);
        }
        return;
      }

      const { data: perfil } = await supabase
        .from('perfis')
        .select('nome')
        .eq('id', session.user.id)
        .maybeSingle();

      // Só enxerga a própria linha (RLS): se existir, a pessoa é da equipe.
      const { data: papel } = await supabase
        .from('administradores')
        .select('papel')
        .eq('usuario_id', session.user.id)
        .maybeSingle();

      if (ativo) {
        setLogado(true);
        setNome(perfil?.nome ?? session.user.user_metadata?.nome ?? '');
        setEquipe(!!papel);
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [visivel]);

  function ir(rota: string) {
    onFechar();
    router.push(rota as any);
  }

  function irCadastro() {
    onFechar();
    router.push({ pathname: '/cadastro', params: { editar: '0' } });
  }

  async function sair() {
    await supabase.auth.signOut();
    encerrarSessao();
    setLogado(false);
    setNome('');
    setEquipe(false);
    onFechar();
    router.replace('/login');
  }

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={onFechar}
      statusBarTranslucent
    >
      <View style={estilos.raiz}>
        <View style={estilos.painel}>
          <View style={estilos.topo}>
            <Text style={estilos.logo}>
              Fit<Text style={estilos.logoVermelho}>Zone</Text>
            </Text>

            <TouchableOpacity onPress={onFechar} hitSlop={12}>
              <Ionicons name="close" size={26} color="#222222" />
            </TouchableOpacity>
          </View>

          <View style={estilos.saudacao}>
            <Ionicons name="person-circle-outline" size={44} color="#cccccc" />
            <Text style={estilos.saudacaoTexto}>
              {logado ? `Olá, ${nome || 'bem-vindo(a)'}!` : 'Olá, visitante!'}
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {ATALHOS.map((atalho) => (
              <TouchableOpacity
                key={atalho.rota}
                style={estilos.item}
                onPress={() => ir(atalho.rota)}
              >
                <Ionicons name={atalho.icone} size={22} color="#e52323" />
                <Text style={estilos.itemTexto}>{atalho.rotulo}</Text>
              </TouchableOpacity>
            ))}

            {equipe && (
              <TouchableOpacity
                style={estilos.item}
                onPress={() => ir('/admin')}
              >
                <Ionicons name="shield-checkmark-outline" size={22} color="#e52323" />
                <Text style={estilos.itemTexto}>Painel administrativo</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          <View style={estilos.rodape}>
            {logado ? (
              <TouchableOpacity style={estilos.botaoSair} onPress={sair}>
                <Ionicons name="log-out-outline" size={21} color="#e52323" />
                <Text style={estilos.botaoSairTexto}>Sair da conta</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={estilos.botaoPrincipal}
                  onPress={() => ir('/login')}
                >
                  <Text style={estilos.botaoPrincipalTexto}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={estilos.botaoSecundario}
                  onPress={irCadastro}
                >
                  <Text style={estilos.botaoSecundarioTexto}>Criar conta</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Toque na área escura para fechar */}
        <Pressable style={estilos.fundo} onPress={onFechar} />
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  raiz: {
    flex: 1,
    flexDirection: 'row',
  },
  painel: {
    width: '78%',
    maxWidth: 330,
    backgroundColor: '#ffffff',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    fontSize: 30,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#111111',
  },
  logoVermelho: {
    color: '#e52323',
  },
  saudacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 18,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  saudacaoTexto: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3',
  },
  itemTexto: {
    fontSize: 16,
    color: '#222222',
  },
  rodape: {
    paddingTop: 16,
    gap: 10,
  },
  botaoPrincipal: {
    backgroundColor: '#e52323',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  botaoPrincipalTexto: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  botaoSecundario: {
    borderWidth: 1.5,
    borderColor: '#e52323',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  botaoSecundarioTexto: {
    color: '#e52323',
    fontWeight: 'bold',
    fontSize: 16,
  },
  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e52323',
  },
  botaoSairTexto: {
    color: '#e52323',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
