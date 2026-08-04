const defaultConfig = require('@wordpress/scripts/config/webpack.config.js');
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		...defaultConfig.entry,
		'filters/index': path.resolve( process.cwd(), 'src', 'filters', 'index.js' ),
	},
};
