import fs from 'fs';
import path from 'path';

//npm run create-component c  app/component-library/atoms/c

// Récupération des arguments
const args = process.argv.slice(2);

if (args.length < 2) {
    console.error('❌ Usage: npm run create-component <nom-du-composant> <chemin-du-dossier>');
    console.error('Exemple: npm run create-component mon-bouton src/components/mon-bouton');
    process.exit(1);
}

const componentName = args[0];
const targetDir = args[1];

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`✅ Dossier créé: ${targetDir}`);
}

// Fonction pour convertir kebab-case en PascalCase
function toCamelCase(str) {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

// Templates des fichiers
const templates = {
    'page.tsx': `export default function Page() {
  return (
    <div>
      <h1>Page ${componentName}</h1>
    </div>
  );
}
`,

    [`${componentName}-lib.constants.ts`]: `export const CONSTANTS = {
  // Ajoutez vos constantes ici
};
`,

    [`${componentName}-lib.css`]: `.${componentName} {
  /* Ajoutez vos styles ici */
}
`,

    [`${componentName}-lib.test.tsx`]: `import { render, screen } from '@testing-library/react';
import { ${toCamelCase(componentName)} } from './${componentName}-lib';

describe('${componentName}', () => {
  it('should render', () => {
    render(<${toCamelCase(componentName)} />);
    // Ajoutez vos tests ici
  });
});
`,

    [`${componentName}-lib.tsx`]: `import './${componentName}-lib.css';

export interface ${toCamelCase(componentName)}Props {
  // Définissez vos props ici
}

export function ${toCamelCase(componentName)}(props: ${toCamelCase(componentName)}Props) {
  return (
    <div className="${componentName}">
      {/* Votre composant ici */}
    </div>
  );
}
`
};

// Créer les fichiers
Object.entries(templates).forEach(([filename, content]) => {
    const filePath = path.join(targetDir, filename);

    if (fs.existsSync(filePath)) {
        console.warn(`⚠️  Le fichier existe déjà: ${filename}`);
    } else {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fichier créé: ${filename}`);
    }
});

console.log('\n🎉 Tous les fichiers ont été créés avec succès!');