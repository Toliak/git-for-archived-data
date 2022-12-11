/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',

    // Without this option,
    // error `The 'import.meta' meta-property is only allowed when ...` reveals
    extensionsToTreatAsEsm: ['.ts'],

    // No import resolution, otherwise
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },

    // Process infinitely run, if the option is not set
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
};
