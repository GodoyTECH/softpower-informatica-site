exports.handler = async (event) => {
  const id = event.queryStringParameters?.id;
  if (!id) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'id obrigatório' }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, id, status: 'pending', source: 'placeholder' })
  };
};
