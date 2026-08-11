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
    },
    // scripts/db_tests et scripts/github_actions_tests sont des scaffolds legacy
    // (code mort/commenté, cf. CLAUDE.md) — pas de vrais tests, on les exclut de
    // la collecte pour ne pas faire échouer `npm test` sur du code hors-sujet.
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/scripts/'],
}

export default config