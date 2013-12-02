
$(document).ready(function(){
// 	$('html').mousemove(function(e){
// 	var y = e.pageY*-0.05;
// 	var x = e.pageX*-0.05;
	
// 	$('.bras').css({'background-position-y':y});
// 	$('.bras').css({'background-position-x':x});


// });
	$(window).on('keydown', function(e){
		if($('.step.current').is('.pageiphone-shake')){ //Prevent shake to undo bullshit
			e.preventDefault();
			return false;
		}
	})
	$('form#code-form').submit(function(e){
		e.preventDefault();
		$(this).attr('readonly', 'readonly')
		Branlette.bindToCode($.trim($('input.code').val()).toLowerCase());
		$(this).blur();
		$('#logo').focus();
		// Branlette.gotoPage('page-shake-iphone')
		// $('div.step').hide();
		// $('div.page-shake-iphone').show();
		return false;
	});

	$('.start').click(function(){
		Branlette.gotoPage('page-landing', 'landing-code')
	});

	$('.btn-leaderboard').click(function(e){
		e.preventDefault();
		Branlette.gotoPage('page-classement')
	});

	$('.btn-change-object').click(function(e){
		e.preventDefault();
		objects = Branlette.objects.slice(0);
		index = objects.indexOf(Branlette.currentObject);
		if(index >= 0)
			objects.splice(index, 1);
		obj = objects[Math.floor(Math.random() * (objects.length-1))];
		Branlette.changeObject(obj);
		return false;
	});

	$('.btn-no-code').click(function(e){
		e.preventDefault();

		Branlette.gotoPage('pageiphone-agence')

		return false;
	})

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


	$('.pageiphone-agence ul li').click(function() {
		$('.pageiphone-agence').addClass('one-selected');
		$('.pageiphone-agence ul li').removeClass('active').removeClass('prev-active');
		$(this).addClass('active');
		$(this).prev('li').addClass('prev-active');
		
	});

	$('ul li.active').click(function() {
		$('.pageiphone-agence').removeClass('one-selected');
		$('.pageiphone-agence ul li').removeClass('active').removeClass('prev-active');
	});


	//$('body.shake .shake-bras').effect('shake',{direction:'up', times:1});


	$('.btn-shake').click(function() {
	$('.shake-bras').effect('shake',{direction:'up', times:1});
		//$('.shake-bras').toggleClass('shaking');
	


	// $('.shake-bras').animate({
	// 	'background-position-x' : '+=50',
	// 	'background-position-y': '+=50'
	// }, 1000);
	});


	$(".shake-bulle").each(function() {

		var positionX = Math.floor((Math.random()*900)-100);
		var positionY = Math.floor((Math.random()*200)-100);

		$(this).css({
			'top':positionY,
			'left':positionX
		});
	});

	$('.bras2image').css({
			'width': $(window).height()
		});

	$(window).resize(function() {
	

		$('.bras2image').css({
			'width': $(window).height()
		});
	});

	$('.icon-facebook').click(function(e){
		e.preventDefault();
		Branlette.facebookShare();
		return false;
	})

	$('.icon-twitter').click(function(e){
		e.preventDefault();
		Branlette.twitterShare();
		return false;
	})

});