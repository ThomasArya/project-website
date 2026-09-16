export default function handler(_req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({ ok: true, at: new Date().toISOString() });
}