
$(document).ready(function(){
	$('html').mousemove(function(e){
	var y = e.pageY*-0.05;
	var x = e.pageX*-0.05;
	
	$('.bras').css({'background-position-y':y});
	$('.bras').css({'background-position-x':x});

	$('form#code-form').submit(function(e){
		e.preventDefault();
		Branlette.bindToCode($.trim($('input.code').val()).toLowerCase());
		$('div.step').hide();
		$('div.page-shake-iphone').show();
		return false;
	})
});


	$('.start').click(function(){
		$('#bras').fadeOut();
		$('#bras2').fadeIn();

		$(this).fadeOut();
	});

	$('.start').click(function(){
		$('#bras').fadeOut();
		$('#bras2').fadeIn();

		$(this).fadeOut();
	});


	//$("div.step:not(:first)").hide();

	$('.stepmaster').click(function() {

		var $ancestor = $(this).parent('.step');
		// Get the next .newsSingle
		var $next = $ancestor.next('.step');
		// If there wasn't a next one, go back to the first.
		if($next.length === 0 ) {
			$next = $ancestor.prevAll('.step').last();
		}
		$ancestor.fadeOut();
		$next.fadeIn();
	});


	$('.page-landing-agence-iphone ul li').click(function() {
		$('.page-landing-agence-iphone').addClass('one-selected');
		$('.page-landing-agence-iphone ul li').removeClass('active').removeClass('prev-active');
		$(this).addClass('active');
		$(this).prev('li').addClass('prev-active');
	});

	$('ul li.active').click(function() {
		$('.page-landing-agence-iphone').removeClass('one-selected');
		$('.page-landing-agence-iphone ul li').removeClass('active').removeClass('prev-active');
	});



	$('button[data-action="shake"]').click(function() {
		$('.shake-bras').effect('shake',{direction:'up', times:1});
	// $('.shake-bras').animate({
	// 	'background-position-x' : '+=50',
	// 	'background-position-y': '+=50'
	// }, 1000);
	});


	$(".shake-bulle").each(function() {
		var sheight = $(window).height() - 500;
		var swidth = $(window).width() - 200;

		var positionX = Math.floor((Math.random()*swidth)+100);
		var positionY = Math.floor((Math.random()*sheight)+100); 

		$(this).css({
			'top':positionY,
			'left':positionX
		});
	});

	


});