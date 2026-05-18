/* global jQuery  */
( function ( $ ) {
	$( document ).ready( function () {
		$( document ).on(
			'click',
			'.js-accordion-collapse',
			function ( event ) {
				event.preventDefault();
				if ( $(this).prop('hash').indexOf( '#accordion-' ) !== -1 ) {
					const target = $(this).prop('hash').replace( '#', '' );
					if ( document.getElementById( target ) ) {
						const $target = $( '#' + target );
						$target.toggleClass('is-open');
					}
				}
			}
		);
	} );
} )( jQuery );
