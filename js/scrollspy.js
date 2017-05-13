


var scroll_locked = false;
$('a[href*="#"]')
	.not('[href="#"]')
	.not('[href="#0"]')
	.not('[href*="#tab-"]')
	.click(function(event) {
	if ( location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
	  && location.hostname == this.hostname ) {
		var target = $(this.hash);
		target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
		if (target.length) {
			event.preventDefault();
			if(scroll_locked) return;
			scroll_locked = true;
			$('html, body').animate({
				scrollTop: target.offset().top
			}, 500, function() {
				scroll_locked = false;
			});
		}
	}
});

$(window).scroll(function ()
{
	var yPos = $(window).scrollTop() / 2.2;
	$('#home .text').css('margin-top', yPos + 'px');
	$nav = $('#menu');
	if( $(window).scrollTop() > 0 ){
		$nav.removeClass('top');
	}else{
		$nav.addClass('top');
	}
});
$(window).scroll();