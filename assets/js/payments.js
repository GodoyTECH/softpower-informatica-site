// Placeholder para futuras integrações (Mercado Pago / Stripe)
export async function createCheckoutSession(_cart, _customer) {
  // Futuro: chamar backend com itens e cliente
  return null;
}

export function redirectToPayment(url) {
  if (!url) return false;
  window.location.href = url;
  return true;
}
