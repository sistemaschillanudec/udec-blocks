import { addFilter } from '@wordpress/hooks';

const targetBlocks = [ 'core/image', 'core/cover' ];

addFilter(
	'blocks.registerBlockType',
	'udec-blocks/add-responsive-image-attrs',
	( settings, name ) => {
		if ( ! targetBlocks.includes( name ) ) {
			return settings;
		}
		return {
			...settings,
			attributes: {
				...settings.attributes,
				hideOnMobile: {
					type: 'boolean',
					default: false,
				},
				hideOnTablet: {
					type: 'boolean',
					default: false,
				},
				hideOnDesktop: {
					type: 'boolean',
					default: false,
				},
				mobileImageId: {
					type: 'number',
					default: 0,
				},
				mobileImageUrl: {
					type: 'string',
					default: '',
				},
				tabletImageId: {
					type: 'number',
					default: 0,
				},
				tabletImageUrl: {
					type: 'string',
					default: '',
				},
			},
		};
	},
);
