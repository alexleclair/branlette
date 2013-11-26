App = 
	config:
		endpoint:'http://127.0.0.1:8090/'
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
		console.log 'TODO'
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

window.Branlette = App;