import tsconfigPaths from 'vite-tsconfig-paths';

export default {
    plugins: [tsconfigPaths()],
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['src/test/setup.ts'],
    },
};
