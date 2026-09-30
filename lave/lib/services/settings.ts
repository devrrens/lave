import { db } from "@/lib/db";
import type { SettingsInput } from "@/lib/validations/settings";

export async function getAllSettings(): Promise<Record<string, string>> {
  const rows = await db.storeSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function updateSettings(input: SettingsInput) {
  const entries = Object.entries(input) as Array<[string, string]>;
  await db.$transaction(
    entries.map(([key, value]) =>
      db.storeSetting.upsert({ where: { key }, update: { value }, create: { key, value } })
    )
  );
}
