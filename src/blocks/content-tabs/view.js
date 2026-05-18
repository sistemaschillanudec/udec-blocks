/* global jQuery */
jQuery(function ($) {
	function updateLocationHash(hash) {
		const newUrl = new URL(window.location.href);
		newUrl.hash = `tabs-row--${hash}`;
		window.history.replaceState(null, null, newUrl.toString());
	}

	if (document.location.hash.indexOf("tabs-row--") >= 0) {
		const tabId = document.location.hash.replace("#tabs-row--", "");
		const tabs = $(`.js-tab[data-uid="${tabId}"]`).closest(".tabs-nav");
		tabs.find(".tab-active").removeClass("tab-active");
		$(`.js-tab[data-uid="${tabId}"]`).parent().addClass("tab-active");
		$(`.tabs-content__item[data-uid="${tabId}"]`)
			.siblings(".tabs-content__item--active")
			.removeClass("tabs-content__item--active");
		$(`.tabs-content__item[data-uid="${tabId}"]`).addClass(
			"tabs-content__item--active",
		);
		window.scrollTo({
			top: tabs.offset().top - 100,
			behavior: "smooth",
		});
	}

	$("body")
		.on("click", ".tabs-nav a", function (event) {
			// Comportamiento de pestañas en pantallas grandes.
			event.preventDefault();
			// Quitar clase activa en las pestañas
			$(this)
				.closest(".tabs-nav")
				.find(".tab-active")
				.removeClass("tab-active");
			// Quitar atributo aria-selected en la pestañas
			$(this)
				.closest(".tabs-nav")
				.find('a.js-tab[aria-selected="true"]')
				.attr("aria-selected", "false");
			// Agregar clase activa en la pestaña seleccionada
			$(this).attr("aria-selected", "true").parent().addClass("tab-active");
			$(this)
				.closest(".tabs-nav")
				.next(".tabs-content")
				.find(".tabs-content__item--active")
				.removeClass("tabs-content__item--active");
			const tabUid = $(this).data("uid");
			$(this)
				.closest(".tabs-nav")
				.next(".tabs-content")
				.find('[data-uid="' + tabUid + '"]')
				.addClass("tabs-content__item--active");
			updateLocationHash(tabUid);
		})
		.on("click", 'a[href*="#tabs-row--"]:not(.js-tab)', function (event) {
			event.preventDefault();
			const elementUrl = new URL($(this).attr("href"));
			const tabId = elementUrl.hash.replace("#tabs-row--", "");
			const tabExists = $(`.js-tab[data-uid="${tabId}"]`);
			if (!tabExists.length) {
				return;
			}
			tabExists.trigger("click");
			// Scroll to the active tab
			window.scrollTo({
				top: tabExists.closest(".tabs-nav").offset().top - 100,
				behavior: "smooth",
			});
		});
});
