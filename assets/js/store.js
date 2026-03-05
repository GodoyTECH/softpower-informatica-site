export const STORE_CONFIG = {
  WHATSAPP_ONLY_MODE: true,
  STORE_WHATSAPP_NUMBER: (window.VITE_STORE_WHATSAPP_NUMBER || window.APP_CONFIG?.whatsapp || '5511958882556').replace(/\D/g, '')
};

export function formatPriceBRL(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}
