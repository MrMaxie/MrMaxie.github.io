/**
 * All DOM targets...
 */
var $html = $('html, body'),
    $nav = $('#menu'),
    $parallaxEl = $('#home .text'),
    $window = $(window),
    $indicator = $('#menu .indicator'),
    sectionsSelectors = $('a[href*="#"]').map(function(){
		var $section = $($(this).attr('href'));
		if ($section.length && $section.hasClass('section'))
			return $(this).attr('href');
	}).toArray(),
    $sections = $.map(sectionsSelectors, function(selector){
		return $(selector);
	});
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
	// $parallaxEl.css('margin-top', (windowScroll / 2.2) + 'px');
	// if( $window.scrollTop() > 0 ){
	// 	$nav.removeClass('top');
	// }else{
	// 	$nav.addClass('top');
	// }

	// Menu spy for scroll
	var current = $.map(sectionsSelectors, function(selector){
		if($(selector).offset().top - 75 < windowScroll)
			return selector;
	});
	current = current[current.length-1];
	if(lastSelector != current){
		$('#menu .active').removeClass('active');
		$('#menu a[href="' + current + '"]').addClass('active');
	}
});
/**
 * Execute scroll handler
 */
$window.scroll();