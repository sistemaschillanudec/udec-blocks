<?php
/**
 * Accordeón
 *
 * @param array $attributes Block attributes.
 * @return string Rendered HTML.
 * @package UDEC\Blocks
 */

/**
 * Render template for accordion block.
 *
 * This file is intended to be included by the block registration render callback.
 * When included, the variables $attributes and $content are available in scope.
 */

$block_title       = $attributes['title'] ?? 'Título del Acordeón';
$block_description = $attributes['description'] ?? 'Bajada opcional';

// Determinar el ancla (UI de WP guarda el valor en `anchor`).
// Priorizar `anchor` (valor de la interfaz estándar) y si no existe, mantener compatibilidad con `anchorId`.
$anchor = '';
if ( ! empty( $attributes['anchor'] ) ) {
	$anchor = $attributes['anchor'];
} elseif ( ! empty( $attributes['anchorId'] ) ) {
	$anchor = $attributes['anchorId'];
}

// Usar el anchor guardado como id del artículo si existe.

// Para los identificadores internos (heading/content) seguimos usando un id único basado en anchor o generado.
if ( ! empty( $anchor ) ) {
	// Normalizar: si el anchor contiene caracteres no válidos, esc_attr lo manejará al imprimir.
	$heading_id = 'heading-' . $anchor;
} else {
	// Generar un ID único si no hay ancla persistida.
	$heading_id = 'heading-' . wp_generate_password( 6, false, false );
}

$content_id = str_replace( 'heading-', 'accordion-', $heading_id );

// Fallback: si $content está vacío (por alguna razón de serialización), intentar renderizar
// los inner blocks a partir del objeto $block disponible en el scope cuando WP incluye
// esta plantilla desde register_block_type_from_metadata.
// Preferir el contenido persistido en atributos si existe (se genera por el filtro de render_block_data).
if ( ! empty( $attributes['content'] ) ) {
	$content = $attributes['content'];
} elseif ( empty( trim( (string) $content ) ) && isset( $block ) && is_object( $block ) && ! empty( $block->inner_blocks ) ) {
	$inner_parts = array();
	foreach ( $block->inner_blocks as $inner ) {
		// render_block devolverá el HTML renderizado para el inner block.
		$inner_parts[] = render_block( $inner );
	}
	$content = implode( '', $inner_parts );
}
?>
<article class="accordion js-accordion"<?php echo ! empty( $anchor ) ? ' id="' . esc_attr( $anchor ) . '"' : ''; ?>>
<h2 class="accordion__header" id="<?php echo esc_attr( $heading_id ); ?>">
	<a class="accordion-title js-accordion-collapse" href="#<?php echo esc_attr( $content_id ); ?>">
		<span class="accordion-title__text"><?php echo esc_html( $block_title ); ?></span>
		<span class="accordion-title__description"><?php echo esc_html( $block_description ); ?></span>
	</a>
</h2>
<div id="<?php echo esc_attr( $content_id ); ?>" class="accordion__content js-accordion-content" aria-labelledby="<?php echo esc_attr( $heading_id ); ?>">
<?php
	$allowed_html         = wp_kses_allowed_html( 'post' );
	$allowed_html['svg']  = array(
		'width'   => true,
		'height'  => true,
		'viewbox' => true,
	);
	$allowed_html['path'] = array(
		'd' => true,
	);
	echo wp_kses( do_blocks( $content ), $allowed_html );
	?>
</div>
</article>
