// Minimal Gemini REST client with retry and model fallback. The API key stays on the server.

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function geminiJson(prompt: string): Promise<{ data: unknown; model: string }> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('Server is missing GEMINI_API_KEY.');
  const models = [process.env.GEMINI_MODEL, 'gemini-3.8-flash', 'gemini-flash-latest'].filter(
    (m, i, a): m is string => !!m && a.indexOf(m) === i,
  );
  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json', temperature: 0.3 },
  });
  let lastStatus = 502;
  for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      let res: Response;
      try {
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
          body,
          signal: AbortSignal.timeout(40_000),
        });
      } catch {
        lastStatus = 502;
        await sleep(600 * (attempt + 1));
        continue;
      }
      lastStatus = res.status;
      if (res.ok) {
        const j = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
        const text = j.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
        try {
          return { data: JSON.parse(text.replace(/^```json\s*|```$/g, '').trim()), model };
        } catch {
          await sleep(400);
          continue;
        }
      }
      if (res.status === 404) break; // model retired: try the next one
      if (res.status === 400 || res.status === 401 || res.status === 403) throw new Error('The AI provider rejected the request. Check GEMINI_API_KEY.');
      await sleep(800 * (attempt + 1));
    }
  }
  throw new Error(lastStatus === 429 ? 'The AI service is busy (rate limit). Try again in a minute.' : 'The AI service is unavailable right now. Try again.');
}
