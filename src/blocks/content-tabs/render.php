<?php
/**
 * Bloque Pestanas de contenido
 *
 * @var array $attributes Atributos del bloque
 * @var string $content Contenido del bloque
 * @var WP_Block $block Bloque actual
 * @package UDEC\Blocks
 */

?>
<?php

static $block_instance;
if ( is_null( $block_instance ) ) {
	$block_instance = 0;
}
++$block_instance;

$count       = count( $attributes['tabs'] );
$instance_id = 'udec-tabs-' . $block_instance;
$block_tabs  = $attributes['tabs'];
?>
<div class="tabs-block">
	<ul class="tabs-nav" role="tablist">
		<?php
		for ( $i = 0; $i < $count; $i++ ) :
			$tab_id = $block_tabs[ $i ]['tabId'] ?? '';
			?>
		<li class="<?php echo esc_attr( 0 === $i ? 'tab-active' : '' ); ?>">
			<a
				data-uid="<?php echo esc_attr( $tab_id ?? '' ); ?>"
				data-slug="<?php echo esc_attr( sanitize_title_with_dashes( remove_accents( $block_tabs[ $i ]['label'] ) ) ); ?>"
				class="<?php echo 0 === $i ? 'active js-tab' : 'js-tab'; ?>"
				id="<?php echo esc_attr( 'tab--' . $tab_id ); ?>"
				href="#<?php echo esc_attr( "tabs-row--{$tab_id}" ); ?>"
				role="tab"
				aria-controls="<?php echo esc_attr( "{$instance_id }--{$i}" ); ?>"
				aria-selected="<?php echo 0 === $i ? 'true' : 'false'; ?>"
			>
				<?php echo esc_html( $block_tabs[ $i ]['label'] ); ?>
			</a>
		</li>
		<?php endfor; ?>
	</ul>
	<div class="tabs-content">
	<?php
	foreach ( $block->parsed_block['attrs']['contents'] as $index => $content ) :
		$content_tab_id = $block_tabs[ $index ]['tabId'] ?? '';
		?>
		<div
			data-uid="<?php echo esc_attr( $content_tab_id ?? '' ); ?>"
			data-slug="<?php echo esc_attr( sanitize_title_with_dashes( remove_accents( $content['attributes']['label'] ) ) ); ?>"
			data-title="<?php echo esc_attr( $content['attributes']['label'] ); ?>"
			class="tabs-content__item <?php echo esc_attr( 0 === $index ? ' tabs-content__item--active' : '' ); ?>"
			id="<?php echo esc_attr( "tabs-row--{$content_tab_id}" ); ?>"
			role="tabpanel"
			aria-labelledby="<?php echo esc_attr( 'tab--' . $content_tab_id ); ?>"
		>
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
			echo wp_kses( do_blocks( $content['innerContent'] ), $allowed_html );
			?>
		</div>
	<?php endforeach; ?>
	</div>
</div>
