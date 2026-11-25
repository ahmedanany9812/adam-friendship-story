// Vercel Serverless TTS fallback for browsers without an installed Arabic voice (e.g. Windows Chrome)
export default async function handler(req, res) {
  try {
    const text = String(req.query.text || "").trim().slice(0, 200);
    const lang = req.query.lang === "en" ? "en" : "ar";
    if (!text) return res.status(400).send("Missing text");

    const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=${lang}&q=${encodeURIComponent(text)}`;
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Referer": "https://translate.google.com/"
      }
    });
    if (!r.ok) return res.status(502).send("TTS upstream error");
    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
    return res.status(200).send(buf);
  } catch (err) {
    return res.status(500).send("TTS failed");
  }
}
