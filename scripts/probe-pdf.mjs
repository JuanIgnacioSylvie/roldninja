import { readFileSync, writeFileSync } from "node:fs";
import pdf from "pdf-parse/lib/pdf-parse.js";

const path = process.argv[2];
const out = process.argv[3];
const buf = readFileSync(path);
const data = await pdf(buf);
const text = data.text;

if (out) {
  writeFileSync(out, text, "utf8");
  console.log("Wrote", out, "chars:", text.length);
} else {
  const needles = ["Feat List", "FEAT DESCRIPTIONS", "Origin Feats", "CHAPTER 5", "DM's Toolbox"];
  for (const n of needles) {
    const i = text.indexOf(n);
    console.log(n, i >= 0 ? `found at ${i}` : "not found");
  }
  const idx = text.indexOf("Feat List");
  if (idx >= 0) console.log(text.slice(idx, idx + 3000));
}
