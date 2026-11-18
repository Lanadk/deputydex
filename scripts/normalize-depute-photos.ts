/**
 * Normalise les photos des députés au format portrait 150×192 (issue #62).
 *
 * Les photos de la 16e législature mélangent du 150×192 (format AN actuel)
 * et du 240×240. Étirer un carré vers un rectangle déforme le visage : on
 * recadre donc d'abord (on rogne les côtés et un peu le haut/bas) pour
 * retomber sur la proportion 150/192, puis on redimensionne si besoin.
 *
 * Dans les 240×240, le visage est déjà à la même échelle que dans les
 * 150×192 : une fenêtre 150×192 centrée horizontalement et légèrement
 * descendue (pour garder un peu d'air au-dessus des cheveux) suffit, sans
 * resize. Les écarts d'un pixel (149×192, 150×193) passent par un
 * `cover` ancré en haut.
 *
 * Idempotent : les photos déjà en 150×192 ne sont pas touchées.
 *
 *   npx tsx scripts/normalize-depute-photos.ts
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const TARGET_WIDTH = 150;
const TARGET_HEIGHT = 192;
/** Décalage vertical de la fenêtre de crop dans les photos carrées 240×240. */
const SQUARE_TOP_OFFSET = 16;

const ROOT = path.join(process.cwd(), "public", "tribun");

async function normalize(file: string): Promise<boolean> {
    const input = await fs.readFile(file);
    const { width = 0, height = 0, format } = await sharp(input).metadata();
    if (width === TARGET_WIDTH && height === TARGET_HEIGHT) return false;

    let pipeline = sharp(input);
    if (width === 240 && height === 240) {
        pipeline = pipeline.extract({
            left: Math.round((width - TARGET_WIDTH) / 2),
            top: SQUARE_TOP_OFFSET,
            width: TARGET_WIDTH,
            height: TARGET_HEIGHT,
        });
    } else {
        pipeline = pipeline.resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: "cover", position: "top" });
    }

    // On garde le format d'origine (PNG détouré en 16e, JPEG en 17e).
    pipeline = format === "jpeg" ? pipeline.jpeg({ quality: 92 }) : pipeline.png();
    await fs.writeFile(file, await pipeline.toBuffer());
    return true;
}

async function main() {
    const legislatures = await fs.readdir(ROOT);
    for (const leg of legislatures) {
        const dir = path.join(ROOT, leg, "photos_deputes_nobg");
        const files = await fs.readdir(dir).catch(() => []);
        let changed = 0;
        for (const name of files) {
            if (!/\.(png|jpe?g)$/i.test(name)) continue;
            if (await normalize(path.join(dir, name))) changed++;
        }
        console.log(`législature ${leg} : ${changed}/${files.length} photo(s) normalisée(s)`);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
