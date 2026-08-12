import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Artefacts locaux gitignored mais pas ignorés par défaut par
    // eslint-config-next : sans ça, lint après un `test:coverage` ou un
    // `prisma:generate` local fait exploser eslint sur du code généré/vendor.
    "coverage/**",
    "app/infrastructure/db/generated/**",
  ]),
]);

export default eslintConfig;
