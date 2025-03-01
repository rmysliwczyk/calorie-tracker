const path = require("path");

module.exports = {
    mode: "development",
    module: {
        rules: [
            { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" }
        ]
    },
    entry: {
        about: path.resolve(__dirname, 'calorie_tracker/static/calorie_tracker/react/pages/about.tsx')
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'calorie_tracker/static/calorie_tracker/react/pages')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        extensionAlias: {
            ".js": [".js", ".ts"],
            ".cjs": [".cjs", ".cts"],
            ".mjs": [".mjs", ".mts"]
        }
    }
}