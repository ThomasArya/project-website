import { getCatalog } from "./_lib/tmdb.mjs";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
  try {
    const catalog = await getCatalog();
    res.status(200).json(catalog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}