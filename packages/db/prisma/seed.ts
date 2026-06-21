import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Crea usuarios de ejemplo (vos los administras desde la DB).
 * Cambia las contraseñas antes de usar en serio.
 */
async function main() {
  const password = await bcrypt.hash("changeme", 10);

  const dm = await prisma.user.upsert({
    where: { username: "dm" },
    update: {},
    create: {
      username: "dm",
      displayName: "Game Master",
      passwordHash: password,
    },
  });

  const player1 = await prisma.user.upsert({
    where: { username: "jugador1" },
    update: {},
    create: {
      username: "jugador1",
      displayName: "Jugador Uno",
      passwordHash: password,
    },
  });

  const player2 = await prisma.user.upsert({
    where: { username: "jugador2" },
    update: {},
    create: {
      username: "jugador2",
      displayName: "Jugador Dos",
      passwordHash: password,
    },
  });

  const campaign = await prisma.campaign.upsert({
    where: { id: "seed-campaign" },
    update: {},
    create: {
      id: "seed-campaign",
      name: "La Mina Perdida de Phandelver",
      description: "Campaña de ejemplo para probar la mesa.",
      dmId: dm.id,
      members: {
        create: [{ userId: player1.id }, { userId: player2.id }],
      },
      state: { create: {} },
    },
  });

  console.log("Seed completo:");
  console.log({ dm: dm.username, player1: player1.username, player2: player2.username });
  console.log("Contraseña de todos: changeme");
  console.log("Campaña:", campaign.name);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
