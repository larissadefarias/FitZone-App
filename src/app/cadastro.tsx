import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import {
  Feather,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { supabase } from "../services/supabase";
import { avisar } from "../services/aviso";
import styles from '../styles/cadastro.styles';

// Formata enquanto digita: 25121990 -> 25/12/1990
function mascararData(texto: string) {
  const n = texto.replace(/\D/g, "").slice(0, 8);
  if (n.length <= 2) return n;
  if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;
  return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
}

function dataValida(texto: string) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto.trim());
  if (!m) return false;
  const dia = Number(m[1]);
  const mes = Number(m[2]);
  const ano = Number(m[3]);
  const data = new Date(ano, mes - 1, dia);
  return (
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia &&
    ano > 1900 &&
    data <= new Date()
  );
}

export default function Cadastro() {
  // editar === '1' -> veio do Perfil para editar os dados já cadastrados
  const { editar } = useLocalSearchParams<{ editar?: string }>();
  const editando = editar === '1';

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  // A tela continua montada dentro das abas: a cada foco, ou carrega
  // os dados atuais do Supabase (edição) ou limpa o formulário (novo cadastro).
  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      setSenha("");
      setConfirmarSenha("");

      if (!editando) {
        setNome("");
        setEmail("");
        setDataNascimento("");
        return;
      }

      async function carregar() {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          avisar("Atenção", "Entre na sua conta para editar o cadastro.");
          router.replace("/login");
          return;
        }

        const user = session.user;

        const { data: perfil } = await supabase
          .from("perfis")
          .select("nome, data_nascimento")
          .eq("id", user.id)
          .maybeSingle();

        if (!ativo) return;

        setNome(perfil?.nome ?? user.user_metadata?.nome ?? "");
        setEmail(user.email ?? "");
        setDataNascimento(
          perfil?.data_nascimento ?? user.user_metadata?.data_nascimento ?? ""
        );
      }

      carregar();

      return () => {
        ativo = false;
      };
    }, [editando]),
  );

  async function cadastrar() {
    if (!nome.trim() || !email.trim() || !dataNascimento.trim()) {
      avisar("Atenção", "Preencha todos os campos.");
      return;
    }

    if (!dataValida(dataNascimento)) {
      avisar("Atenção", "Informe uma data de nascimento válida (DD/MM/AAAA).");
      return;
    }

    // No cadastro novo a senha é obrigatória; na edição só se for trocar.
    if (!editando && (!senha || !confirmarSenha)) {
      avisar("Atenção", "Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      avisar("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      // ---------- EDIÇÃO ----------
      if (editando) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          avisar("Atenção", "Sua sessão expirou. Entre novamente.");
          router.replace("/login");
          return;
        }

        const { error: perfilError } = await supabase.from("perfis").upsert({
          id: session.user.id,
          nome: nome.trim(),
          data_nascimento: dataNascimento.trim(),
        });

        if (perfilError) {
          console.log("Erro ao salvar perfil:", perfilError.message);
          avisar("Erro", "Não foi possível salvar: " + perfilError.message);
          return;
        }

        if (senha) {
          const { error: senhaError } = await supabase.auth.updateUser({
            password: senha,
          });

          if (senhaError) {
            console.log("Erro ao trocar senha:", senhaError.message);
            avisar(
              "Dados salvos, mas a senha não foi alterada",
              senhaError.message
            );
            return;
          }
        }

        avisar("Pronto!", "Seu cadastro foi atualizado.");
        router.replace("/perfil");
        return;
      }

      // ---------- CADASTRO NOVO ----------
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: senha,
        options: {
          data: {
            nome: nome.trim(),
            data_nascimento: dataNascimento.trim(),
          },
        },
      });

      if (error) {
        console.log("Erro no cadastro:", error.message);
        avisar("Erro no cadastro", error.message);
        return;
      }

      if (!data.user) {
        avisar("Erro", "Não foi possível criar a conta. Tente novamente.");
        return;
      }

      // O perfil é criado pelo trigger do banco (ou, na falta dele,
      // pelo login.tsx no primeiro acesso). Não inserimos aqui.
      if (data.session) {
        avisar("Cadastro realizado!", "Sua conta foi criada.");
        router.replace("/perfil");
      } else {
        avisar(
          "Cadastro realizado!",
          "Enviamos um link de confirmação para o seu e-mail. Confirme antes de entrar."
        );
        router.replace("/login");
      }
    } catch (e) {
      console.log("Erro inesperado no cadastro:", e);
      avisar(
        "Erro",
        "Não foi possível concluir. Verifique sua conexão e tente novamente."
      );
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>

        <Text style={styles.titulo}>
          {editando ? "Editar cadastro" : "Seja FitZone"}
        </Text>

        {/* Nome */}
        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color="#333333" />

          <TextInput
            placeholder="Nome do usuário"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />
        </View>

        {/* Email (não editável na edição) */}
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={20} color="#333333" />

          <TextInput
            placeholder="Digite seu email"
            style={[styles.input, editando && { color: "#888888" }]}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!editando}
          />
        </View>

        {/* Senha */}
        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="#333333" />

          <TextInput
            placeholder={
              editando ? "Nova senha (deixe em branco para manter)" : "Digite sua senha"
            }
            secureTextEntry
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        {/* Confirmar senha */}
        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="#333333" />

          <TextInput
            placeholder="Confirme sua senha"
            secureTextEntry
            style={styles.input}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />
        </View>

        {/* Data de nascimento */}
        <View style={styles.inputContainer}>
          <FontAwesome5
            name="calendar-alt"
            size={18}
            color="#333333"
          />

          <TextInput
            placeholder="DD/MM/AAAA"
            style={styles.input}
            value={dataNascimento}
            onChangeText={(t) => setDataNascimento(mascararData(t))}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        {/* Botão */}
        <TouchableOpacity
          style={styles.botao}
          onPress={cadastrar}
        >
          <Text style={styles.textoBotao}>
            {editando ? "Salvar alterações" : "Cadastrar"}
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}