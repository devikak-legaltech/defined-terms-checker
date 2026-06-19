export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Missing API key" });

  try {
    const { messages, system } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct:free",
        messages: [
          { role: "system", content: system },
          { role: "user", content: messages[0].content }
        ]
      })
    });

    const data = await response.json();
    const text = data.choices[0].message.content;
    res.json({ content: [{ text }] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
