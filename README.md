# Soft Power Informática - Site

Site comercial premium para a loja Soft Power Informática, specializing in technical assistance and sales of informatics products.

## 🚀 Deploy no Netlify

### Opção 1: Importar do GitHub (Recomendado)

1. Acesse [Netlify](https://app.netlify.com)
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Conecte ao GitHub e selecione o repositório `softpower-informatica-site`
4. Configure:
   - **Build command:** (vazio - site estático)
   - **Publish directory:** `.`
5. Clique em **"Deploy site"**

### Opção 2: Drag & Drop

1. Faça o download do código
2. Acesse [Netlify Drop](https://app.netlify.com/drop)
3. Arraste a pasta do projeto
4. Pronto!

### Configurações Opcionais

- **Netlify Forms:** O formulário de orçamento já está configurado com `data-netlify="true"`. Para funcionar:
  1. No painel do Netlify, vá em **Forms**
  2. Ative o **Netlify Forms**
  3. Os envios aparecerão automaticamente

- **Domínio Próprio:**
  1. Vá em **Domain Management** → **"Add custom domain"**
  2. Configure o DNS conforme instruções do Netlify

## 📂 Estrutura do Projeto

```
softpower-informatica-site/
├── assets/
│   ├── css/
│   │   └── style.css          # Estilos principais
│   ├── js/
│   │   └── main.js           # Funcionalidades JavaScript
│   └── img/
│       └── (imagens do site)
├── index.html                 # Home (one page)
├── servicos.html              # Página de serviços
├── anuncios.html             # Catálogo de anúncios
├── orcamento.html            # Formulário de orçamento
├── obrigado.html             # Página de obrigado
├── sobre.html                # Sobre nós
├── contato.html              # Contato
└── README.md                 # Este arquivo
```

## 📱 Funcionalidades

- ✅ Site 100% responsivo (mobile first)
- ✅ Tema escuro com detalhes em laranja
- ✅ Menu mobile com hambúrguer
- ✅ Scroll suave para âncoras
- ✅ Botão flutuante do WhatsApp em todas as páginas
- ✅ Filtro de anúncios por categoria
- ✅ FAQ accordion
- ✅ Formulário de orçamento com Netlify Forms
- ✅ Mensagem automática no WhatsApp
- ✅ Integração com Google Maps

## 📞 Dados de Contato (para editar)

Para alterar os dados de contato, edite os seguintes arquivos:

### No JavaScript (`assets/js/main.js`):
```javascript
const CONFIG = {
  whatsapp: '5511958882556',
  telefone: '551141837330',
  endereco: 'Av. Inocêncio Serafico, 129 - Carapicuíba/SP',
  mapsLink: '...'
};
```

### Nos arquivos HTML:
- Substitua `5511958882556` pelo número correto (com DDI 55)
- Substitua `(11) 4183-7330` pelo telefone correto
- Atualize o endereço

## 🎨 Como Editar

### Anúncios
Edite o arquivo `anuncios.html` - cada item é um card com:
- Categoria (data-category)
- Badge (oferta/top/novo)
- Nome, descrição, preço
- Link do WhatsApp com mensagem automática

### Serviços
Edite `servicos.html` ou a seção na `index.html`

### Preços e Textos
Procure por valores como `R$ 289` ou textos como "Oferta" nos arquivos HTML.

## 📋 Netlify Forms

O formulário de orçamento está configurado com Netlify Forms. Para testar:

1. Deploy o site no Netlify
2. Acesse a página de orçamento
3. Preencha e envie o formulário
4. Vá em **"Forms"** no painel do Netlify para ver os envios

## 🔧 Tecnologias Usadas

- HTML5 semântico
- CSS3 com variáveis
- JavaScript vanilla (sem frameworks)
- Google Fonts (Inter, Orbitron)
- Font Awesome 6
- Netlify Forms
- Google Maps Embed

## 📄 Licença

Este projeto é para fins comerciais. Os dados de contato são demonstrativos.

---

Desenvolvido com ❤️ por Soft Power Informática
