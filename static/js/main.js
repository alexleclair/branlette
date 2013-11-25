
$(document).ready(function(){
	$('html').mousemove(function(e){
	var y = e.pageY*-0.05;
	var x = e.pageX*-0.05;
	
	$('#bras').css({'background-position-y':y});
	$('#bras').css({'background-position-x':x});
});


	$('.start').click(function(){
		$('#bras').fadeOut();
		$('#bras2').fadeIn();

		$(this).fadeOut();
	});



});
