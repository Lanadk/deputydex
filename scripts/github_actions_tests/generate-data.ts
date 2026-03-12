import fs from 'fs/promises';
import path from 'path';

interface Deputy {
    id: number;
    name: string;
    party: string;
    votes: number;
}

async function generateData() {
    console.log('Génération des données...\n');

    const deputies: Deputy[] = [
        { id: 1, name: 'Jean Dupont', party: 'LREM', votes: 245 },
        { id: 2, name: 'Marie Martin', party: 'LR', votes: 189 },
        { id: 3, name: 'Pierre Durant', party: 'PS', votes: 312 },
        { id: 4, name: 'Sophie Leroy', party: 'RN', votes: 156 },
        { id: 5, name: 'Luc Bernard', party: 'LFI', votes: 278 },
    ];

    console.log(`${deputies.length} députés générés`);

    const totalVotes = deputies.reduce((sum, d) => sum + d.votes, 0);
    const avgVotes = (totalVotes / deputies.length).toFixed(2);

    console.log(`Total votes: ${totalVotes}`);
    console.log(`Moyenne votes: ${avgVotes}\n`);

    const outputDir = path.join(process.cwd(), 'public/data');
    await fs.mkdir(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, 'deputy.json');
    await fs.writeFile(outputPath, JSON.stringify(deputies, null, 2));

    console.log(`Fichier créé: ${outputPath}`);
    console.log(`Taille: ${(JSON.stringify(deputies).length / 1024).toFixed(2)} KB\n`);

    return deputies;
}

async function main() {
    try {
        console.log('━'.repeat(50));
        const data = await generateData();
        console.log('━'.repeat(50));
        console.log(`Succès! ${data.length} entrées générées`);
    } catch (error) {
        console.error('Erreur:', error);
        process.exit(1);
    }
}

main();