/**
 * All DOM targets...
 */
var $html = $('html, body'),
    $parallaxEl = $('#home .text'),
    $scrollForMore = $('#home .info'),
    $window = $(window),
    sectionsSelectors = $('a[href*="#"]').map(function(){
			var $section = $($(this).attr('href'));
			if ($section.length && $section.hasClass('section'))
				return $(this).attr('href');
		}).toArray(),
		$sections = $.map(sectionsSelectors, function(selector){
			return $(selector);
		}),
		$onscrollto = $.map($('[onscrollto]'), function(x){
			$(x).one('scrolled-to', function(){
				$(x).addClass($(x).attr('onscrollto'));
			});
			return $(x);
		});

/**
 * Check if element is visible
 */
function isScrolledIntoView(element)
{
	var pageTop = $(window).scrollTop();
	var pageBottom = pageTop + $(window).height();
	var elementTop = $(element).offset().top;
	var elementBottom = elementTop + $(element).height();

	return ((pageTop < elementTop) && (pageBottom > elementBottom));
}
/**
 * Scroll to section if target exists and have class "section"
 */
$('a[href*="#"]').click(function(event)
{	
	if(sectionsSelectors.indexOf(this.hash) == -1) return;
	event.preventDefault();
	$html.stop(true, false);
	$html.animate({
		scrollTop: $(this.hash).offset().top
	}, 500);
});
/**
 * Last selector
 * @type {String}
 */
var lastSelector = '';
/**
 * Handler for scrolling
 */
$window.scroll(function()
{
	var windowScroll = $window.scrollTop();

	// Parallax effect
	$parallaxEl.css('margin-top', (windowScroll / 1.7) + 'px');
	if( $window.scrollTop() - 20 > 0 ){
		$scrollForMore.addClass('inactive');
	}else{
		$scrollForMore.removeClass('inactive');
	}

	$.map($onscrollto, function(x){
		if(isScrolledIntoView(x))
			x.trigger('scrolled-to');
	});

	// Menu spy for scroll
	var current = $.map(sectionsSelectors, function(selector){
		if($(selector).offset().top - 60 < windowScroll)
			return selector;
	});
	current = current[current.length-1];
	if(lastSelector != current){
		$('.menu .active').removeClass('active');
		$('.menu a[href="' + current + '"]').addClass('active');
	}
});
/**
 * Execute scroll handler
 */
$window.scroll();