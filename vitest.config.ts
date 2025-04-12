import tsconfigPaths from 'vite-tsconfig-paths';

export default {
    plugins: [ tsconfigPaths() ],
    test: {
        globals: true,
        environment: 'node',
        env: {
            DB_SEED_PATH: "src/test/config/jsonseed",
            JWT_SECRET_ACCESS: "e76352c2968412a03102dfc1bd067261",
            JWT_SECRET_REFRESH: "fae59e528d30fd9adb150e1eb7a79a35"
        }
    },
};
