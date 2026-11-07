import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';

import styles from '../styles/finalizacaoDePedido.styles';
import { avisar } from '../services/aviso';
import { supabase } from '../services/supabase';
import {
  CartItem,
  getCart,
  usuarioLogado,
  finalizarPedido as enviarPedido,
} from '../services/carrinhoSupabase';

const moeda = (valor: number) => `R$ ${valor.toFixed(2).replace('.', ',')}`;

type Frete = {
  uf: string;
  valor: number;
  prazo: number;
  gratis: boolean;
};

// Formata enquanto digita: 20040020 -> 20040-020
function mascararCep(texto: string) {
  const n = texto.replace(/\D/g, '').slice(0, 8);
  if (n.length <= 5) return n;
  return `${n.slice(0, 5)}-${n.slice(5)}`;
}

export default function CheckoutScreen() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [pagamento, setPagamento] = useState('PIX');
  const [pedidoRealizado, setPedidoRealizado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [itens, setItens] = useState<CartItem[]>([]);
  const [logado, setLogado] = useState(true);
  const [frete, setFrete] = useState<Frete | null>(null);
  const [calculandoFrete, setCalculandoFrete] = useState(false);
  const [erroFrete, setErroFrete] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // A tela continua montada dentro das abas: recarrega o resumo a cada foco.
  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregar() {
        const user = await usuarioLogado();
        if (!user) {
          if (ativo) {
            setLogado(false);
            setItens([]);
          }
          return;
        }
        const lista = await getCart();
        if (ativo) {
          setLogado(true);
          setItens(lista.filter((item) => item.selecionado));
        }
      }

      carregar();

      return () => {
        ativo = false;
      };
    }, []),
  );

  const subtotal = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  const valorFrete = frete ? frete.valor : 0;
  const total = subtotal + valorFrete;

  // Calcula o frete sozinho quando o CEP tem 8 dígitos (o banco faz a conta).
  useEffect(() => {
    const digitos = cep.replace(/\D/g, '');

    if (digitos.length !== 8 || subtotal <= 0) {
      setFrete(null);
      setErroFrete('');
      setCalculandoFrete(false);
      return;
    }

    let ativo = true;

    async function calcular() {
      setCalculandoFrete(true);
      setErroFrete('');

      const { data, error } = await supabase.rpc('calcular_frete', {
        p_cep: digitos,
        p_subtotal: subtotal,
      });

      if (!ativo) return;

      setCalculandoFrete(false);

      if (error) {
        console.log('Erro ao calcular frete:', error.message);
        setFrete(null);
        setErroFrete(
          error.message.includes('Could not find the function')
            ? 'O cálculo de frete ainda não foi configurado no banco.'
            : error.message,
        );
        return;
      }

      const linha = Array.isArray(data) ? data[0] : data;

      if (!linha) {
        setFrete(null);
        setErroFrete('Não foi possível calcular o frete para esse CEP.');
        return;
      }

      setFrete({
        uf: linha.uf_destino,
        valor: Number(linha.valor_frete),
        prazo: linha.prazo_entrega,
        gratis: linha.frete_gratis,
      });
    }

    calcular();

    return () => {
      ativo = false;
    };
  }, [cep, subtotal]);

  const concluirPedido = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setPedidoRealizado(false);
    setNome('');
    setTelefone('');
    setCep('');
    setEndereco('');
    setNumero('');
    setComplemento('');
    setPagamento('PIX');
    setItens([]);
    setFrete(null);
    setErroFrete('');
    router.replace('/');
  };

  const finalizarPedido = async () => {
    if (!nome.trim() || !telefone.trim() || !cep.trim() || !endereco.trim() || !numero.trim()) {
      avisar('Atenção', 'Preencha todos os campos obrigatórios antes de finalizar a compra.');
      return;
    }

    if (!logado) {
      avisar('Atenção', 'Entre na sua conta para finalizar a compra.');
      router.push('/login');
      return;
    }

    if (itens.length === 0) {
      avisar('Atenção', 'Marque pelo menos um item no carrinho para finalizar a compra.');
      return;
    }

    if (!frete) {
      avisar(
        'Atenção',
        erroFrete || 'Informe um CEP válido para calcular o frete antes de finalizar.',
      );
      return;
    }

    setEnviando(true);
    const resultado = await enviarPedido({
      nome: nome.trim(),
      telefone: telefone.trim(),
      cep: cep.trim(),
      endereco: endereco.trim(),
      numero: numero.trim(),
      complemento: complemento.trim(),
      pagamento,
    });
    setEnviando(false);

    if (!resultado.ok) {
      avisar('Erro', resultado.mensagem ?? 'Não foi possível finalizar o pedido.');
      return;
    }

    setPedidoRealizado(true);
    timerRef.current = setTimeout(concluirPedido, 1800);
  };

  const fecharModal = () => concluirPedido();

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>Finalizar Compra</Text>

        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          placeholder="(21) 99999-9999"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>CEP</Text>
        <TextInput
          style={styles.input}
          placeholder="00000-000"
          value={cep}
          onChangeText={(t) => setCep(mascararCep(t))}
          keyboardType="numeric"
          maxLength={9}
        />

        {/* Frete logo abaixo do CEP, para aparecer assim que ele é digitado */}
        {calculandoFrete && (
          <Text style={{ color: '#777', marginBottom: 10 }}>Calculando frete...</Text>
        )}

        {!calculandoFrete && frete && (
          <Text style={{ color: '#222', fontWeight: 'bold', marginBottom: 10 }}>
            Frete para {frete.uf}: {frete.gratis ? 'Grátis' : moeda(frete.valor)} • até{' '}
            {frete.prazo} dias
          </Text>
        )}

        {!calculandoFrete && !frete && !!erroFrete && (
          <Text style={{ color: '#E52323', marginBottom: 10 }}>{erroFrete}</Text>
        )}

        <Text style={styles.label}>Endereço</Text>
        <TextInput
          style={styles.input}
          placeholder="Rua, Avenida..."
          value={endereco}
          onChangeText={setEndereco}
        />

        <Text style={styles.label}>Número</Text>
        <TextInput
          style={styles.input}
          placeholder="123"
          value={numero}
          onChangeText={setNumero}
        />

        <Text style={styles.label}>Complemento</Text>
        <TextInput
          style={styles.input}
          placeholder="Apartamento, bloco..."
          value={complemento}
          onChangeText={setComplemento}
        />

        <Text style={styles.sectionTitle}>Forma de Pagamento</Text>

        <TouchableOpacity style={styles.option} onPress={() => setPagamento('PIX')}>
          <Ionicons
            name={pagamento === 'PIX' ? 'radio-button-on' : 'radio-button-off'}
            size={22}
            color="#E52323"
          />
          <Text style={styles.optionText}>PIX</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => setPagamento('Cartão')}>
          <Ionicons
            name={pagamento === 'Cartão' ? 'radio-button-on' : 'radio-button-off'}
            size={22}
            color="#E52323"
          />
          <Text style={styles.optionText}>Cartão de Crédito</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => setPagamento('Boleto')}>
          <Ionicons
            name={pagamento === 'Boleto' ? 'radio-button-on' : 'radio-button-off'}
            size={22}
            color="#E52323"
          />
          <Text style={styles.optionText}>Boleto</Text>
        </TouchableOpacity>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Resumo do Pedido</Text>

          {itens.length === 0 ? (
            <Text style={styles.summaryText}>
              {logado
                ? 'Nenhum item marcado no carrinho.'
                : 'Entre na sua conta para ver o resumo.'}
            </Text>
          ) : (
            itens.map((item) => (
              <Text key={item.id} style={styles.summaryText}>
                {item.quantidade}x {item.nome}
                {item.tamanho ? ` • ${item.tamanho}` : ''}
                {item.cor ? ` • ${item.cor}` : ''} — {moeda(item.preco * item.quantidade)}
              </Text>
            ))
          )}

          <Text style={styles.summaryText}>Subtotal: {moeda(subtotal)}</Text>

          <Text style={styles.summaryText}>
            Frete:{' '}
            {calculandoFrete
              ? 'calculando...'
              : frete
                ? frete.gratis
                  ? 'Grátis'
                  : moeda(frete.valor)
                : 'informe o CEP'}
          </Text>

          {frete && (
            <Text style={styles.summaryText}>
              Entrega para {frete.uf} em até {frete.prazo} dias
            </Text>
          )}

          {!!erroFrete && (
            <Text style={[styles.summaryText, { color: '#E52323' }]}>{erroFrete}</Text>
          )}

          <Text style={styles.total}>Total: {moeda(total)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, enviando && { opacity: 0.6 }]}
          onPress={finalizarPedido}
          disabled={enviando}
        >
          <Text style={styles.buttonText}>
            {enviando ? 'Enviando...' : 'Finalizar Compra'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal transparent visible={pedidoRealizado} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.closeButton} onPress={fecharModal}>
              <Ionicons name="close" size={20} color="#333" />
            </TouchableOpacity>
            <Ionicons name="checkmark-circle" size={42} color="#22c55e" />
            <Text style={styles.modalTitle}>Pedido realizado</Text>
            <Text style={styles.modalText}>Pedido realizado com sucesso!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
