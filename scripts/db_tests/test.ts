import {prisma} from "@/lib/prisma";


async function main() {
    const deputes = await prisma.depute.findMany()
    console.log("Tous les députés :", deputes)

    const jeandupont = await prisma.depute.findUnique({
        where: { id: 1 },
        include: { mandats: true },
    })
    console.log("Jean Dupont :", jeandupont)
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect())
