export type CartItem = {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  selecionado: boolean;
};

type AppStore = {
  user: {
    nome: string;
    email: string;
    senha: string;
    dataNascimento: string;
  } | null;
  favorites: number[];
  cart: CartItem[];
};

const STORAGE_KEY = 'fitzone_store';

const defaultStore: AppStore = {
  user: null,
  favorites: [],
  cart: [],
};

function readFromStorage(): AppStore {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return { ...defaultStore, ...JSON.parse(raw) };
      }
    }
  } catch {
    // ignore storage issues in unsupported environments
  }

  const globalStore = (globalThis as any).__fitzone_store__;
  if (globalStore) {
    return { ...defaultStore, ...globalStore };
  }

  return defaultStore;
}

function writeToStorage(store: AppStore) {
  const payload = JSON.stringify(store);

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, payload);
    }
  } catch {
    // ignore storage issues in unsupported environments
  }

  (globalThis as any).__fitzone_store__ = store;
}

export function getAppStore(): AppStore {
  return readFromStorage();
}

export function saveUser(user: AppStore['user']) {
  const store = readFromStorage();
  const nextStore = { ...store, user };
  writeToStorage(nextStore);
}

export function clearUser() {
  const store = readFromStorage();
  const nextStore = { ...store, user: null };
  writeToStorage(nextStore);
}

export function getFavorites(): number[] {
  return readFromStorage().favorites;
}

export function toggleFavorite(productId: number) {
  const store = readFromStorage();
  const favorites = store.favorites.includes(productId)
    ? store.favorites.filter((id) => id !== productId)
    : [...store.favorites, productId];

  const nextStore = { ...store, favorites };
  writeToStorage(nextStore);

  return favorites;
}

export function isFavorite(productId: number) {
  return getFavorites().includes(productId);
}

export function getCart(): CartItem[] {
  return readFromStorage().cart;
}

export function saveCart(cart: CartItem[]) {
  const store = readFromStorage();
  const nextStore = { ...store, cart };
  writeToStorage(nextStore);
  return cart;
}

export function addToCart(product: Omit<CartItem, 'quantidade' | 'selecionado'>) {
  const store = readFromStorage();
  const existing = store.cart.find((item) => item.id === product.id);

  const nextCart = existing
    ? store.cart.map((item) =>
        item.id === product.id
          ? { ...item, quantidade: item.quantidade + 1, selecionado: true }
          : item,
      )
    : [...store.cart, { ...product, quantidade: 1, selecionado: true }];

  writeToStorage({ ...store, cart: nextCart });
  return nextCart;
}

export function updateCartItemQuantity(id: number, quantidade: number) {
  const store = readFromStorage();
  const nextCart = store.cart.map((item) =>
    item.id === id ? { ...item, quantidade: Math.max(1, quantidade) } : item,
  );

  writeToStorage({ ...store, cart: nextCart });
  return nextCart;
}

export function toggleCartItemSelected(id: number) {
  const store = readFromStorage();
  const nextCart = store.cart.map((item) =>
    item.id === id ? { ...item, selecionado: !item.selecionado } : item,
  );

  writeToStorage({ ...store, cart: nextCart });
  return nextCart;
}
