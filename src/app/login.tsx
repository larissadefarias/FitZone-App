import React, { useCallback, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { supabase } from '../services/supabase';
import { avisar } from '../services/aviso';
import styles from '../styles/login.styles';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrarSenha, setLembrarSenha] = useState(false);

  // A tela continua montada dentro das abas, então os campos
  // são atualizados toda vez que ela ganha foco (ex.: logo após o cadastro).
  useFocusEffect(
    useCallback(() => {
      setEmail('');
      setSenha('');
      setLembrarSenha(false);
    }, []),
  );

  async function entrar() {
    if (!email.trim() || !senha) {
      avisar('Atenção', 'Preencha o e-mail e a senha.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha,
      });

      if (error) {
        console.log('Erro de login:', error.message);
        avisar(
          'Não foi possível entrar',
          error.message === 'Email not confirmed'
            ? 'Confirme seu e-mail pelo link que enviamos antes de entrar.'
            : 'Confira seu e-mail e senha.'
        );
        return;
      }

      const user = data.user;

      if (!user) {
        avisar('Erro', 'Não foi possível identificar sua conta.');
        return;
      }

      let { data: perfil, error: perfilError } = await supabase
        .from('perfis')
        .select('nome, data_nascimento')
        .eq('id', user.id)
        .maybeSingle();

      if (perfilError) {
  console.log('Erro ao buscar perfil:', perfilError.message);
  avisar('Erro ao carregar perfil', perfilError.message);
  return;
}

      if (!perfil) {
        const nome = user.user_metadata?.nome ?? '';
        const dataNascimento = user.user_metadata?.data_nascimento ?? '';

        const { data: novoPerfil, error: criarErro } = await supabase
          .from('perfis')
          .insert({
            id: user.id,
            nome,
            data_nascimento: dataNascimento,
          })
          .select('nome, data_nascimento')
          .single();

        if (criarErro) {
          console.log('Erro ao criar perfil:', criarErro.message);
          avisar(
            'Erro ao criar perfil',
            'Sua conta foi autenticada, mas não foi possível salvar seus dados. Tente entrar novamente.'
          );
          return;
        }

        perfil = novoPerfil;
      }

      router.replace('/perfil');
    } catch (e) {
      console.log('Erro inesperado no login:', e);
      avisar(
        'Erro',
        'Não foi possível conectar ao Supabase. Verifique sua conexão e tente novamente.'
      );
    }
  }

  function esqueciMinhaSenha() {
    avisar('Recuperar senha', 'A recuperação de senha será adicionada em breve.');
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Login</Text>
        </View>

        <View style={styles.content}>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#777"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.rememberContainer}
              activeOpacity={0.8}
              onPress={() => setLembrarSenha(!lembrarSenha)}
            >
              <View style={[styles.checkbox, lembrarSenha && styles.checkboxChecked]}>
                {lembrarSenha && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.optionText}>Lembrar senha</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={esqueciMinhaSenha}>
              <Text style={styles.link}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={entrar}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Não possui uma conta? </Text>
            <TouchableOpacity
              onPress={() =>
                router.push({ pathname: '/cadastro', params: { editar: '0' } })
              }
            >
              <Text style={styles.link}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}