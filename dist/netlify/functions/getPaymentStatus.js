export default async (req) => {
  const id = req.queryStringParameters?.id;
  if (!id) return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'id obrigatório' }) };

  // Futuro: consultar status em orders (Supabase) e/ou gateway
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, id, status: 'pending', source: 'placeholder' })
  };
};
