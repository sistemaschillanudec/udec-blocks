const defaultConfig = require( '@wordpress/scripts/config/webpack.config.js' );
const path = require( 'path' );

const defaultEntry = defaultConfig.entry;

module.exports = {
	...defaultConfig,
	entry: () => ( {
		...defaultEntry(),
		'filters/index': path.resolve( process.cwd(), 'src', 'filters', 'index.js' ),
	} ),
};
