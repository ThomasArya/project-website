import { getCatalog } from "./_lib/tmdb.mjs";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }
  try {
    const catalog = await getCatalog({ force: true });
    res.status(200).json({ ok: true, catalog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}