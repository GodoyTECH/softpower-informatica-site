// Gateway de pagamento (Mercado Pago via Netlify Functions)
export async function createCheckoutSession(cart, customer) {
  const res = await fetch('/.netlify/functions/createCheckout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cart, customer })
  });

  if (!res.ok) return null;
  return res.json();
}

export function redirectToPayment(url) {
  if (!url) return false;
  window.location.href = url;
  return true;
}
