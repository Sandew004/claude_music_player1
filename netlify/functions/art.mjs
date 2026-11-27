// Serves album art from Drive, resized (?s=240 for lists, ?s=900 for the player). Key stays private.
const OK = { "Cache-Control": "public, max-age=31536000, immutable" };
export default async (req, context) => {
  const id = context.params.id || "";
  if (!/^[\w-]+$/.test(id)) return new Response("Bad id", { status: 400 });
  const key = process.env.DRIVE_API_KEY;
  const s = Math.min(1600, Math.max(64, parseInt(new URL(req.url).searchParams.get("s") || "900", 10) || 900));
  const api = `https://www.googleapis.com/drive/v3/files/${id}`;
  let size = 0;
  try {
    const meta = await (await fetch(`${api}?fields=thumbnailLink,size&key=${key}`)).json();
    size = Number(meta.size) || 0;
    if (meta.thumbnailLink) {
      const t = await fetch(meta.thumbnailLink.replace(/=[sw]\d+.*$/, `=s${s}`));
      if (t.ok) return new Response(await t.arrayBuffer(), { headers: { "Content-Type": t.headers.get("content-type") || "image/jpeg", ...OK } });
    }
  } catch {}
  if (size > 5.5 * 1024 * 1024) return new Response("Image too large (keep art under 5 MB)", { status: 413 });
  const o = await fetch(`${api}?alt=media&key=${key}`);
  if (!o.ok) return new Response("Not found", { status: o.status });
  return new Response(await o.arrayBuffer(), { headers: { "Content-Type": o.headers.get("content-type") || "image/jpeg", ...OK } });
};
export const config = { path: "/api/art/:id" };
