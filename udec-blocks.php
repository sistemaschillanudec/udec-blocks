<?php
/**
 * Bloques UdeC
 *
 * Plugin Name:  UdeC Blocks
 * Description:  Bloques personalizados para UdeC
 * Version:      0.1.0
 * Plugin URI:   https://bloom.lat
 * Author:       bloom.lat
 * Author URI:   https://bloom.lat
 * Text Domain:  udec_blocks
 * Requires at least: 6.7
 * Requires PHP: 8.1
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 *
 * @package   UDEC\Blocks
 */

use Queulat\Helpers\Arrays;

add_action( 'init', 'udec_blocks_init' );

/**
 * Registrar bloques
 *
 * @return void
 */
function udec_blocks_init() {
	$blocks = array(
		'content-tabs',
		'accordion',
	);
	foreach ( $blocks as $block ) {
		register_block_type( __DIR__ . '/build/blocks/' . $block );
	}

	// Bloque para el contenido de una pestaña.
	register_block_type(
		'udec-blocks/content-tab-item',
		array(
			'attributes'      => array(
				'tabId' => array(
					'type'    => 'string',
					'default' => '',
				),
				'label' => array(
					'type'    => 'string',
					'default' => '',
				),
				'index' => array(
					'type'    => 'integer',
					'default' => 0,
				),
			),
			'render_callback' => function (): string {
				return '';
			},
		)
	);

	wp_register_script(
		'micromodal.js',
		plugins_url( 'node_modules/micromodal/dist/micromodal.min.js', __FILE__ ),
		array(),
		'0.4.10',
		array(
			'strategy'  => 'defer',
			'in_footer' => false,
		)
	);
}


/**
 * Añadir atributos del bloque como variables CSS
 *
 * @param WP_Block $block Bloque de WordPress.
 * @return string String de atributos HTML del bloque.
 */
function udec_blocks_redux_wrapper_attributes( WP_Block $block ) {
	$extra_attributes = array();
	$attributes       = $block->attributes;
	$allowed_keys     = array(
		'backgroundColor',
		'textColor',
		'columns',
	);
	$style_props      = array();
	$flat_style_atts  = Arrays::flatten( $attributes['style'] );
	$style_atts       = array();
	foreach ( $flat_style_atts as $key => $val ) {
		$sanitized_key                = str_replace( '.', '--', $key );
		$style_atts[ $sanitized_key ] = $val;
	}
	$kebab_case = function ( string $input ): string {
		$split_words = preg_split( '/(?<=[a-z])(?=[A-Z])/', $input );
		return $split_words ? implode( '--', array_map( 'strtolower', $split_words ) ) : $input;
	};
	foreach ( $style_atts as $key => $val ) {
		$style_props[] = '--udec-blocks--style--' . $kebab_case( $key ) . ': ' . udec_blocks_parse_css_value( $val ) . '; ';
	}
	foreach ( $allowed_keys as $additional_key ) {
		if ( empty( $attributes[ $additional_key ] ) ) {
			continue;
		}
		if ( is_numeric( $attributes[ $additional_key ] ) ) {
			$style_props[] = '--udec-blocks--' . $kebab_case( $additional_key ) . ': ' . $attributes[ $additional_key ] . '; ';
		} else {
			$style_props[] = '--udec-blocks--' . $kebab_case( $additional_key ) . ': var(--wp--preset--color--' . $attributes[ $additional_key ] . '); ';
		}
	}
	$extra_attributes['style'] = implode( '', $style_props );

	$children_count            = count( $block->inner_blocks );
	$extra_attributes['class'] = $extra_attributes['class'] ?? '';
	if ( $children_count > 0 ) {
		$extra_attributes['class'] .= 'has-block-children';
		if ( 0 === $children_count % 2 ) {
			$extra_attributes['class'] .= ' has-block-children-div-2';
		} elseif ( 0 === $children_count % 3 ) {
			$extra_attributes['class'] .= ' has-block-children-div-3';
		}
	}

	return get_block_wrapper_attributes( $extra_attributes );
}

/**
 * Parsear valor de CSS
 *
 * Convierte variables codificadas en estilo de WordPress a nombres de variables CSS.
 *
 * @param string $value Valor de atributo de un bloque.
 * @return string Valor de CSS parseado.
 */
function udec_blocks_parse_css_value( string $value ): string {
	return str_contains( $value, 'var:' ) ?
		'var(--wp--' . implode( '--', explode( '|', str_replace( 'var:', '', $value ) ) ) . ')' :
		$value;
}

add_filter( 'render_block_data', 'udec_blocks_filter_tabs_data' );

// Añadir filtro para incluir el contenido de innerBlocks en los atributos del bloque acordeón.
add_filter( 'render_block_data', 'udec_blocks_filter_accordion_data' );

/**
 * Filtrar datos del bloque acordeón
 *
 * Agrega el contenido de los innerBlocks al atributo 'content' para que el render
 * server-side tenga acceso al HTML serializado y se conserve al recargar/guardar.
 *
 * @param array $block Bloque de WordPress.
 * @return array Bloque con atributo content añadido.
 */
function udec_blocks_filter_accordion_data( array $block ): array {
	if ( ! isset( $block['blockName'] ) || 'udec-blocks/accordion' !== $block['blockName'] ) {
		return $block;
	}

	$contents = array_map(
		function ( $inner_block ) {
			// render_block devuelve el HTML del inner block; si no está disponible, usar innerHTML.
			return render_block( $inner_block ) ?? wp_kses_post( $inner_block['innerHTML'] ?? '' );
		},
		$block['innerBlocks'] ?? array()
	);

	$block['attrs']['content'] = implode( '', $contents );
	return $block;
}

/**
 * Filtrar datos del bloque de pestañas
 *
 * Agrega el contenido de los tabs al bloque de pestañas.
 *
 * @param array $block Bloque de WordPress.
 * @return array Bloque de pestañas con atributos adicionales.
 */
function udec_blocks_filter_tabs_data( array $block ): array {
	if ( ! isset( $block['blockName'] ) || 'udec-blocks/content-tabs' !== $block['blockName'] ) {
		return $block;
	}
	$contents                   = array_map(
		function ( $inner_block ) {
				// Obtener el contenido del innerblock.
				$tab_content = array_map(
					function ( $_inner_block ) {
						$inner_tab_content = render_block( $_inner_block ) ?? wp_kses_post( $_inner_block['innerHTML'] );
						return $inner_tab_content;
					},
					$inner_block['innerBlocks']
				);
				return array(
					'attributes'   => $inner_block['attrs'],
					'innerContent' => implode( '', $tab_content ),
				);
		},
		$block['innerBlocks']
	);
	$block['attrs']['contents'] = $contents;
	return $block;
}
