
$(document).ready(function(){
	$('html').mousemove(function(e){
	var y = e.pageY*-0.05;
	var x = e.pageX*-0.05;
	
	$('.bras').css({'background-position-y':y});
	$('.bras').css({'background-position-x':x});
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
});