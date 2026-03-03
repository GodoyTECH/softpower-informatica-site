# Soft Power Informática — Site + E-commerce MVP

Site institucional da Soft Power Informática com:
- páginas comerciais
- orçamento via WhatsApp (com dados do formulário)
- estrutura inicial de e-commerce (catálogo, produto, carrinho e checkout)

---

## ✅ Status atual

- **Botão de orçamento via WhatsApp corrigido:** sim, agora envia **direto** para o WhatsApp com mensagem montada do formulário.
- **E-commerce MVP criado:** sim (`loja.html`, `produto.html`, `carrinho.html`, `checkout.html`, `data/products.json`).
- **Netlify preparado para site estático:** sim (`netlify.toml` na raiz).

---

## 🚀 Deploy no Netlify

### Site estático (config atual)
- **Build command:** *(vazio)*
- **Publish directory:** `.`

Também existe `netlify.toml` na raiz com cache básico e redirect de `/` para `/index.html`.

---

## 📁 Estrutura principal

```txt
softpower-site/
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── ecommerce.css
│   └── js/
│       ├── main.js
│       ├── products.js
│       ├── cart.js
│       ├── loja.js
│       ├── produto.js
│       ├── carrinho.js
│       ├── checkout.js
│       └── payments.js
├── data/
│   └── products.json
├── index.html
├── orcamento.html
├── loja.html
├── produto.html
├── carrinho.html
├── checkout.html
└── netlify.toml
```

---

## 🔧 Configuração página por página

## 1) `/orcamento.html`

### O que faz
Formulário de orçamento com envio para WhatsApp da loja.

### Arquivos envolvidos
- `orcamento.html`
- `assets/js/main.js`

### Como funciona
Ao enviar:
1. valida campos obrigatórios
2. monta mensagem com os campos
3. aplica `encodeURIComponent`
4. abre `https://wa.me/55DDDNÚMERO?text=...`

### Campos usados na mensagem
- Nome
- WhatsApp
- Tipo de equipamento
- Serviço
- Descrição
- Urgência

### Número da loja
Definido em `assets/js/main.js`:

```js
const CONFIG = {
  whatsapp: '5511958882556'
};
```

> Para trocar, edite esse valor no formato `55DDDNÚMERO`.

### Fallback de URL longa
Se a mensagem ficar muito grande:
- abre versão resumida
- tenta copiar versão completa para área de transferência

---

## 2) `/loja.html`

### O que faz
Exibe catálogo com:
- busca
- filtro por categoria
- badges
- botão "Adicionar"
- botão "Ver detalhes"

### Arquivos envolvidos
- `loja.html`
- `assets/js/loja.js`
- `assets/js/products.js`
- `assets/js/cart.js`
- `assets/css/ecommerce.css`
- `data/products.json`

### Como editar
Edite produtos em `data/products.json`.

---

## 3) `/produto.html`

### O que faz
Página de detalhe por query string, ex:
- `produto.html?id=ssd-sata-480gb`

### Arquivos envolvidos
- `produto.html`
- `assets/js/produto.js`
- `assets/js/products.js`
- `assets/js/cart.js`

### Como funciona
- lê `id` da URL
- busca item no `products.json`
- mostra detalhes
- permite adicionar ao carrinho
- botão WhatsApp para o produto

---

## 4) `/carrinho.html`

### O que faz
Carrinho com `localStorage`:
- listar itens
- alterar quantidade
- remover item
- mostrar subtotal/total
- botão para checkout

### Arquivos envolvidos
- `carrinho.html`
- `assets/js/carrinho.js`
- `assets/js/cart.js`

### Chave de armazenamento
- `softpower_cart_v1`

---

## 5) `/checkout.html`

### O que faz
Coleta dados do cliente e finaliza pedido via WhatsApp.

### Campos
- nome
- whatsapp
- entrega/retirada
- endereço (se entrega)
- observações

### CTAs
- **Finalizar pelo WhatsApp**: gera resumo do pedido e abre WhatsApp
- **Pagar online (em breve)**: placeholder

### Arquivos envolvidos
- `checkout.html`
- `assets/js/checkout.js`
- `assets/js/payments.js`

---

## 6) `/data/products.json`

### O que faz
Fonte única do catálogo MVP.

### Estrutura de cada item
```json
{
  "id": "ssd-sata-480gb",
  "nome": "SSD SATA 480GB",
  "categoria": "Upgrades (SSD/RAM)",
  "preco": 289.9,
  "descricao": "...",
  "destaque": true,
  "badge": "Promo",
  "imagem": "https://via.placeholder.com/...",
  "estoque": 15
}
```

### Como editar
- Adicione/remova objetos do array
- `id` deve ser único
- `preco` numérico
- `imagem` pode ser URL local ou externa

---

## 💳 Preparação de pagamento futuro

Arquivo: `assets/js/payments.js`

Interface pronta:
- `createCheckoutSession(cart, customer)`
- `redirectToPayment(url)`

Atualmente é placeholder para integrar depois com Mercado Pago / Stripe.

---

## 🧪 Testes recomendados

1. **Orçamento WhatsApp (desktop e mobile)**
   - preencher formulário em `orcamento.html`
   - clicar em enviar
   - confirmar mensagem no WhatsApp

2. **Fluxo e-commerce**
   - `loja.html` → adicionar produto
   - `carrinho.html` → alterar qtd/remover
   - `checkout.html` → finalizar pelo WhatsApp

3. **Catálogo**
   - editar `data/products.json`
   - recarregar `loja.html`

---

## 📌 Observações

- O envio de orçamento via WhatsApp **não usa plugin externo**.
- O formulário mantém compatibilidade com Netlify Forms.
- E-commerce atual é MVP sem backend de pagamento.

## Configuração manual (produção)

### Variáveis de Ambiente (Netlify)

Defina no Netlify:
```bash
VITE_STORE_WHATSAPP=5511958882556
VITE_GOOGLE_REVIEW_URL=https://...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=xxxx
MP_ACCESS_TOKEN=xxxx
MP_WEBHOOK_SECRET=xxxx
```

---

### Banco de Dados (Supabase)

Crie no Supabase as seguintes tabelas:

#### 1) Produtos (para Dashboard)
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT,
  preco NUMERIC NOT NULL,
  descricao TEXT,
  destaque BOOLEAN DEFAULT false,
  badge TEXT,
  imagem TEXT,
  estoque INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2) Clientes
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  consent_lgpd BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3) Pedidos/Orçamentos
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT DEFAULT 'site', -- 'site' ou 'whatsapp'
  client_name TEXT,
  client_phone TEXT,
  itens JSONB,
  total NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pendente', -- 'pendente', 'pago', 'reprovado', 'entregue'
  forma_pagamento TEXT, -- 'pix', 'cartao', 'boleto'
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);
```

#### 4) Orçamentos (SofiPower)
```sql
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT,
  client_phone TEXT,
  type TEXT, -- 'venda' ou 'servico'
  category TEXT,
  description TEXT,
  urgency TEXT DEFAULT 'media', -- 'baixa', 'media', 'alta'
  priority TEXT DEFAULT 'normal', -- 'normal', 'urgente'
  status TEXT DEFAULT 'aberto', -- 'aberto', 'em_andamento', 'fechado', 'perdido'
  estimated_value NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5) Avaliações
```sql
CREATE TABLE product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT,
  name TEXT,
  rating INT,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Status de Pedidos

| Status | Significado |
|--------|-------------|
| `pendente` | Aguardando pagamento |
| `pago` | Pago e confirmado |
| `reprovado` | Pagamento recusado |
| `entregue` | Produto/serviço entregue |

---

### Prioridade e Urgência (Orçamentos)

| Campo | Valores |
|-------|---------|
| `urgencia` | `baixa`, `media`, `alta` |
| `priority` | `normal`, `urgente` |

---

### Fluxo de Vendas

```
Cliente compra no Site
    ↓
Gateway pagamento (Mercado Pago / PIX)
    ↓
Webhook → Atualiza status no banco (pago/pendente)
    ↓
Admin confirma recebimento
    ↓
PowerAdmin pode verificar
```

---

### Como a SofiPower salva Orçamento

1. Cliente fecha orçamento no WhatsApp
2. SofiPower salva na tabela `quotes`
3. Dashboard exibe em "Orçamentos/Serviços"

---

### Como o PowerAdmin controla

**Você pergunta:**
> "Power, quais pedidos pagos temos?"

**PowerAdmin responde:**
> "Temos 5 pedidos pagos hoje!
> | ID | Cliente | Valor | Status |
> |-----|---------|-------|--------|
> | 001 | João | R$500 | ✅ Pago |
> | 002 | Maria | R$300 | ✅ Pago |"

**Para marcar como pago:**
> "Power, marca o pedido 001 como pago"

---

### Dashboard - Telas

1. **Produtos** - Editar catálogo
2. **Pedidos** - Ver compras do site (com status)
3. **Orçamentos/Serviços** - Ver orçamentos da SofiPower (com prioridade/urgência)
```sql
CREATE TABLE product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT,
  name TEXT,
  rating INT,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Dashboard Administrativa

Para editar produtos em tempo real:

1. **Crie um projeto no Supabase** (supabase.com)
2. **Configure as tabelas** acima
3. **Crie uma dashboard** que:
   - Faz login admin
   - Lista produtos do Supabase
   - Permite editar: nome, preco, descricao, categoria, destaque, badge, imagem, estoque
   - Ao salvar → atualiza no Supabase → site atualiza instantaneamente

4. **Variáveis da Dashboard:**
   ```
   VITE_SUPABASE_URL=xxxx
   VITE_SUPABASE_ANON_KEY=xxxx
   ```

---

### Atualização Instantânea

Fluxo:
```
Dashboard → API → Supabase → Site (lê do banco)
```

- Dashboard edita produto → Salva no Supabase
- Site modifica para ler do Supabase (em vez de products.json)
- Atualização é instantânea (sem deploy)

---

### Número do WhatsApp da Loja

Definido em `assets/js/main.js`:
```js
const CONFIG = {
  whatsapp: '5511958882556'
};
```

Para trocar, edite esse valor.
