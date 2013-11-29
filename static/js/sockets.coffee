App = 
	config:
		endpoint:'http://alexleclair.ca:8090/'
	socket:null
	labels:{}
	agencies:{}
	code:null
	agency:null
	shakes:0

	shakeTimeout: null;


	init: (callback)=>
		App.socket = io.connect(App.config.endpoint);
		App.socket.on 'labels', (data)->
			App.labels = data;
		App.socket.on 'pick', (data)->
			App.agency = data;
			App.shakes = 0;
		App.socket.on 'shake', ()->
			App.shakes++;
			$('div[data-info="shake-sessioncount"]').text(App.shakes);
			clearTimeout(App.shakeTimeout)
			$('body').addClass('shake');
			App.shakeTimeout = setTimeout ()->
				$('body').removeClass('shake');
			, 500
			console.log 'current shakes for ' + App.agency + ' is ' + App.shakes;
		App.socket.on 'agencies', (data)->
			App.agencies = data;
			App.refreshLeaderboards()
		App.socket.on 'code', (code)->
			App.code = code;
			App.refreshCodeScreen();
	bindToCode: (code)=>
		App.socket.emit 'registerSibling', code
	
	shake: (agency)->
		if !agency?
			agency = App.agency;
		App.socket.emit('shake', agency);

	refreshCodeScreen: ()=>
		alert 'Code is ' + App.code;
	refreshLeaderboards: ()=>
		agencies = App.sortAgencies()

		source = $('#template-leaderboard').html();
		template = Handlebars.compile(source);
		$('#top5').html template 
			limit:5
			agencies:agencies
		$('#leaderboard').html template 
			limit:agencies.length
			agencies:agencies



	sortAgencies:(_agencies=null)=>
		if !_agencies?
			_agencies = App.agencies;
		sorted = [];
		for key of _agencies
			obj = 
				name:App.labels[key]
				key:key
				score:_agencies[key].count
				people:_agencies[key].people

			if sorted.length == 0 || obj.score > sorted[sorted.length-1].score
				sorted.push obj
				continue;

			for i in [0...sorted.length]
				if sorted[i].score >= obj.score
					sorted.splice(i, 0, obj);
					break;
		sorted.reverse();
		for i in [0...sorted.length]
			sorted[i].rank = i+1;
		return sorted;





$ ->
	Handlebars.registerHelper 'each_upto', (ary, max, options)->
	    if(!ary || ary.length == 0)
	        return options.inverse(this);

	    result = [ ];
	    for i in [0...Math.min(ary.length, max)]
	        result.push(options.fn(ary[i]));
	    return result.join('');
	
	App.init();
	if /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
		$('div.step').hide();
		$('div.page-landing-iphonecode').show();

	if window.DeviceMotionEvent?
		# Shake sensitivity (a lower number is more)
		sensitivity = 20;

		# Position variables
		x1 = 0
		y1 = 0
		z1 = 0
		x2 = 0
		y2 = 0
		z2 = 0

		# Listen to motion events and update the position
		window.addEventListener('devicemotion',  (e)-> 
			x1 = e.accelerationIncludingGravity.x;
			y1 = e.accelerationIncludingGravity.y;
			z1 = e.accelerationIncludingGravity.z;
		, false);

		# Periodically check the position and fire
		# if the change is greater than the sensitivity
		setInterval(()->
			change = Math.abs(x1-x2+y1-y2+z1-z2);

			if change > sensitivity 
				App.shake();


			# Update new position
			x2 = x1;
			y2 = y1;
			z2 = z1;
		, 150);
  

window.Branlette = App;