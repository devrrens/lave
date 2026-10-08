# Taste

- Writes requests in casual Indonesian (informal "lu"/"gue" register), mixed with English technical terms (e.g. "upload", "base64", "check"); expects responses in Indonesian. Confidence: 0.8
- Uses a Next.js + Prisma stack deployed serverlessly (hosting on Vercel, database expected on Cloudflare D1); prefers storage that avoids filesystem writes — e.g. base64 data URLs in the DB. Confidence: 0.6
- Expects the agent to verify the actual state of the project/config (deployment target, DB bindings) by inspecting files rather than assuming — e.g. explicitly asks "coba lu cek". Confidence: 0.5
