var webpack = require("webpack");

var webpackConfig = require('./webpack.config.js');
var PROD = (process.env.NODE_ENV === 'production');

webpackConfig.entry = {
    app: ["./src/app.ts"],
    "browser-tests": ['mocha!./src/browser-tests.js'],
    vendor: [
        "react", "react-dom", "react-grid-layout", "react-grid-layout/css/styles.css",
        "redux", "react-redux", "redux-logger", "redux-thunk", "redux-form",
        "semantic-ui-css/semantic", "semantic-ui-css/semantic.css", "jquery", "c3css", "c3", "d3",
        "form-serialize", "lodash", "loadjs", "urijs", "es6-promise"
    ]
};

webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({names: ["vendor"], filename: "vendor.bundle.js", minChunks: Infinity, chunks: ["app", "vendor"]}),
    new webpack.PrefetchPlugin(webpackConfig.paths.node_modules, 'semantic-ui-css/semantic.css'),
    new webpack.PrefetchPlugin(webpackConfig.paths.node_modules, 'react/lib/ReactDOM.js'),
    new webpack.PrefetchPlugin(webpackConfig.paths.node_modules, 'react-grid-layout/build/ReactGridLayout.js'),
    new webpack.PrefetchPlugin(webpackConfig.paths.node_modules, 'react/lib/DOMChildrenOperations.js')

    // Size Optimization
    //new webpack.optimize.OccurrenceOrderPlugin()
    //new webpack.optimize.DedupePlugin(),
);

if (PROD) {
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
}

module.exports = webpackConfig;