# Supabase Setup — Soft Power Informática

## 1) Criar projeto
1. Acesse Supabase e crie um projeto.
2. Copie `Project URL` e `anon key`.

## 2) Executar schema SQL
1. Abra **SQL Editor**.
2. Cole o conteúdo de `supabase/schema.sql`.
3. Execute tudo.

## 3) Criar bucket de imagens
1. Vá em **Storage**.
2. Crie bucket `items`.
3. Estrutura recomendada de paths:
   - `items/<item_id>/main.png`
   - `items/<item_id>/gallery/<n>.png`

O banco salva só path, ex:
- `image_main_path = items/<item_id>/main.png`
- `item_images.path = items/<item_id>/gallery/1.png`

## 4) Variáveis de ambiente
Defina no Netlify:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STORE_WHATSAPP_NUMBER`

Se houver backend/admin com escrita segura:
- `SUPABASE_SERVICE_ROLE_KEY` (**NUNCA expor no front-end**)

Se usar login admin por function:
- `ADMIN_USER`
- `ADMIN_PASS`
- `ADMIN_JWT_SECRET`

## 5) Teste rápido
1. Inserir item em `items`.
2. Inserir promoção em `promotions` com `item_id` do item criado.
3. Validar no site: slider deve mostrar item real da tabela de promoções.

## 6) Observações de segurança
- Mantenha RLS ligado.
- Escrita pública bloqueada.
- Service role somente em funções server-side.
