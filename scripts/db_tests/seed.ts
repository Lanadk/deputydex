import {prisma} from "@/lib/prisma";

async function main() {
    await prisma.depute.createMany({
        data: [
            { nom: "Jean Dupont", groupe: "LREM", departement: "75" },
            { nom: "Marie Durand", groupe: "LR", departement: "13" },
            { nom: "Paul Martin", groupe: "PS", departement: "69" }
        ],
        skipDuplicates: true,
    })

    await prisma.mandat.createMany({
        data: [
            { deputeId: 1, anneeDebut: 2022, anneeFin: 2027 },
            { deputeId: 2, anneeDebut: 2017, anneeFin: 2022 }
        ],
        skipDuplicates: true,
    })

    const deputes = await prisma.depute.findMany({
        include: { mandats: true }
    })

    console.log("Seed terminé :", JSON.stringify(deputes, null, 2))
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
