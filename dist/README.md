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
