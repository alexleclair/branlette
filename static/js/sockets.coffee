App = 
	config:
		endpoint:'http://alexleclair.ca:8090/'
	socket:null
	labels:{}
	agencies:{}
	code:null
	agency:null
	shakes:0
	isMobile:false
	shakeTimeout: null
	lastShakeTimes: [];
	siblingsCount:0;
	objects:[
		'marie'
		'jesus'
		'nutcracker'
		'emballage'
		'boite'
		'canne'
		'explosif'
		'ange'
		'roi'
		'canne2'
		'cierge'
		'boule'
	]

	messages:[
		'Enweille, lâche pas la banane!',
		'T\'y es presque, hein?',
		'Allez, viens!',
		'Pas game d\'aller plus vite.',
		'Arrête pas!',
		'Tes parents seraient fiers de toi.'
	]
	messagesTimeout:
		min:3000
		max:9000
		timerId:null

	sounds:[
		{
			mp3:'sounds/branlette_01.mp3',
			ogg:'sounds/branlette_01.ogg',
		},
		{
			mp3:'sounds/branlette_02.mp3',
			ogg:'sounds/branlette_02.ogg',
		},
		{
			mp3:'sounds/branlette_03.mp3',
			ogg:'sounds/branlette_03.ogg',
		},
		{
			mp3:'sounds/branlette_04.mp3',
			ogg:'sounds/branlette_04.ogg',
		},
		{
			mp3:'sounds/branlette_05.mp3',
			ogg:'sounds/branlette_05.ogg',
		},
		{
			mp3:'sounds/branlette_06.mp3',
			ogg:'sounds/branlette_06.ogg',
		},
		{
			mp3:'sounds/branlette_07.mp3',
			ogg:'sounds/branlette_07.ogg',
		},
		{
			mp3:'sounds/branlette_08.mp3',
			ogg:'sounds/branlette_08.ogg',
		},
		{
			mp3:'sounds/branlette_09.mp3',
			ogg:'sounds/branlette_09.ogg',
		},
		{
			mp3:'sounds/branlette_10.mp3',
			ogg:'sounds/branlette_10.ogg',
		},
		{
			mp3:'sounds/branlette_11.mp3',
			ogg:'sounds/branlette_11.ogg',
		},
		{
			mp3:'sounds/branlette_12.mp3',
			ogg:'sounds/branlette_12.ogg',
		},
		{
			mp3:'sounds/branlette_13.mp3',
			ogg:'sounds/branlette_13.ogg',
		},
		{
			mp3:'sounds/branlette_14.mp3',
			ogg:'sounds/branlette_14.ogg',
		},
		{
			mp3:'sounds/branlette_15.mp3',
			ogg:'sounds/branlette_15.ogg',
		},
	]
	silenceSound:
		mp3:'sounds/silence.mp3',
		ogg:'sounds/silence.ogg',
	currentObject: null;
	playSounds:true;

	init: (callback)=>
		$('#audio').on 'ended', (e)->
			if !App.isMobile
				App.playSound();
			else
				App.playSound(App.silenceSound);
		App.socket = io.connect(App.config.endpoint);
		App.socket.on 'labels', (data)->
			App.labels = data;
			App.resetTexts();
		App.socket.on 'pick', (data)->
			App.agency = data;
			App.shakes = 0;
			App.resetTexts();
			$('body').addClass('has-agency');
			if App.isMobile
				App.gotoPage 'pageiphone-shake'
				if App.siblingsCount < 2
					App.changeObject App.objects[Math.floor(Math.random() * (App.objects.length-1))], true
			else
				App.gotoPage 'page-shake', 'shake-intro'
				App.changeObject App.objects[Math.floor(Math.random() * (App.objects.length-1))], true

			setTimeout App.displayMessage, 5000;
				

		App.socket.on 'object', (obj) ->
			App.changeObject(obj)
		App.socket.on 'disconnect', ()->
			window.location = window.location;
		App.socket.on 'shake', ()->
			App.lastShakeTimes.push(new Date().getTime());
			if App.lastShakeTimes.length > 5
				App.lastShakeTimes.splice(0,1);
			total = 0;
			for i in [1...App.lastShakeTimes.length]
				total += App.lastShakeTimes[i] - App.lastShakeTimes[i-1];
			velocity = 1000;
			if App.lastShakeTimes.length > 1
				velocity = total/App.lastShakeTimes.length-1
			_class= 'shakelent'
			if velocity >= 350
				_class = 'shakelent'
			else if velocity >= 170
				_class = 'shakemedium'
			else
				_class = 'shake'
			App.shakes++;
			App.lastShakeTime = new Date().getTime()
			$('div[data-info="shake-sessioncount"]').text(App.shakes);
			# $('.shake-bras').effect('shake',{direction:'up', times:1});
			clearTimeout(App.shakeTimeout)
			if !$('body').is('.'+_class)
				$('body').removeClass('shake').removeClass('shakemedium').removeClass('shakelent')
			$('body').addClass(_class);
			App.shakeTimeout = setTimeout ()->
				$('body').removeClass('shake').removeClass('shakemedium').removeClass('shakelent');
				$('.shake-bras').stop(true);
				if !App.isMobile
					App.gotoPage 'page-shake', 'shake-repos',500
			, 2500
			if !App.isMobile
				App.gotoPage 'page-shake', 'shake-shake', 0
		App.socket.on 'agencies', (data)->
			App.agencies = data;
			App.refreshLeaderboards()
			App.resetTexts();
		App.socket.on 'wrongcode', (data)->
			alert 'Ce code n\'existe pas.'
			if App.isMobile
				App.gotoPage 'pageiphone-landing'
			else
				App.gotoPage 'page-landing', 'landing-code'


		App.socket.on 'siblingsCount', (count)->
			App.siblingsCount = count;
			#console.log 'Eille, y\'a '+count+'personnes connectées man'
			$current = $('div.step.current');
			isLanding = $current.length > 0 && $current.is('.page-landing');

			if count == 1 && App.isMobile
				window.location = window.location;

			if !App.isMobile && isLanding
				App.gotoPage('page-landing', 'landing-confirmation');
			if App.isMobile && $('div.step.current').is('.pageiphone-landing')
				App.gotoPage('pageiphone-agence')

		App.socket.on 'code', (code)->
			App.code = code;
			App.refreshCodeScreen();
	
	displayMessage: (msg, x,y, fadeTime=200, timer=null)=>
		$bulle = $('.shake-bulle')
		$parent = $bulle.parent();
		if !msg?
			_msgs = App.messages.slice(0);
			index = _msgs.indexOf($bulle.find('h3').text())
			if index >= 0
				_msgs.splice(index, 1);
			msg = _msgs[Math.floor(Math.random()*_msgs.length)];

		if !x?
			x = Math.random()*($parent.width()/1) #+ $parent.width()/4
		if !y?
			y = Math.random()*($parent.height()/1)-200 #+ $(window).height()/4
		$bulle.fadeOut fadeTime,()=>
			$bulle.find('h3').text(msg);
			$bulle.css('top', y+'px').css('left', x+'px').fadeTo(fadeTime, 1);
		if !timer?
			timer = Math.random()*(App.messagesTimeout.max-App.messagesTimeout.min) + App.messagesTimeout.min

		if timer? && timer > 0
			App.messagesTimeout.timerId = setTimeout(App.displayMessage, timer)



	playSound:(sound)->
		if !App.playSounds
			return;
		if !sound?
			sound = App.sounds[Math.floor(Math.random()*App.sounds.length)];
		$('#audio source').remove();
		html = '<source src="'+sound.mp3+'" type="audio/mpeg" />';
		$('#audio-player #audio').append($(html));
		html = '<source src="'+sound.ogg+'" type="audio/ogg />'
		$('#audio-player #audio').append($(html));
		try
			$('#audio').get(0).play();
		catch e
			# ...
	stopSound:()->
		try
			$('#audio').get(0).pause();
		catch e
			# ...
		
		App.playSounds = false;
	replaySound:()->
		App.playSounds = true;
		App.playSound();

	bindToCode: (code)=>
		App.socket.emit 'registerSibling', code
	
	pickAgency: (agency)->
		App.socket.emit 'pick', agency;
		ga('send','pageview', '/virtual/pick/'+agency)

	shake: (agency)->
		if !agency?
			agency = App.agency;
		App.socket.emit('shake', agency);

	changeObject:(obj, sendToServer=false)=>
		classes = ($('body').attr('class')+'').split(' ');
		for i in [0...classes.length]
			if classes[i].substr(0,7) == 'object-'
				$('body').removeClass(classes[i])
		$('body').addClass('object-'+obj);
		App.currentObject = obj;

		if sendToServer
			App.socket.emit 'object', obj
		ga('send','pageview', '/virtual/background/'+obj)



	resetTexts:()=>
		agency = App.agency;
		if App.labels? && App.labels[agency]?	
			$('.agencyName').text(App.labels[agency])
		if App.agencies? && App.agencies[agency]?
			agencies = App.sortAgencies();
			index = -1;
			for i in [0...agencies.length]
				if agencies[i].key == agency
					index = i+1;
					break;
			$('.agencyIndex').text(index)			
			$('.agenciesCount').text(agencies.length)	
			$('.agencyShakes').text(App.agencies[agency].count)		
			$('.agencyPeople').text(App.agencies[agency].people)		
		if App.labels?
			_agencies = []
			_byName = {}
			for key of App.labels
				_agencies.push App.labels[key]
				_byName[App.labels[key]] = key;
			_agencies.sort();
			for i in [0..._agencies.length]
				_agencies[i] = 
					name: _agencies[i]
					key: _byName[_agencies[i]]
			source = $('#template-agencies-list').html();
			template = Handlebars.compile(source);
			$('#agency-picker').html template
				agencies:_agencies
			$('#agency-picker li a').click (e)->
				e.preventDefault();

				App.pickAgency $(this).attr('data-key');
				#if App.siblingsCount <= 1 #Only play sound on the phone when there is no desktop
				#App.playSound();
				App.playSound(App.silenceSound);

				return false;

	refreshCodeScreen: ()=>
		$('div[data-info="code"]').text(App.code);
		$('div.landing-code .biphone-contenu').show();
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

	gotoPage:(step, substep, fadeTime=500)=>

		if window.isOli? || (window.location+'').indexOf('static') > 0
			return;

		$div = $('div.step.'+step);
		if !$('div.step.current').is('.'+step)
			$('div.step').hide().removeClass('current');


		if substep? && !$div.find('.substep.current').is('.'+substep)

			$div.find('.substep').not('.'+substep).fadeOut fadeTime, (e)=>
				$div.find('.substep').removeClass('current');
				$div.find('.substep.'+substep).fadeIn(fadeTime).addClass('current');
		$div.addClass('current').fadeIn(fadeTime);

		page = '/virtual/'+step;
		if substep?
			page += '/'+substep

		if !App.lastPage? || App.lastPage != page
			ga('send','pageview', page)
			console.log 'tracked', page
		App.lastPage = page;




	facebookShare:()=>
		msg = 'Viens shaker pour ton équipe favorite et prend part à la Grande Branlette de Noël.'
		if App.agency?
			msg = 'J\'ai shaké '+App.shakes+' fois pour ' + App.labels[App.agency]+' sur la Grande Branlette De Noël!';
		FB.ui
			method: 'feed'
			name: 'La Grande Branlette de Noël'
			link: 'http://localhost/'
			picture: ' http://7cffd474.ngrok.com/img/logo_branlette.png'
			caption: msg
			description: 'En participant à la Grande Branlette, tu aides ton équipe à gagner.'
	twitterShare:()=>
		twitter_url = 'https://twitter.com/share';
		msg = 'Viens te la shaker pour ton équipe préférée sur La Grande Branlette De Noël: '
		params = 
			url: window.location.href
			via:'akufen'
			text: msg
		i=0;
		for key of params
			++i;
			if i == 1
				twitter_url += '?'
			else
				twitter_url += '&'
			twitter_url+=encodeURIComponent(key)+'='+encodeURIComponent(params[key]);
		window.open twitter_url, 'tw-share', 'height=256, width=600'

	sortAgencies:(_agencies=null)=>
		if !_agencies?
			_agencies = App.agencies;
		sorted = [];
		for key of _agencies
			obj = 
				name:App.labels[key]
				key:key
				score:parseInt(_agencies[key].count)
				people:parseInt(_agencies[key].people)

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
	if /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
		App.gotoPage 'pageiphone-landing', null, 0
		App.isMobile = true;
	else
		App.gotoPage 'page-landing', 'landing-code', 0
		App.playSound();

	if window.DeviceMotionEvent?
		# Shake sensitivity (a lower number is more)
		sensitivity = 40;

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
			e.preventDefault();
			return false;
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