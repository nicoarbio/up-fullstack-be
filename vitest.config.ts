import tsconfigPaths from 'vite-tsconfig-paths';

export default {
    plugins: [ tsconfigPaths() ],
    test: {
        globals: true,
        environment: 'node',
        env: {
            DB_SEED_PATH: "src/test/config/jsonseed"
        }
    },
};
