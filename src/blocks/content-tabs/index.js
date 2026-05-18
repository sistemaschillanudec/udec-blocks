import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import save from './save';

import './content-tab-item';

registerBlockType( 'udec-blocks/content-tabs', {
	edit: Edit,
	save,
} );
