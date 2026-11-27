// Lists songs + matches album art (image with the same file name as the song) from your Drive folder.
exports.handler = async () => {
  const { DRIVE_API_KEY, DRIVE_FOLDER_ID } = process.env;
  if (!DRIVE_API_KEY || !DRIVE_FOLDER_ID)
    return { statusCode: 500, body: JSON.stringify({ error: "Missing env vars" }) };
  const q = `'${DRIVE_FOLDER_ID}' in parents and (mimeType contains 'audio/' or mimeType contains 'image/') and trashed=false`;
  try {
    let files = [], token;
    do {
      const p = { q, key: DRIVE_API_KEY, pageSize: "1000", orderBy: "createdTime desc", fields: "nextPageToken,files(id,name,mimeType,modifiedTime)" };
      if (token) p.pageToken = token;
      const r = await fetch("https://www.googleapis.com/drive/v3/files?" + new URLSearchParams(p));
      const d = await r.json();
      if (!r.ok) return { statusCode: r.status, body: JSON.stringify(d) };
      files = files.concat(d.files); token = d.nextPageToken;
    } while (token && files.length < 5000);
    const norm = n => n.replace(/\.[^.]+$/, "").trim().toLowerCase();
    const imgs = new Map();
    files.filter(f => /^image\/(png|jpe?g|webp|gif|bmp|avif)$/.test(f.mimeType))
         .forEach(f => { const k = norm(f.name); if (!imgs.has(k)) imgs.set(k, f); });
    const songs = files.filter(f => f.mimeType.startsWith("audio/")).map(f => {
      const a = imgs.get(norm(f.name));
      return { id: f.id, name: f.name.replace(/\.[^.]+$/, ""), art: a ? { id: a.id, v: Date.parse(a.modifiedTime) } : null };
    });
    return { statusCode: 200, headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" }, body: JSON.stringify(songs) };
  } catch (e) { return { statusCode: 502, body: JSON.stringify({ error: e.message }) }; }
};
