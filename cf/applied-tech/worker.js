// Static assets ignore Range requests; iOS Safari needs 206 to play video.
// Only *.mp4 reaches this script (run_worker_first); everything else is served as plain assets.
export default {
  async fetch(req, env) {
    const res = await env.ASSETS.fetch(req.url, { method: "GET" });
    const range = req.headers.get("Range");
    const m = range && /^bytes=(\d*)-(\d*)$/.exec(range);
    const h = new Headers(res.headers);
    h.set("Accept-Ranges", "bytes");
    if (!res.ok || !m) return new Response(req.method === "HEAD" ? null : res.body, { status: res.status, headers: h });
    const buf = await res.arrayBuffer(), size = buf.byteLength;
    let start = m[1] === "" ? size - Number(m[2]) : Number(m[1]);
    let end = m[1] === "" || m[2] === "" ? size - 1 : Math.min(Number(m[2]), size - 1);
    if (start < 0) start = 0;
    if (start > end || start >= size) { h.set("Content-Range", `bytes */${size}`); return new Response(null, { status: 416, headers: h }); }
    h.set("Content-Range", `bytes ${start}-${end}/${size}`);
    h.set("Content-Length", String(end - start + 1));
    return new Response(req.method === "HEAD" ? null : buf.slice(start, end + 1), { status: 206, headers: h });
  },
};
