const CART_KEY = 'softpower_cart_v1';

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      nome: product.nome,
      preco: Number(product.preco || 0),
      imagem: product.imagem,
      quantity
    });
  }

  saveCart(cart);
  return cart;
}

export function updateItemQuantity(id, quantity) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return cart;

  item.quantity = Math.max(1, Number(quantity || 1));
  saveCart(cart);
  return cart;
}

export function removeFromCart(id) {
  const cart = getCart().filter((i) => i.id !== id);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
}

export function getCartTotals(cart = getCart()) {
  const subtotal = cart.reduce((acc, item) => acc + Number(item.preco) * Number(item.quantity), 0);
  return { subtotal, total: subtotal };
}
