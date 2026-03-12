// scripts/generate-photos-list.ts
import * as fs from "fs";
import * as path from "path";

const TRIBUN_DIR = path.join(process.cwd(), "public", "tribun");
const OUTPUT_FILE = path.join(process.cwd(), "scripts", "output", "photos-list.json");

const run = () => {
    const legislatures = fs.readdirSync(TRIBUN_DIR).filter((entry) => {
        return fs.statSync(path.join(TRIBUN_DIR, entry)).isDirectory() && !isNaN(Number(entry));
    });

    const result: Record<string, string[]> = {};

    for (const legislature of legislatures) {
        const photosDir = path.join(TRIBUN_DIR, legislature, "photos_deputes_nobg");

        if (!fs.existsSync(photosDir)) {
            console.warn(`Dossier manquant : ${photosDir}`);
            result[legislature] = [];
            continue;
        }

        const files = fs.readdirSync(photosDir)
            .filter((f) => f.endsWith(".png") || f.endsWith(".jpg"))
            .sort();
        result[legislature] = files;
        console.log(`Législature ${legislature} : ${files.length} photos`);
    }

    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), "utf-8");
    console.log(`✅ Généré : ${OUTPUT_FILE}`);
};

run();