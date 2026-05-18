import { useBlockProps, InnerBlocks, PlainText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { serialize } from '@wordpress/blocks';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { title, description, anchorId } = attributes;
	const blockProps = useBlockProps();

	// Obtener todos los bloques en el editor para detectar colisiones de anchorId.
	const allBlocks = useSelect( ( select ) => select( 'core/block-editor' ).getBlocks(), [] );
	// Obtener innerBlocks para este bloque (para serializarlos y persistirlos en el atributo 'content').
	const innerBlocks = useSelect(
		( select ) => {
			const block = select( 'core/block-editor' ).getBlock( clientId );
			return block ? block.innerBlocks : [];
		},
		[ clientId ]
	);

	// Generar y persistir un ID único para este bloque si no existe o si hay colisión.
	useEffect( () => {
		const makeId = () => 'heading-' + clientId.slice( 0, 8 ) + '-' + Math.random().toString(36).slice(2,6);

		// Si no tiene anchorId o si otro bloque distinto tiene el mismo anchorId, generamos uno nuevo.
		const collision = anchorId && allBlocks.some( ( b ) => b.clientId !== clientId && b.attributes && b.attributes.anchorId === anchorId );
		if ( ! anchorId || collision ) {
			const id = makeId();
			setAttributes( { anchorId: id } );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ clientId, allBlocks ] );

	const headingId = anchorId || ( 'heading-' + clientId.slice( 0, 8 ) );
	const contentId = headingId.replace( 'heading-', 'accordion-' );

	// Serializar innerBlocks y guardarlos en el atributo 'content' para asegurar persistencia.
	useEffect( () => {
		if ( innerBlocks && innerBlocks.length > 0 ) {
			try {
				const html = innerBlocks.map( ( b ) => serialize( b ) ).join( '' );
				// Solo actualizar si cambió para evitar renders innecesarios.
				if ( html !== ( attributes.content || '' ) ) {
					setAttributes( { content: html } );
				}
			} catch ( e ) {
				// No bloquear si serialize falla.
				// eslint-disable-next-line no-console
				console.error( 'Error serializing innerBlocks for accordion', e );
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ innerBlocks ] );

	return (
		<div { ...blockProps }>
			<article className="accordion js-accordion">
				<h2 className="accordion__header" id={ headingId }>
					{/* Usamos un elemento no-navegable en el editor para evitar pérdida de foco */}
					<div className="accordion-title js-accordion-collapse" role="button" aria-controls={ contentId } aria-expanded="true">
						<PlainText
							tagname="span"
							className="accordion-title__text"
							value={ title }
							onChange={ ( value ) => setAttributes( { title: value } ) }
							placeholder={ __( 'Título', 'mi-plugin' ) }
						/>
						<PlainText
							tagname="span"
							className="accordion-title__description"
							value={ description }
							onChange={ ( value ) => setAttributes( { description: value } ) }
							placeholder={ __( 'Bajada', 'mi-plugin' ) }
						/>
						<span className="accordion-title__icon"></span>
					</div>
				</h2>
				<div id={ contentId } className="accordion__content js-accordion-content is-open" aria-labelledby={ headingId } style={ { display: 'block' } }>
					<div className='accordion__content-inner'>
						<InnerBlocks />
					</div>
				</div>
			</article>
		</div>
	);
}
