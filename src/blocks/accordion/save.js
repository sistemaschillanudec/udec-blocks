import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	// Si el usuario ha usado la interfaz de anclaje estándar, el valor estará en `attributes.anchor`.
	// Mantener compatibilidad con `anchorId` si existe.
	const anchor = attributes?.anchor || attributes?.anchorId || '';
	const blockProps = useBlockProps.save( anchor ? { id: anchor } : undefined );
	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
