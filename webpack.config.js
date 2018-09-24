const path = require('path'),
	DojoWebpackPlugin = require('dojo-webpack-plugin'),
	UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './createCompositeScript.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'simpleRgrid.bundle.js'
	},
	plugins: [
		new DojoWebpackPlugin({
			loader: path.join(__dirname, "./dist/dojo/dojo.js"),
			loaderConfig: {
				async: true,
				isDebug: true,
				has: {'dojo-config-api': false},
				packages: [
					{
						name: 'config',
						location: './dist'
					},
					{
						name: 'dojo',
						location: './node_modules/dojo'
					},
					{
						name: "rgrid",
						location: './node_modules/rgrid/lib'
					},
					{
						name: "dstore",
						location: './node_modules/dojo-dstore'
						//location: 'https://cdn.jsdelivr.net/npm/dojo-dstore@1.1.2'
					},
					{
						name: "promised-io",
						location: './node_modules/promised-io'
					},
					{
						name: "rql",
						location: './node_modules/rollun-rql'
					},
					{
						name: "dgrid",
						//location: './node_modules/dgrid'
						location: 'https://cdn.jsdelivr.net/npm/dgrid@1'
					},
					{
						name: "dijit",
						location: './node_modules/dijit'
						//location: 'https://cdn.jsdelivr.net/npm/dijit@1'
					},
					{
						name: "dojox",
						location: './node_modules/dojox'
						//location: 'https://cdn.jsdelivr.net/npm/dojox'
					},
				],
				paths: {
					"rgrid": "./lib",
					"rgrid-examples": './example'
				},
			},
		}),
		new DojoWebpackPlugin.ScopedRequirePlugin(),
	],
	optimization: {
		//minimizer: [new UglifyJsPlugin()],
		splitChunks: {
			chunks: 'all'
		}
	}
};
