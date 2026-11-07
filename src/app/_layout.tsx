import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    
<Tabs
  backBehavior="history"
  screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: '#D71920',
    tabBarInactiveTintColor: '#000000',
  }}
>
  {/* ABAS VISÍVEIS */}
  <Tabs.Screen
    name="index"
    options={{
      title: 'Início',
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="home-outline" size={size} color={color} />
      ),
    }}
  />

  <Tabs.Screen
    name="categorias"
    options={{
      title: 'Categorias',
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="grid-outline" size={size} color={color} />
      ),
    }}
  />

  <Tabs.Screen
    name="carrinho"
    options={{
      title: 'Carrinho',
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="cart-outline" size={size} color={color} />
      ),
    }}
  />

  <Tabs.Screen
    name="favoritos"
    options={{
      title: 'Favoritos',
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="heart-outline" size={size} color={color} />
      ),
    }}
  />

  {/* TELAS ESCONDIDAS DA BARRA */}
  <Tabs.Screen name="cadastro" options={{ href: null }} />
  <Tabs.Screen name="login" options={{ href: null }} />
  <Tabs.Screen name="produtos" options={{ href: null }} />
  <Tabs.Screen name="produto/[id]" options={{ href: null }} />
  <Tabs.Screen name="finalizacaoDePedido" options={{ href: null }} />
  <Tabs.Screen name="explore" options={{ href: null }} />
  <Tabs.Screen name="perfil" options={{ href: null }} />
  <Tabs.Screen name="admin" options={{ href: null }} />
  <Tabs.Screen name="admin/produtos" options={{ href: null }} />
  <Tabs.Screen
  name="admin/pedidos"
  options={{
    href: null,
  }}
/>
<Tabs.Screen
  name="meus-pedidos"
  options={{ href: null }}
/>

<Tabs.Screen
  name="admin/funcionarios"
  options={{ href: null }}
/>
    </Tabs>
  );
}