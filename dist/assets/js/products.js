export async function loadProducts() {
  const res = await fetch('data/products.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Falha ao carregar catálogo de produtos.');
  return res.json();
}

export function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}

export function getProductById(products, id) {
  return products.find((p) => p.id === id) || null;
}

export function getCategoryList(products) {
  return [...new Set(products.map((p) => p.categoria))];
}
