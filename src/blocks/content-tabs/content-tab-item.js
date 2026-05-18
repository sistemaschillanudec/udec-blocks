/**
 * Bloque especial, representa el contenido de 1 pestaña en tab-rows
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { InnerBlocks } = wp.blockEditor;

registerBlockType( 'udec-blocks/content-tab-item', {
	title: __( 'Pestaña' ),
	parent: [ 'udec-blocks/content-tabs' ],
	icon: 'welcome-write-blog',
	description: __( 'El contenido de una pestaña' ),
	category: 'widgets',
	supports: {
		inserter: false,
		reusable: false,
		html: false,
		lock: false,
	},
	attributes: {
		tabId: {
			type: 'string',
			default: '',
		},
		label: {
			type: 'string',
			default: '',
		},
		index: {
			type: 'integer',
		},
	},
	usesContext: [ 'udec-blocks/content-tabs/activeTabId' ],
	edit: ( props ) => {
		const { attributes, context } = props;
		const isActive =
			context[ 'udec-blocks/content-tabs/activeTabId' ] ===
			attributes.tabId;
		return (
			<div
				className={
					isActive
						? 'tabs-content__item tabs-content__item--active'
						: 'tabs-content__item'
				}
				data-tabindex={ attributes.index }
				data-tabid={ attributes.tabId }
			>
				{ isActive ? (
					<InnerBlocks
						templateLock={ false }
						template={ [
							[
								'core/heading',
								{ placeholder: attributes.label },
							],
						] }
					/>
				) : (
					<></>
				) }
			</div>
		);
	},
	save() {
		return <InnerBlocks.Content />;
	},
} );
