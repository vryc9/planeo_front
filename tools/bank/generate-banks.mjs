import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const SOURCES_PATH = new URL('./banks-sources.json', import.meta.url);
const OUTPUT_PATH = new URL('../../src/app/shared/banks/banks.data.ts', import.meta.url);
const LOGO_SIZE = 128;

const USER_AGENT = 'PlaneoBankLogos/1.0 (https://vryc9.github.io; enzo47volpato@gmail.com)';
const MAX_RETRIES = 4;
const DELAY_BETWEEN_BANKS_MS = 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchSvg(url) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });

    if (response.ok) {
      return response.text();
    }
    if (response.status === 429 && attempt < MAX_RETRIES) {
      const retryAfter = Number(response.headers.get('retry-after')) || 2 ** attempt * 2;
      await sleep(retryAfter * 1000);
      continue;
    }
    throw new Error(`Échec du téléchargement (${response.status})`);
  }
}

async function readLocalSvg(path) {
  return readFile(new URL(path, SOURCES_PATH), 'utf-8');
}

async function svgToPngBase64(svgText) {
  const buffer = await sharp(Buffer.from(svgText))
    .resize(LOGO_SIZE, LOGO_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  return buffer.toString('base64');
}

async function generate() {
  const sources = JSON.parse(await readFile(SOURCES_PATH, 'utf-8'));
  const banks = [];

  for (const { name, svgUrl, svgPath } of sources) {
    try {
      const svg = svgPath ? await readLocalSvg(svgPath) : await fetchSvg(svgUrl);
      const logo = await svgToPngBase64(svg);
      banks.push({ name, logo });
      console.log(`  ✓ ${name}`);
    } catch (error) {
      console.error(`  ✗ ${name} : ${error.message}`);
    }
  }

  banks.sort((a, b) => a.name.localeCompare(b.name));

  const content = `// Fichier généré automatiquement — ne pas éditer à la main.
// Source : tools/scripts/banks-sources.json
// Régénérer avec : npm run generate:banks

export interface Bank {
  readonly name: string;
  readonly logo: string; // base64 PNG, sans préfixe data:
}

export const BANKS: readonly Bank[] = ${JSON.stringify(banks, null, 2)} as const;
`;

  await writeFile(OUTPUT_PATH, content, 'utf-8');
  console.log(`\n✅ ${banks.length}/${sources.length} banques générées dans ${OUTPUT_PATH.pathname}`);
}

generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
