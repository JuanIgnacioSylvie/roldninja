// Clona, compila y despliega Azgaar's Fantasy Map Generator en apps/web/public/azgaar
// para servirlo localmente y embeberlo via iframe (generar/cargar mapas).
//
// Azgaar migró a Vite: el index.html ya no está en la raíz del repo; hay que
// compilar con base /azgaar/ y copiar dist/ a public/azgaar/.
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const srcDir = join(root, ".azgaar-src");
const dest = join(root, "apps", "web", "public", "azgaar");
const repo = "https://github.com/Azgaar/Fantasy-Map-Generator.git";
const force = process.argv.includes("--force");

function hasBuiltAssets(dir) {
  return existsSync(join(dir, "index.html")) && existsSync(join(dir, "main.js"));
}

function ensureSource() {
  if (existsSync(join(srcDir, "package.json"))) return;

  // Layout antiguo: el clone vivía directamente en public/azgaar (sin build).
  if (existsSync(join(dest, "package.json")) && !hasBuiltAssets(dest)) {
    console.log("[azgaar] Migrando fuente desde public/azgaar a .azgaar-src...");
    if (existsSync(srcDir)) rmSync(srcDir, { recursive: true, force: true });
    cpSync(dest, srcDir, { recursive: true });
    return;
  }

  if (existsSync(srcDir)) rmSync(srcDir, { recursive: true, force: true });
  console.log("[azgaar] Clonando (shallow) Azgaar's Fantasy Map Generator...");
  execSync(`git clone --depth 1 ${repo} "${srcDir}"`, { stdio: "inherit", cwd: root });
  rmSync(join(srcDir, ".git"), { recursive: true, force: true });
}

function buildAndDeploy() {
  console.log("[azgaar] Instalando dependencias...");
  execSync("npm install", { stdio: "inherit", cwd: srcDir });

  console.log("[azgaar] Compilando con base /azgaar/...");
  execSync("npx vite build --base /azgaar/ --emptyOutDir", { stdio: "inherit", cwd: srcDir });

  const dist = join(srcDir, "dist");
  if (!existsSync(join(dist, "index.html"))) {
    throw new Error("Build falló: no se generó dist/index.html");
  }

  console.log("[azgaar] Desplegando assets estáticos en public/azgaar...");
  mkdirSync(dest, { recursive: true });
  // Copiamos encima del destino existente (evita EPERM al borrar carpetas bloqueadas por el dev server).
  cpSync(dist, dest, { recursive: true, force: true });
}

if (!force && hasBuiltAssets(dest)) {
  console.log(`[azgaar] Ya desplegado en ${dest}. Usa --force para reconstruir.`);
  process.exit(0);
}

try {
  ensureSource();
  buildAndDeploy();
  console.log("[azgaar] Listo. Se sirve en /azgaar/index.html");
} catch (err) {
  console.error("[azgaar] Fallo:", err instanceof Error ? err.message : err);
  process.exit(1);
}
