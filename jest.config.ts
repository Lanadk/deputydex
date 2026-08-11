import type { Config } from 'jest'

const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    preset: 'ts-jest',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: {
                jsx: 'react',
            },
        }],
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^server-only$': '<rootDir>/__mocks__/server-only.ts',
        '^next/cache$': '<rootDir>/__mocks__/next-cache.ts',
    },
    // scripts/db_tests et scripts/github_actions_tests sont des scaffolds legacy
    // (code mort/commenté, cf. CLAUDE.md) — pas de vrais tests, on les exclut de
    // la collecte pour ne pas faire échouer `npm test` sur du code hors-sujet.
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/scripts/'],
    // Rapport de couverture pour consultation locale : un résumé dans le
    // terminal + une page HTML navigable (coverage/index.html). Pas de format
    // jacoco — c'est un format Java (outil JaCoCo) que Jest/Istanbul ne
    // produit pas ; l'équivalent XML cross-langage serait 'cobertura', à
    // activer plutôt si un outil CI (SonarQube, GitLab...) doit le consommer.
    coverageReporters: ['text-summary', 'html', 'json-summary'],
    collectCoverageFrom: [
        'app/**/*.{ts,tsx}',
        '!app/**/*.d.ts',
        '!app/**/*.test.{ts,tsx}',
        '!app/infrastructure/db/generated/**',
    ],
}

export default config