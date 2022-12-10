/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testEnvironmentOptions: {
        NODE_OPTIONS: '--experimental-vm-modules',
    },
};

/**
 * Replace `* as doc` by `doc`, thanks JS for completely broken ecosystem
 */
