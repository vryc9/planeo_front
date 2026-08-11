// tools/scripts/generate-material-icons.mjs
import { writeFile } from 'node:fs/promises';

const CODEPOINTS_URL =
  'https://raw.githubusercontent.com/google/material-design-icons/master/font/MaterialIcons-Regular.codepoints';
const OUTPUT_PATH = new URL('../src/app/shared/icons/material-icons.data.ts', import.meta.url);

async function generate() {
  const response = await fetch(CODEPOINTS_URL);
  if (!response.ok) {
    throw new Error(`Échec du téléchargement des codepoints : ${response.status}`);
  }

  const raw = await response.text();
  const icons = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(' ')[0])
    .sort();

  const content = `// Fichier généré automatiquement — ne pas éditer à la main.
// Source : ${CODEPOINTS_URL}
// Régénérer avec : npm run generate:material-icons

export const MATERIAL_ICONS: readonly string[] = ${JSON.stringify(icons, null, 2)} as const;
`;

  await writeFile(OUTPUT_PATH, content, 'utf-8');
  console.log(`✅ ${icons.length} icônes générées dans ${OUTPUT_PATH.pathname}`);
}

generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
