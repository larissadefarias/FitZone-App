import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { supabase } from "../../services/supabase";

const VERMELHO = "#e52323";
const STATUS = ["Todos", "Pendente", "Processando", "Enviado", "Entregue", "Cancelado"];

type Pedido = {
  id: string | number;
  cliente_nome?: string | null;
  nome_cliente?: string | null;
  cliente?: string | null;
  created_at?: string | null;
  data?: string | null;
  total?: number | string | null;
  valor_total?: number | string | null;
  status?: string | null;
  [key: string]: any;
};

function formatarData(valor?: string | null) {
  if (!valor) return "Data não informada";
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return String(valor);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatarMoeda(valor: unknown) {
  const numero = Number(valor ?? 0);
  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function normalizarStatus(status?: string | null) {
  return String(status || "Pendente").trim();
}

function corStatus(status: string) {
  const valor = status.toLowerCase();
  if (valor === "entregue") return "#16794b";
  if (valor === "enviado") return "#2459a9";
  if (valor === "cancelado") return "#b42318";
  if (valor === "processando") return "#986600";
  return "#777777";
}

export default function PedidosAdmin() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [filtro, setFiltro] = useState("Todos");
  const [pedidoAtualizando, setPedidoAtualizando] = useState<string | number | null>(null);
  const [erro, setErro] = useState("");

  const carregarPedidos = useCallback(async (silencioso = false) => {
    if (!silencioso) setCarregando(true);
    setErro("");

    // Ajuste "pedidos" e os nomes das colunas caso seu banco use outra estrutura.
    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar pedidos:", error.message);
      setErro("Não foi possível carregar os pedidos. Confira a tabela e as permissões no Supabase.");
      setPedidos([]);
    } else {
      setPedidos((data ?? []) as Pedido[]);
    }

    setCarregando(false);
    setAtualizando(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarPedidos();
    }, [carregarPedidos])
  );

  const atualizarStatus = (pedido: Pedido, novoStatus: string) => {
    const statusAtual = normalizarStatus(pedido.status);
    if (statusAtual.toLowerCase() === novoStatus.toLowerCase()) return;

    Alert.alert(
      "Atualizar pedido",
      `Alterar o status do pedido #${pedido.id} para "${novoStatus}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            setPedidoAtualizando(pedido.id);
            const { error } = await supabase
              .from("pedidos")
              .update({ status: novoStatus })
              .eq("id", pedido.id);

            if (error) {
              console.error("Erro ao atualizar pedido:", error.message);
              Alert.alert(
                "Não foi possível atualizar",
                "Confira se a coluna status existe e se as políticas do Supabase permitem a alteração."
              );
            } else {
              setPedidos((lista) =>
                lista.map((item) =>
                  item.id === pedido.id ? { ...item, status: novoStatus } : item
                )
              );
            }
            setPedidoAtualizando(null);
          },
        },
      ]
    );
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    if (filtro === "Todos") return true;
    return normalizarStatus(pedido.status).toLowerCase() === filtro.toLowerCase();
  });

  const renderPedido = ({ item }: { item: Pedido }) => {
    const nomeCliente =
      item.cliente_nome || item.nome_cliente || item.cliente || "Cliente não informado";
    const dataPedido = item.created_at || item.data;
    const total = item.total ?? item.valor_total;
    const status = normalizarStatus(item.status);

    return (
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#eee",
          padding: 16,
          marginBottom: 12,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#777", fontSize: 12 }}>PEDIDO</Text>
            <Text style={{ color: "#222", fontSize: 17, fontWeight: "bold", marginTop: 3 }}>
              #{item.id}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: `${corStatus(status)}18`,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 20,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ color: corStatus(status), fontSize: 12, fontWeight: "700" }}>
              {status}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 14, gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="person-outline" size={17} color="#777" />
            <Text style={{ color: "#444", marginLeft: 8, flex: 1 }}>{nomeCliente}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="calendar-outline" size={17} color="#777" />
            <Text style={{ color: "#666", marginLeft: 8 }}>{formatarData(dataPedido)}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="cash-outline" size={17} color="#777" />
            <Text style={{ color: VERMELHO, marginLeft: 8, fontSize: 16, fontWeight: "bold" }}>
              {formatarMoeda(total)}
            </Text>
          </View>
        </View>

        <Text style={{ color: "#444", fontWeight: "700", marginTop: 18, marginBottom: 9 }}>
          Atualizar status
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {STATUS.filter((s) => s !== "Todos").map((statusOpcao) => {
            const selecionado = status.toLowerCase() === statusOpcao.toLowerCase();
            return (
              <TouchableOpacity
                key={statusOpcao}
                disabled={selecionado || pedidoAtualizando === item.id}
                onPress={() => atualizarStatus(item, statusOpcao)}
                style={{
                  borderWidth: 1,
                  borderColor: selecionado ? VERMELHO : "#ddd",
                  backgroundColor: selecionado ? "#fde8e8" : "#fff",
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  opacity: pedidoAtualizando === item.id ? 0.5 : 1,
                }}
              >
                <Text
                  style={{
                    color: selecionado ? VERMELHO : "#555",
                    fontSize: 12,
                    fontWeight: selecionado ? "700" : "500",
                  }}
                >
                  {statusOpcao}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {pedidoAtualizando === item.id && (
          <ActivityIndicator color={VERMELHO} style={{ marginTop: 10 }} />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ flexDirection: "row", alignItems: "center", marginBottom: 18 }}
        >
          <Ionicons name="arrow-back" size={22} color={VERMELHO} />
          <Text style={{ marginLeft: 7, color: VERMELHO, fontSize: 15 }}>Painel administrativo</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#222" }}>Pedidos</Text>
        <Text style={{ color: "#666", marginTop: 5 }}>
          Consulte as compras e atualize o andamento dos pedidos.
        </Text>
        <Text style={{ color: "#777", marginTop: 12, fontSize: 13 }}>
          {pedidos.length} {pedidos.length === 1 ? "pedido cadastrado" : "pedidos cadastrados"}
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
        <FlatList
          horizontal
          data={STATUS}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setFiltro(item)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: 22,
                backgroundColor: filtro === item ? VERMELHO : "#fff",
                borderWidth: 1,
                borderColor: filtro === item ? VERMELHO : "#e5e5e5",
              }}
            >
              <Text style={{ color: filtro === item ? "#fff" : "#555", fontWeight: "600" }}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {carregando ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={VERMELHO} />
          <Text style={{ color: "#666", marginTop: 10 }}>Carregando pedidos...</Text>
        </View>
      ) : erro ? (
        <View style={{ margin: 20, padding: 18, backgroundColor: "#fff", borderRadius: 12 }}>
          <Ionicons name="alert-circle-outline" size={32} color={VERMELHO} />
          <Text style={{ color: "#333", fontWeight: "700", marginTop: 8 }}>Erro ao carregar pedidos</Text>
          <Text style={{ color: "#666", marginTop: 6 }}>{erro}</Text>
          <TouchableOpacity
            onPress={() => carregarPedidos()}
            style={{ backgroundColor: VERMELHO, padding: 12, borderRadius: 8, marginTop: 14 }}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pedidosFiltrados}
          keyExtractor={(item, index) => String(item.id ?? index)}
          renderItem={renderPedido}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => {
                setAtualizando(true);
                carregarPedidos(true);
              }}
              tintColor={VERMELHO}
            />
          }
          ListEmptyComponent={
            <View style={{ alignItems: "center", padding: 30, marginTop: 30 }}>
              <Ionicons name="receipt-outline" size={54} color="#ccc" />
              <Text style={{ color: "#333", fontSize: 17, fontWeight: "700", marginTop: 12 }}>
                Nenhum pedido encontrado
              </Text>
              <Text style={{ color: "#777", textAlign: "center", marginTop: 6 }}>
                {filtro === "Todos"
                  ? "Quando houver pedidos no banco, eles aparecerão aqui."
                  : `Não há pedidos com status "${filtro}".`}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
