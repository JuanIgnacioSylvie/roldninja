# Roldninja — Mesa virtual para D&D 2024 (5.5)

Aplicación web (responsive) para jugar rol de mesa online con las reglas de D&D 2024:
autenticación simple, partidas, creación de personajes paso a paso, mapa del mundo
(integración con Azgaar's Fantasy Map Generator), chat en tiempo real y un dashboard
de sesión con widgets reacomodables y modos **libre** / **combate**.

## Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **Arquitectura:** Clean Architecture (capas dominio → aplicación → infraestructura → adaptadores)
- **Frontend (`apps/web`):** Next.js 14 (App Router) · TypeScript · Tailwind · react-grid-layout · react-konva
- **Backend (`apps/server`):** Fastify · Socket.IO · JWT · Zod
- **DB (`packages/db`):** PostgreSQL + Prisma

### Capas (Clean Architecture)

El código sigue la **regla de dependencia**: las capas internas no conocen a las externas.

```
roldninja/
├─ packages/
│  ├─ domain/          # Núcleo puro: entidades, value objects, reglas, dados,
│  │                   #   datos SRD, políticas y PORTS de repositorio. Sin frameworks.
│  ├─ application/     # Casos de uso + ports de gateways (hasher, token, storage). Depende solo de domain/contracts.
│  ├─ contracts/       # DTOs de transporte + contratos Socket.IO (compartidos web/server).
│  ├─ infrastructure/  # Implementaciones: repos Prisma, bcrypt, JWT, storage local, RNG.
│  └─ db/              # Cliente Prisma (schema + seed).
└─ apps/
   ├─ server/          # Adaptadores de entrada (HTTP/Socket) + composition root (DI manual).
   │   ├─ composition/ #   Cablea implementaciones concretas con casos de uso.
   │   ├─ http/        #   Controllers Fastify + middleware + mapeo de errores.
   │   └─ realtime/    #   Adaptador Socket.IO → casos de uso.
   └─ web/             # Frontend en capas:
       ├─ application/ports/   # ApiGateway, RealtimeGateway (interfaces).
       ├─ infrastructure/      # HttpApiClient, SocketClient, authStore, composition (contexto React).
       ├─ components / hooks / app   # Presentación (consume los ports vía contexto).
       └─ (reusa @roldninja/domain para reglas del cliente: wizard, dados).
```

**Flujo de dependencias:** `domain ← application ← infrastructure ← (composition root)`.
Los adaptadores (HTTP, Socket, Prisma, React) dependen de abstracciones; nunca al revés.

## Puesta en marcha

Requisitos: Node 20+, pnpm, Docker.

```bash
# 1. Dependencias
pnpm install

# 2. Variables de entorno (ya hay .env de ejemplo creados; revisalos)
#    raíz/.env, packages/db/.env, apps/web/.env.local

# 3. Base de datos
pnpm db:up            # levanta PostgreSQL en Docker
pnpm db:generate      # genera el cliente Prisma
pnpm --filter @roldninja/db push   # crea las tablas (o: pnpm db:migrate)
pnpm db:seed          # usuarios y partida de ejemplo

# 4. Self-host del generador de mapas Azgaar (una sola vez)
pnpm azgaar:setup     # clona, compila y despliega Azgaar en /azgaar/index.html

# 5. Bestiario SRD para el banco de monstruos (una sola vez, opcional)
pnpm monsters:fetch   # baja ~322 monstruos del SRD 5.1 a apps/web/public/srd-monsters.json

# 6. Levantar todo (web + server)
pnpm dev
```

- Web: http://localhost:3000
- API/Socket: http://localhost:4000

### Usuarios de ejemplo (seed)

| Usuario     | Rol    | Contraseña |
|-------------|--------|------------|
| `dm`        | DM     | `changeme` |
| `jugador1`  | PLAYER | `changeme` |
| `jugador2`  | PLAYER | `changeme` |

Los usuarios se administran directamente en la base de datos (no hay registro público).
Para crear más, agregalos en `packages/db/prisma/seed.ts` o con `prisma studio`.

## Flujo de uso

1. **Login** (un solo formulario).
2. **Elegir partida.** El DM puede crear partidas.
3. **Elegir/crear personaje** (los jugadores). El alta es un **wizard paso a paso**:
   especie → clase → trasfondo → puntuaciones (point buy / array) → detalles.
4. **Mapa del mundo:** generar con Azgaar embebido o cargar una imagen/export.
5. **Sesión:** dashboard con widgets (chat, hoja, tablero) que se **mueven y
   redimensionan** y se guardan por usuario.
   - El **DM** cambia entre **modo libre** y **modo combate**.
   - Al iniciar combate, a los jugadores les salta el **popup de iniciativa**
     (se puede cancelar). El DM puede **reordenar** la iniciativa y avanzar turnos.
   - En tu turno, la **hoja** habilita acciones (ataques, salvaciones, habilidades)
     que el servidor resuelve y publica en el chat.

## Estado y roadmap

Ya implementado: auth, partidas, wizard de PJ, chat + dados en tiempo real, modos
libre/combate con iniciativa, tablero NxM con fondo y tokens arrastrables, mapa del mundo.

Tablero (VTT): grilla NxM con fondo, tokens arrastrables, **tokens ligados a
personajes con barra de vida**, **NPCs**, **regla de medición** (5 pies/casilla),
**tokens ocultos** (solo DM) e **inspector** para editar color/tamaño/PG/visibilidad/borrar.

Banco de monstruos (DM): buscador con el **bestiario SRD 5.1** (~322 monstruos,
contenido abierto CC-BY de [Open5e](https://open5e.com)), stat block desplegable y
botones para **agregar al tablero** (token con PG) y **al combate** (tira iniciativa).
Si el JSON del bestiario no está descargado, usa un set curado en español de respaldo.
Datos del SRD bajo licencia CC-BY-4.0 / OGL de Wizards of the Coast.

Próximos pasos sugeridos:

- [ ] Niebla de guerra (el DM revela zonas; los jugadores no ven lo oculto).
- [ ] Filtrar tokens ocultos del lado del servidor (hoy se filtran en el cliente).
- [ ] Persistir el layout del dashboard en el servidor (hoy es por navegador).
- [ ] Hoja de personaje editable (equipo, hechizos, daño/curación) y subida de nivel.
- [ ] Hooks de exportación de Azgaar (postMessage) para guardar el `.map` desde la app.
- [ ] Más datos SRD 2024 (subclases, hechizos completos, dotes).
- [ ] Roles por partida y panel de administración de usuarios.

## Referencias de reglas

`D&D 2024 Player's Handbook` y `Dungeon Master's Guide` se usan como fuente de reglas
para ir implementando mecánicas. El subconjunto de datos vive en `packages/shared/src/srd.ts`.
