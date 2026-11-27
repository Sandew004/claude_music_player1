// Lists audio files in your Drive folder. Runs on the server, so env vars stay private.
exports.handler = async () => {
  const { DRIVE_API_KEY, DRIVE_FOLDER_ID } = process.env;
  if (!DRIVE_API_KEY || !DRIVE_FOLDER_ID)
    return { statusCode: 500, body: JSON.stringify({ error: "Missing env vars" }) };
  const q = `'${DRIVE_FOLDER_ID}' in parents and mimeType contains 'audio/' and trashed=false`;
  const url = "https://www.googleapis.com/drive/v3/files?" + new URLSearchParams({
    q, key: DRIVE_API_KEY, pageSize: "1000", orderBy: "createdTime desc",
    fields: "files(id,name,size,createdTime)"
  });
  try {
    const r = await fetch(url);
    const d = await r.json();
    if (!r.ok) return { statusCode: r.status, body: JSON.stringify(d) };
    const songs = d.files.map(f => ({ id: f.id, name: f.name.replace(/\.[^.]+$/, "") }));
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" },
      body: JSON.stringify(songs)
    };
  } catch (e) { return { statusCode: 502, body: JSON.stringify({ error: e.message }) }; }
};
