escapeshellarg = (arg)-> 
  # // http://kevin.vanzonneveld.net
  # // +   original by: Felix Geisendoerfer (http://www.debuggable.com/felix)
  # // +   improved by: Brett Zamir (http://brett-zamir.me)
  # // *     example 1: escapeshellarg("kevin's birthday");
  # // *     returns 1: "'kevin\'s birthday'"
  ret = '';

  ret = arg.replace(/[^\\]'/g, (m, i, s)->
    return m.slice(0, 1) + '\\\'';
  );

  return "'" + ret + "'";


App = 
		io: null
		redis:require('redis')
		redisWorker: null
		fs:null
		httpServer:null
		express:null
		config:
			port:8080
			redisHost:'localhost'
			redisPort:6379
			redisKey:'noel:dev:'
			wwwPath:'./static/'
			updateRedisTimer:5000
			labels:
				acolyte:	'Acolyte Communication'
				braque:		'Agence Braque'
				alfred:		'Alfred info'
				amazone:	'Amazone communications gestion'
				amuse:		'Amuse/Lowe Roche'
				bcp:		'BCP'
				beauchemin:	'Beauchemin'
				bbr:		'Bleublancrouge'
				bob:		'Bob'
				brad:		'Brad'
				cap:		'Cap Communication'
				carat:		'Carat'
				cart1er:	'CART1ER'
				gccom:		'CGCOM'
				cossette:	'Cossette'
				coutu:		'Coutu Communication'
				cri:		'CRI'
				cundari:	'Cundari'
				defi:		'Défi marketing'
				dentsubos:	'DentsuBos'
				desarts:	'DesArts Communication'
				draft:		'Draftfcb'
				ecorce:		'Écorce'
				egzakt:		'Egzakt'
				em:			'EM L\'agence'
				espacem:	'Espace M'
				gendron:	'Gendron Communication'
				generation:	'Génération'
				gvm:		'Groupe GVM'
				aod:		'Group Média AOD'
				hop:		'HOP comportement de marque'
				jazz:		'Jazz Marketing Communications'
				jwt:		'JWT'
				kabane:		'Kabane'
				kbsp:		'kbs+p'
				lesaint:	'Le saint publicité et design'
				lemieux:	'Lemieux Bédard'
				dompteurs:	'Les Dompteurs de souris'
				evades:		'Les Évadés'
				lg2:		'lg2'
				marketel:	'Marketel'
				martel:		'Martel et compagnie'
				mediaexperts:'Media Experts'
				mediavation:'Mediavation'
				merlicom:	'Merlicom'
				minimal:	'Minimal Médias'
				morrow:		'Morrow'
				nolin:		'Nolin BBDO'
				nurun:		'Nurun'
				ogilvy:		'Ogilvy Montréal'
				orangetango:'orangetango'
				otis:		'Otis Léger Marketing'
				oui:		'Oui Marketing'
				palm:		'PALM + HAVAS'
				pheromone:	'Phéromone'
				publicis:	'Publicis'
				republik:	'Republik'
				reservoir:	'Réservoir Publicité Conseil'
				ressac:		'Ressac'
				revolver3:	'revolver3'
				svyr:		'Saint-Jacques Vallée Y&R'
				sidlee:		'Sid Lee'
				tamtam:		'TAM-TAM\\TBWA'
				tank:		'TANK'
				taxi:		'TAXI'
				tequila:	'Tequila communication et marketing'
				terrain:	'Terrain marketing'
				tonik:		'Tonik Groupimage'
				touche:		'Touché! PHD'
				tp1:		'TP1'
				trinergie:	'Trinergie'
				uber:		'Über'
				upperkut:	'Upperkut'
				wasabi:		'Wasabi Communications'
				youville:	'Youville Communauté Créative'
				zip:		'ZiP communication'
				imedia:		'Imédia'

		agencies:{}
		siblings:{}

		init: (config)->

				# Load libs only on init
				if config?
						@config = @_mergeOptions @config config

				if process.argv.length > 2
					@config.port = process.argv[2];

				@fs = require('fs');
				express = require('express')
				@express = express.call(this);
				@httpServer = require('http').createServer(@express);
				@httpServer.listen(@config.port)
				@io = require('socket.io').listen(@httpServer);
				@io.set('log level', 1);

				@express.get '/api/*', @_handleAPICalls
				@express.post '/api/*', @_handleAPICalls
				@express.get '/*', @_handleHttpRequest

				@express.use express.bodyParser()
				@express.use (err, req, res, next)->
				  console.error(err.stack);
				  res.send(500, 'Oops ! Something went super wrong.');

				@redisWorker = @redis.createClient(App.config.redisPort, App.config.redisHost)
				
				for key of App.config.labels
					console.log 'Fetching data for ' + key
					_call = (_key)=>
						@redisWorker.get App.config.redisKey + 'agency:'+_key, (err, reply)=>
							val = reply
							if !val?
								val = 0
							App.agencies[_key] = 
								count:val
								people:0
					_call key;
				setInterval @_saveScores, @config.updateRedisTimer

				@io.on 'connection', (socket)->
					socket.emit 'labels', App.config.labels
					socket.emit 'agencies', App.agencies;

					socket.on 'pick', (agency)->
						socket.get 'agency', (err, currentAgency)->
							if !(err? || !currentAgency?) && App.agencies[currentAgency]?
								App.agencies[currentAgency].people--;
							if App.agencies[agency]?
								socket.set 'agency', agency
								console.log 'setting +1 on agency '+agency, App.agencies[agency]
								App.agencies[agency].people++
								console.log 'set +1 on agency '+agency, App.agencies[agency]
							
							App.sendToSiblings(socket, 'pick', agency)

							App.sendAgencies();

					socket.on 'shake', (agency=null)->
						console.log 'Shake'
						if agency? && App.agencies[agency]?
							App.agencies[agency].count++;
							App.sendAgencies();
						else
							socket.get 'agency', (err, currentAgency)->
								if !(err? || !currentAgency?) && App.agencies[currentAgency]?
									App.agencies[currentAgency].count++;
									App.sendAgencies();
						App.sendToSiblings(socket, 'shake', agency)

					socket.on 'registerSibling', (inviteId)->
						App.attachSiblings(socket, inviteId)

					socket.on 'disconnect', ()->
						socket.get 'agency', (err, currentAgency)->
							if !(err? || !currentAgency?) && App.agencies[currentAgency]?
								App.agencies[currentAgency].people--;
								App.sendAgencies();

		
		attachSiblings:(socket, inviteId)->

		sendAgencies:()->
			App.io.sockets.emit 'agencies', App.agencies

		_handleAPICalls: (req, res) ->
			parts = req.url.split('?')[0].split('/'); #Very primitive module/method parsing at the moment. This is a small project, this works for now.
			if parts.length < 4
				res.writeHead '500'
				res.end 'API calls expect at least a module/parameter combo.'
				return;
			module = parts[2];
			method = parts[3];
			
			switch module
				when "stats" 
					res.setHeader 'Content-Type', 'application/json'	
					res.send JSON.stringify App.agencies;
					return false;
				else
					res.writeHead '404'
					res.end 'Module ' + module + ' not found'

		_saveScores: ()=>
			for key of App.agencies
				App.redisWorker.set App.config.redisKey+'agency:'+key, App.agencies[key].count, (err, reply)=>
		_saveEvent: (data, callback)=>
			App.redisWorker.zadd ['clowntriste:events', new Date().getTime(), JSON.stringify data], (err, reply)=>
				callback(reply);

		_handleHttpRequest: (req, res) ->

				file = req.url.split('?')[0];
				file = if file == '/' then 'index.html' else file;
				file = file.split('..').join(''); #Quick & Dirty, no ../ allowed.

				path = __dirname + '/' + App.config.wwwPath + file;

				App.fs.readFile path, (err, data)->
						if(err)
								res.writeHead '500'
								return res.end('Error loading '+file)
						res.writeHead '200'
						res.end data;



App.init();