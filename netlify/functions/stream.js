// Redirects the audio element to Drive's media endpoint (supports seeking/range requests).
exports.handler = async (event) => {
  const id = (event.queryStringParameters || {}).id;
  if (!id || !/^[\w-]+$/.test(id)) return { statusCode: 400, body: "Bad id" };
  return {
    statusCode: 302,
    headers: { Location: `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${process.env.DRIVE_API_KEY}` }
  };
};
