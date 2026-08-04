import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, Button, __experimentalVStack as VStack } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

function ResponsiveImageControl( { label, imageId, imageUrl, onChange } ) {
	return (
		<MediaUploadCheck>
			<MediaUpload
				onSelect={ ( media ) => onChange( { id: media.id, url: media.url } ) }
				allowedTypes={ [ 'image' ] }
				value={ imageId }
				render={ ( { open } ) => (
					<VStack spacing={ 2 }>
						<span>{ label }</span>
						{ imageUrl ? (
							<>
								<img
									src={ imageUrl }
									alt=""
									style={ {
										maxWidth: '100%',
										height: 'auto',
										border: '1px solid #ddd',
										borderRadius: '2px',
									} }
								/>
								<VStack spacing={ 0 }>
									<Button variant="secondary" onClick={ open } __next40pxDefaultSize>
										{ __( 'Reemplazar', 'udec-blocks' ) }
									</Button>
									<Button
										variant="tertiary"
										isDestructive
										onClick={ () => onChange( { id: 0, url: '' } ) }
										__next40pxDefaultSize
									>
										{ __( 'Eliminar', 'udec-blocks' ) }
									</Button>
								</VStack>
							</>
						) : (
							<Button variant="secondary" onClick={ open } __next40pxDefaultSize>
								{ __( 'Seleccionar imagen', 'udec-blocks' ) }
							</Button>
						) }
					</VStack>
				) }
			/>
		</MediaUploadCheck>
	);
}

const targetBlocks = [ 'core/image', 'core/cover' ];

const withResponsiveImageControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( ! targetBlocks.includes( props.name ) ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, setAttributes } = props;
		const {
			hideOnMobile,
			hideOnTablet,
			hideOnDesktop,
			mobileImageId,
			mobileImageUrl,
			tabletImageId,
			tabletImageUrl,
		} = attributes;

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody title={ __( 'Imágenes por breakpoint', 'udec-blocks' ) } initialOpen={ true }>
						<VStack spacing={ 4 }>
							<ResponsiveImageControl
								label={ __( 'Tablet (576px – 839px)', 'udec-blocks' ) }
								imageId={ tabletImageId }
								imageUrl={ tabletImageUrl }
								onChange={ ( { id, url } ) =>
									setAttributes( { tabletImageId: id, tabletImageUrl: url } )
								}
							/>
							<ResponsiveImageControl
								label={ __( 'Mobile (< 576px)', 'udec-blocks' ) }
								imageId={ mobileImageId }
								imageUrl={ mobileImageUrl }
								onChange={ ( { id, url } ) =>
									setAttributes( { mobileImageId: id, mobileImageUrl: url } )
								}
							/>
						</VStack>
					</PanelBody>
					<PanelBody title={ __( 'Visibilidad', 'udec-blocks' ) } initialOpen={ false }>
						<VStack spacing={ 2 }>
							<ToggleControl
								label={ __( 'Ocultar en mobile (< 576px)', 'udec-blocks' ) }
								checked={ hideOnMobile }
								onChange={ ( value ) => setAttributes( { hideOnMobile: value } ) }
							/>
							<ToggleControl
								label={ __( 'Ocultar en tablet (576px – 839px)', 'udec-blocks' ) }
								checked={ hideOnTablet }
								onChange={ ( value ) => setAttributes( { hideOnTablet: value } ) }
							/>
							<ToggleControl
								label={ __( 'Ocultar en desktop (≥ 840px)', 'udec-blocks' ) }
								checked={ hideOnDesktop }
								onChange={ ( value ) => setAttributes( { hideOnDesktop: value } ) }
							/>
						</VStack>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withResponsiveImageControls' );

addFilter(
	'editor.BlockEdit',
	'udec-blocks/responsive-image-controls',
	withResponsiveImageControls,
);
