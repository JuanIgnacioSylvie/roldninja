import { r } from "./helpers";

export const MOUNTS_VEHICLES_RULES = [
  r({
    id: "mounts-overview",
    kind: "rule",
    category: "equipment",
    titleEn: "Mounts & Animals",
    titleEs: "Monturas y animales",
    summaryEn: "Carrying capacity, saddles, and barding for mounts.",
    summaryEs: "Capacidad de carga, sillas de montar y bardas.",
    bodyEn:
      "Mounts help carry gear and speed travel. Carrying capacity (lb):\n\n• Camel — 450 lb. (50 gp)\n• Elephant — 1,320 lb. (200 gp)\n• Draft Horse — 540 lb. (50 gp)\n• Riding Horse — 480 lb. (75 gp)\n• Mastiff — 195 lb. (25 gp)\n• Mule — 420 lb. (8 gp)\n• Pony — 225 lb. (30 gp)\n• Warhorse — 540 lb. (400 gp)\n\nAn animal pulling a cart, wagon, or similar can move up to five times its carrying capacity (including vehicle weight). Multiple animals add capacities together.",
    bodyEs:
      "Las monturas transportan equipo y aceleran viajes. Capacidad de carga (kg aprox.):\n\n• Camello — 200 kg (50 po)\n• Elefante — 600 kg (200 po)\n• Caballo de tiro — 245 kg (50 po)\n• Caballo de monta — 220 kg (75 po)\n• Mastín — 90 kg (25 po)\n• Mula — 190 kg (8 po)\n• Poni — 100 kg (30 po)\n• Corcel de guerra — 245 kg (400 po)\n\nUn animal que tira de carro o carreta puede mover hasta cinco veces su capacidad (incluido el vehículo). Varios animales suman capacidades.",
    tags: ["mounts", "horse", "carrying capacity"],
    related: ["mounted-combat", "vehicles-overview"],
    manual: "phb",
  }),
  r({
    id: "saddles-barding",
    kind: "rule",
    category: "equipment",
    titleEn: "Saddles & Barding",
    titleEs: "Sillas de montar y bardas",
    summaryEn: "Military saddle grants Advantage to stay mounted; barding costs 4× armor.",
    summaryEs: "Silla militar da ventaja para no caer; barda cuesta 4× la armadura.",
    bodyEn:
      "Saddles include bit, bridle, and reins.\n\n• Pack Saddle — carries gear (varies).\n• Riding Saddle — standard riding (10 gp).\n• Military Saddle — Advantage on checks to remain mounted (20 gp).\n• Exotic Saddle — required for aquatic or flying mounts (60 gp).\n\nBarding is armor for a mount. Any armor from the armor table can be bought as barding at 4× cost and 2× weight.",
    bodyEs:
      "Las sillas incluyen freno, brida y riendas.\n\n• Silla de carga — transporta equipo.\n• Silla de montar — monta estándar (10 po).\n• Silla militar — ventaja en tiradas para no caer (20 po).\n• Silla exótica — monturas acuáticas o voladoras (60 po).\n\nLa barda es armadura para montura. Cualquier armadura del capítulo cuesta 4× y pesa el doble como barda.",
    tags: ["saddle", "barding", "mount"],
    related: ["mounts-overview", "mounted-combat"],
    manual: "phb",
  }),
  r({
    id: "vehicles-overview",
    kind: "rule",
    category: "equipment",
    titleEn: "Vehicles",
    titleEs: "Vehículos",
    summaryEn: "Land and water vehicles with speed, crew, cargo, and cost.",
    summaryEs: "Vehículos terrestres y acuáticos con velocidad, tripulación, carga y coste.",
    bodyEn:
      "Drawn vehicles (land):\n• Cart — 200 lb., 15 gp\n• Chariot — 100 lb., 250 gp\n• Carriage — 600 lb., 100 gp\n• Wagon — 400 lb., 35 gp\n• Sled — 300 lb., 20 gp\n\nWaterborne (examples):\n• Rowboat — 4 mph, 100 lb. cargo, 50 gp\n• Keelboat — 1 mph, ½ ton, 3,000 gp\n• Sailing Ship — 2 mph, 100 tons, 10,000 gp\n• Galley — 4 mph, 15 tons, 30,000 gp\n• Warship — 2½ mph, 25 tons, 25,000 gp\n\nFeed per mount per day: 5 cp (10 lb.).",
    bodyEs:
      "Vehículos tirados (tierra):\n• Carreta — 90 kg, 15 po\n• Carro — 45 kg, 250 po\n• Coche — 270 kg, 100 po\n• Carromato — 180 kg, 35 po\n• Trineo — 135 kg, 20 po\n\nAcuáticos (ejemplos):\n• Bote de remos — 6,4 km/h, 45 kg, 50 po\n• Gabarra — 1,6 km/h, 3.000 po\n• Velero — 3,2 km/h, 10.000 po\n• Galera — 6,4 km/h, 30.000 po\n• Navío de guerra — 4 km/h, 25.000 po\n\nForraje por montura y día: 5 pc (4,5 kg).",
    tags: ["vehicles", "cart", "ship", "wagon"],
    related: ["mounts-overview", "services-lifestyle"],
    manual: "phb",
  }),
  r({
    id: "services-lifestyle",
    kind: "rule",
    category: "equipment",
    titleEn: "Services & Lifestyle",
    titleEs: "Servicios y estilo de vida",
    summaryEn: "Weekly or monthly living costs from Wretched (free) to Aristocratic (10 gp/day).",
    summaryEs: "Coste de vida semanal o mensual de Miserable (gratis) a Aristocrático (10 po/día).",
    bodyEn:
      "At the start of each week or month, choose a lifestyle and pay its cost:\n\n• Wretched — free (charity, exposed to danger)\n• Squalid — 1 cp/day\n• Poor — 2 sp/day\n• Modest — 1 gp/day\n• Comfortable — 2 gp/day\n• Wealthy — 4 gp/day\n• Aristocratic — 10 gp/day\n\nCommon services: meal 3 cp–5 sp, ale 4 cp, inn stay 5 sp–2 gp/night, hireling (skilled) 2 gp/day, (unskilled) 2 sp/day, messenger 2 cp/mile, road toll varies.",
    bodyEs:
      "Al inicio de cada semana o mes, elige estilo de vida y paga:\n\n• Miserable — gratis\n• Indigente — 1 pc/día\n• Pobre — 2 pp/día\n• Modesto — 1 po/día\n• Cómodo — 2 po/día\n• Adinerado — 4 po/día\n• Aristocrático — 10 po/día\n\nServicios comunes: comida 3 pc–5 pp, cerveza 4 pc, posada 5 pp–2 po/noche, sirviente experto 2 po/día, mensajero 2 pc/milla.",
    tags: ["lifestyle", "services", "inn", "hireling"],
    related: ["dmg-downtime"],
    manual: "phb",
  }),
];
