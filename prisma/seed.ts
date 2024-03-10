import { PrismaClient } from "@prisma/client"

const dataFile = "/data/jet_facts.csv";

const prisma = new PrismaClient()

async function main() {

    await prisma.$executeRawUnsafe(`COPY jets(name, wingspan, engines, year) FROM '${dataFile}' DELIMITER ',' CSV HEADER;`);
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
