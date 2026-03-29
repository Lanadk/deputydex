// scripts/generate-photos-sql.ts
import * as fs from "fs";

const normalize = (str: string) =>
    str.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")  // retire accents
        .replace(/[-_]/g, " ")             // tirets et underscores → espace
        .replace(/'/g, " ")                // apostrophes → espace
        .replace(/\s+/g, " ")             // espaces multiples → un seul
        .trim()
        .toLowerCase();

const parseFilename = (filename: string): { prenom: string | null; nom: string } | null => {
    const withoutExt = filename.replace(/\.(png|jpg)$/i, "");
    const parts = withoutExt.split("_");

    if (parts.length < 2) return null;

    const [, ...rest] = parts;

    if (rest.length === 1) {
        // Pattern court : {num}_{Nom}
        return { prenom: null, nom: normalize(rest[0]) };
    }

    // Pattern long : {num}_{Prenom}_{Nom}
    return {
        prenom: normalize(rest.slice(0, -1).join("_")),
        nom: normalize(rest[rest.length - 1]),
    };
};

// Normalise côté SQL : retire accents, tirets, apostrophes, lowercase
const sqlNormalize = (col: string) =>
    `LOWER(UNACCENT(REPLACE(REPLACE(REPLACE(${col}, '-', ' '), '''', ' '), '_', ' ')))`;

const run = async () => {
    const photosJson = JSON.parse(fs.readFileSync("./scripts/output/photos-list.json", "utf-8"));
    const lines: string[] = [];

    for (const [legislature, files] of Object.entries(photosJson) as [string, string[]][]) {
        lines.push(`-- Législature ${legislature}`);

        for (const file of files) {
            const parsed = parseFilename(file);
            if (!parsed) continue;

            const photoPath = `/tribun/${legislature}/photos_deputes_nobg/${file}`;
            const wherePrenom = parsed.prenom
                ? `AND ${sqlNormalize("prenom")} = $$${parsed.prenom}$$ `
                : "";

            lines.push(
                `INSERT INTO acteurs_photos (acteur_uid, legislature, photo_path) ` +
                `SELECT uid, ${legislature}, $$${photoPath}$$ ` +
                `FROM acteurs ` +
                `WHERE legislature_snapshot = ${legislature} ` +
                `AND ${sqlNormalize("nom")} = $$${parsed.nom}$$ ` +
                `${wherePrenom}` +
                `ON CONFLICT (acteur_uid, legislature) DO UPDATE SET photo_path = EXCLUDED.photo_path;`
            );
        }

        lines.push("");
    }

    fs.writeFileSync("./scripts/output/map-photos.sql", lines.join("\n"), "utf-8");
    console.log("✅ map-photos.sql généré");
};

run();