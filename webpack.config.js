const path = require('path');

module.exports = (env) => {
    const devMode = env.development ? true : false;
    return {
        entry: './src/main.js',
        output: {
            filename: 'app.js',
            path: path.resolve(__dirname, 'build')
        },
        mode: devMode ? 'development' : 'production',
        devtool: devMode ? 'eval-source-map' : 'source-map',
        devServer: {
            contentBase: '.',
            watchContentBase: true,
            writeToDisk: true,
            port: 3000,
            watchOptions: {
                ignored: ['**/node_modules/', '**/build/']
            }
        }
    };
};
