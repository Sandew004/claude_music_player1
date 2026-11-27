// Streams audio from Drive through your own domain, in range-based chunks (keeps seeking + the API key private).
const CHUNK = 3.5 * 1024 * 1024; // stays under Netlify's 6 MB response limit

export default async (req, context) => {
  const id = context.params.id || "";
  if (!/^[\w-]+$/.test(id)) return new Response("Bad id", { status: 400 });

  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get("range") || "");
  let range;
  if (m && !m[1] && m[2]) range = `bytes=-${m[2]}`; // suffix range
  else {
    const start = m && m[1] ? parseInt(m[1], 10) : 0;
    let end = m && m[2] ? parseInt(m[2], 10) : start + CHUNK - 1;
    end = Math.min(end, start + CHUNK - 1);
    range = `bytes=${start}-${end}`;
  }

  const up = await fetch(
    `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${process.env.DRIVE_API_KEY}`,
    { headers: { Range: range } }
  );
  if (up.status !== 200 && up.status !== 206)
    return new Response(await up.text(), { status: up.status, headers: { "Content-Type": "application/json" } });

  const buf = await up.arrayBuffer();
  const ct = up.headers.get("content-type") || "";
  const headers = {
    "Content-Type": ct.startsWith("audio/") ? ct : "audio/mpeg",
    "Accept-Ranges": "bytes",
    "Content-Length": String(buf.byteLength),
    "Cache-Control": "private, max-age=3600",
  };
  if (up.status === 206) headers["Content-Range"] = up.headers.get("content-range");
  return new Response(buf, { status: up.status, headers });
};

export const config = { path: "/api/stream/:id" };
