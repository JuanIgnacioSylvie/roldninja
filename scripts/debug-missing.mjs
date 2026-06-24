import { readFileSync } from "node:fs";

const raw = readFileSync("scripts/.cache-phb.txt", "utf8");
const norm = raw
  .replace(/\r/g, "")
  .replace(/([a-z])-\s*\n\s*([a-z])/gi, "$1$2")
  .replace(/\n+/g, " ")
  .replace(/\s+/g, " ")
  .trim();
const start = norm.search(/ORIGIN FEATS/i);
const relEnd = norm.slice(start).search(/CHAPTER 6 I EQUIPMENT/i);
const section = norm.slice(start, start + relEnd);

const re = /G\s*r\s*e\s*a\s*t\s+W\s*e\s*a\s*p\s*o\s*n\s+M\s*a\s*s\s*t\s*e\s*r\s+(?:G\s*e\s*n\s*e\s*r\s*a\s*l|General)\s+Feat/gi;
const matches = [...section.matchAll(re)];
for (const m of matches) {
  console.log(m.index, section.slice(m.index, m.index + 120));
  console.log("rich", /You gain|Increase one ability/i.test(section.slice(m.index, m.index + 400)));
}
