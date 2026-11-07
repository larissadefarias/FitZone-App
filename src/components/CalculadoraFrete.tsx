import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';

// Mantenha igual ao valor "c_gratis_acima" da função calcular_frete no banco.
const FRETE_GRATIS_ACIMA = 299;

type Props = {
  visivel: boolean;
  onFechar: () => void;
};

type Resultado = {
  uf: string;
  valor: number;
  prazo: number;
  gratis: boolean;
};

const moeda = (valor: number) => `R$ ${valor.toFixed(2).replace('.', ',')}`;

// Formata enquanto digita: 20040020 -> 20040-020
function mascararCep(texto: string) {
  const n = texto.replace(/\D/g, '').slice(0, 8);
  if (n.length <= 5) return n;
  return `${n.slice(0, 5)}-${n.slice(5)}`;
}

export function CalculadoraFrete({ visivel, onFechar }: Props) {
  const [cep, setCep] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [resultado, setResultado] = useState<Resultado | null>(null);

  async function calcular() {
    const digitos = cep.replace(/\D/g, '');

    if (digitos.length !== 8) {
      setResultado(null);
      setErro('Digite um CEP com 8 números.');
      return;
    }

    setCarregando(true);
    setErro('');
    setResultado(null);

    const { data, error } = await supabase.rpc('calcular_frete', {
      p_cep: digitos,
      p_subtotal: 0,
    });

    setCarregando(false);

    if (error) {
      console.log('Erro ao calcular frete:', error.message);
      setErro(
        error.message.includes('Could not find the function')
          ? 'O cálculo de frete ainda não foi configurado no banco.'
          : error.message,
      );
      return;
    }

    const linha = Array.isArray(data) ? data[0] : data;

    if (!linha) {
      setErro('Não foi possível calcular o frete para esse CEP.');
      return;
    }

    setResultado({
      uf: linha.uf_destino,
      valor: Number(linha.valor_frete),
      prazo: linha.prazo_entrega,
      gratis: linha.frete_gratis,
    });
  }

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={onFechar}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={estilos.raiz}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Toque na área escura para fechar */}
        <Pressable style={estilos.fundo} onPress={onFechar} />

        <View style={estilos.cartao}>
          <View style={estilos.topo}>
            <View style={estilos.tituloLinha}>
              <Ionicons name="car-outline" size={24} color="#e52323" />
              <Text style={estilos.titulo}>Calcular frete</Text>
            </View>

            <TouchableOpacity onPress={onFechar} hitSlop={12}>
              <Ionicons name="close" size={24} color="#222222" />
            </TouchableOpacity>
          </View>

          <Text style={estilos.descricao}>
            Informe o CEP de entrega para ver o valor e o prazo.
          </Text>

          <TextInput
            style={estilos.input}
            placeholder="00000-000"
            placeholderTextColor="#999999"
            value={cep}
            onChangeText={(t) => setCep(mascararCep(t))}
            keyboardType="numeric"
            maxLength={9}
            onSubmitEditing={calcular}
          />

          <TouchableOpacity
            style={[estilos.botao, carregando && { opacity: 0.6 }]}
            onPress={calcular}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={estilos.botaoTexto}>Calcular</Text>
            )}
          </TouchableOpacity>

          {!!erro && <Text style={estilos.erro}>{erro}</Text>}

          {resultado && (
            <View style={estilos.resultado}>
              <Text style={estilos.resultadoUf}>Entrega para {resultado.uf}</Text>

              <Text style={estilos.resultadoValor}>
                {resultado.gratis ? 'Frete grátis' : moeda(resultado.valor)}
              </Text>

              <Text style={estilos.resultadoPrazo}>
                Prazo: até {resultado.prazo} dias
              </Text>
            </View>
          )}

          <Text style={estilos.rodape}>
            Frete grátis em compras acima de {moeda(FRETE_GRATIS_ACIMA)}.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  raiz: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  fundo: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cartao: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tituloLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111111',
  },
  descricao: {
    color: '#666666',
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 10,
    padding: 13,
    fontSize: 16,
    color: '#222222',
    marginBottom: 12,
  },
  botao: {
    backgroundColor: '#e52323',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  erro: {
    color: '#e52323',
    marginTop: 12,
  },
  resultado: {
    marginTop: 16,
    backgroundColor: '#fff5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  resultadoUf: {
    color: '#555555',
    fontSize: 14,
  },
  resultadoValor: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#e52323',
    marginVertical: 4,
  },
  resultadoPrazo: {
    color: '#333333',
    fontSize: 15,
  },
  rodape: {
    marginTop: 14,
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
  },
});
