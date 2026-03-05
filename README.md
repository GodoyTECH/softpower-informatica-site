# Soft Power Informática — README Master

## Visão geral
Site institucional + catálogo com modo atual **WhatsApp-only**.

### Modo atual
- `WHATSAPP_ONLY_MODE = true`
- Botões de compra/carrinho/checkout ficam ocultos e bloqueados.
- CTA principal: **Quero esse item** / **Quero esse serviço**.
- Estrutura de e-commerce continua no repositório (sem deletar rotas/arquivos).

---

## Onde alterar o quê (rápido)

- Config WhatsApp + flag:
  - `assets/js/store.js`
  - `assets/js/main.js`
- Funções centrais WhatsApp:
  - `assets/js/whatsapp-mode.js`
- Catálogo real (fonte atual):
  - `data/products.json`
- Promoções (slider separado, referenciando IDs reais):
  - `data/promotions.json`
- Loja:
  - `assets/js/loja.js`
- Produto:
  - `assets/js/produto.js`
- Bloqueio de páginas de carrinho/checkout em modo WhatsApp-only:
  - `assets/js/carrinho.js`
  - `assets/js/checkout.js`

---

## Como alterar WhatsApp da loja

Defina:
- `VITE_STORE_WHATSAPP_NUMBER` (recomendado no deploy)

Fallback local:
- `assets/js/store.js` / `assets/js/main.js`

Formato esperado: `55119XXXXXXXX` (somente números).

---

## Como funciona o CTA “Quero esse item”

Funções obrigatórias centrais:
- `buildWhatsAppMessage(item)`
- `openWhatsApp(message)`

Arquivo:
- `assets/js/whatsapp-mode.js`

Template enviado:
- item
- preço
- detalhes curtos
- ID
- link da página

---

## Admin

### Páginas
- `admin.html` (produtos)
- `dashpedidos.html` (pedidos/serviços)

### Observação importante
Atualmente o front da loja usa `data/products.json` como fonte de catálogo.
Admin deve editar **itens reais** (mesma fonte), sem inventar catálogo paralelo.

### IDs
- Todo item precisa de `id` estável no catálogo.
- Cards no front carregam `data-item-id`.

---

## Promoções (slider)

Gerenciado separado em:
- `data/promotions.json`

Regras:
- Cada promoção referencia item real por `item_id`.
- `sort_order` define ordem.
- `headline` e `subtext` podem ser customizados sem alterar descrição principal.

---

## Supabase (passo a passo)

1. Criar projeto no Supabase.
2. SQL Editor → colar `supabase/schema.sql`.
3. Criar bucket Storage `items`.
4. Configurar variáveis no Netlify.

Documentação completa:
- `docs/SUPABASE_SCHEMA.md`
- `docs/SUPABASE_SETUP.md`
- `supabase/schema.sql`

---

## Variáveis de ambiente

Obrigatórias:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STORE_WHATSAPP_NUMBER`

Se usar escrita segura (backend/functions):
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)

Admin auth (se habilitado):
- `ADMIN_USER`
- `ADMIN_PASS`
- `ADMIN_JWT_SECRET`

---

## Teste rápido (QA)

1. Verificar que não aparecem botões Comprar/Carrinho/Checkout.
2. Verificar tabulação/teclado (sem foco nesses elementos).
3. Clicar em **Quero esse item/serviço** em:
   - Home (slider)
   - Loja (cards)
   - Produto (detalhe)
4. Confirmar WhatsApp com mensagem completa.
5. Abrir `carrinho.html` e `checkout.html` por URL direta e validar aviso de “Compras online em breve”.

---

## Troubleshooting

### CTA não abre WhatsApp
- Verifique `VITE_STORE_WHATSAPP_NUMBER`.
- Confirme que está em formato numérico, sem `+`.

### Supabase sem dados
- Conferir `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
- Verificar políticas RLS e tabela com dados ativos.

### CORS / REST
- Validar URL e headers `apikey`/`Authorization`.

---

## Observação
Mudanças aplicadas com abordagem mínima e reversível, preservando estrutura do e-commerce para futura reativação.
