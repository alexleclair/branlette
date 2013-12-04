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
			sendAgenciesTimer:2500;
			labels:
				acolyte:	'Acolyte Communication'
				adviso:		'Adviso'
				bloom:		'Bloom'
				fairplay:	'Fairplay'
				onf:		'ONF'
				akufen:		'Akufen'
				attraction:	'Attraction'
				braque:		'Agence Braque'
				alfred:		'Alfred info'
				amazone:	'Amazone communications gestion'
				amuse:		'Amuse/Lowe Roche'
				bcp:		'BCP'
				beauchemin:	'Beauchemin'
				bbr:		'Bleublancrouge'
				bulle:		'Production Bulle'
				bob:		'Bob'
				brad:		'Brad'
				cap:		'Cap Communication'
				carat:		'Carat'
				cart1er:	'CART1ER'
				cavalerie:	'La Cavalerie'
				gccom:		'CGCOM'
				cossette:	'Cossette'
				coutu:		'Coutu Communication'
				cri:		'CRI'
				cundari:	'Cundari'
				decodca:	'decod.ca'
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
				invisible:	'la compagnie invisible'
				jazz:		'Jazz Marketing Communications'
				jwt:		'JWT'
				kabane:		'Kabane'
				kbsp:		'kbs+p'
				lesaint:	'Le saint publicité et design'
				lemieux:	'Lemieux Bédard'
				dompteurs:	'Les Dompteurs de souris'
				evades:		'Les Évadés'
				lg2:		'lg2'
				lp8:		'LP8'
				lusio:		'Lusio films'
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
				rc:			'Radio-Canada'
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
				v:			'V'
				version10:	'version10'
				wasabi:		'Wasabi Communications'
				youville:	'Youville Communauté Créative'
				zip:		'ZiP communication'
				imedia:		'Imédia'
				picbois:	'Picbois Production'

		agencies:{}
		siblings:{}
		sockets:{}
		connCounter: 0;

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
				
				App.loadAgencies();

				setInterval @_saveScores, @config.updateRedisTimer
				setInterval @loadAgencies, @config.updateRedisTimer
				setInterval App.sendAgencies, @config.sendAgenciesTimer

				@io.on 'connection', (socket)->
					++App.connCounter;
					code = App.generateCode(App.connCounter);
					App.siblings[code] = []
					App.sockets[socket.id] = socket;
					socket.set 'code', code;
					App.attachSiblings(socket, code)

					socket.emit 'code', code
					socket.emit 'labels', App.config.labels
					socket.emit 'agencies', App.agencies;

					socket.on 'object', (obj)->
						App.sendToSiblings(socket, 'object', obj)

					socket.on 'pick', (agency)->
						socket.get 'agency', (err, currentAgency)->
							if !(err? || !currentAgency?) && App.agencies[currentAgency]?
								App.agencies[currentAgency].people--;
							if App.agencies[agency]?
								socket.set 'agency', agency
								App.agencies[agency].people++
							
							App.sendToSiblings(socket, 'pick', agency)

							App.sendAgencies(socket); #send to siblings

					socket.on 'shake', (agency=null)->
						if agency? && App.agencies[agency]?
							App.agencies[agency].count++;
						else
							socket.get 'agency', (err, currentAgency)->
								if !(err? || !currentAgency?) && App.agencies[currentAgency]?
									App.agencies[currentAgency].count++;
						App.sendAgencies(socket);
						App.sendToSiblings(socket, 'shake', agency)

					socket.on 'registerSibling', (inviteId)->
						console.log 'INVITED',inviteId;
						if !App.siblings? || !App.siblings[inviteId]?
							socket.emit 'wrongcode'
							return;
						socket.set 'code', inviteId #Same clients share same code/invite id
						App.attachSiblings(socket, inviteId) 
						App.sendToSiblings(socket, 'siblingsCount', App.siblings[inviteId].length);

					socket.on 'disconnect', ()->

						socket.get 'agency', (err, currentAgency)->
							if !(err? || !currentAgency?) && App.agencies[currentAgency]?
								App.agencies[currentAgency].people--;
								App.sendAgencies(socket);
						socket.get 'code', (err, code)->
							if code?

								index = App.siblings[code].indexOf(socket.id);
								if index >= 0
									App.siblings[code].splice index, 1;
								App.sendToSiblings(socket, 'siblingsCount', App.siblings[code].length);
								
								if App.siblings[code].length == 0
									delete App.siblings[code];
						delete App.sockets[socket.id]

		
		attachSiblings:(socket, code)->
			if App.siblings? && App.siblings[code] && App.siblings[code].indexOf(code) < 0
				App.siblings[code].push(socket.id);
		sendToSiblings: (socket)=>
			args = [];
			for i in[1...arguments.length]
				args.push arguments[i]
			socket.get 'code', (err, code)->
				if App.siblings[code]?
					for i in [0...App.siblings[code].length]
						try
							socketId = App.siblings[code][i];
							if App.sockets[socketId]?
								if args.length == 1 #ugly hack
									App.sockets[socketId].emit(args[0]);
								else if args.length >= 2
									App.sockets[socketId].emit(args[0], args[1]);
						catch err
							console.log '[error] ', err.message, err

		generateCode:(id)->
			allowedChars = 'abcdefghijklmnopqrstuvwxyz0123456789'.split("");			
			code = ''
			for i in[0...3]
				code += '' + allowedChars[Math.floor(Math.random()*allowedChars.length)];
			return code+''+(id+1000).toString(36)

		loadAgencies:()->
			App.redisWorker.smembers App.config.redisKey+'agencies', (err, reply)=>
				if typeof reply == 'string'
					reply = [reply]
				for i in[0...reply.length]
					try
						val = JSON.parse reply[i]
						if !App.config.labels[val.key]?
							App.config.labels[val.key] = val.label;
					catch e
						continue;
				_modified = 0;
				
				for key of App.config.labels
					#console.log 'Fetching data for ' + key
					_call = (_key)=>
						App.redisWorker.get App.config.redisKey + 'agency:'+_key, (err, reply)=>
							val = reply
							if !val?
								val = 0
							if !App.agencies[_key]?
								App.io.sockets.emit 'labels', App.config.labels;
								App.sendAgencies();
								App.agencies[_key] = 
									count:val
									people:0
					_call key;

		sendAgencies:(socket=null)->
			if socket?
				try
					App.sendToSiblings(socket, 'agencies', App.agencies);
				catch e
					
				return;
			
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
				when "agency"
					if method == 'add'
						if req.query? && req.query.name?
							App.redisWorker.sadd App.config.redisKey+'wishlist', req.query.name
						res.end JSON.stringify true;
					else if method == 'wishlist'
						App.redisWorker.smembers App.config.redisKey+'wishlist', (err, reply)=>
							res.end JSON.stringify reply;

					else if method == 'refuse'
						if req.query? && req.query.name?
							App.redisWorker.srem App.config.redisKey+'wishlist', req.query.name
						res.end JSON.stringify true;
					
					else if method == 'remove'
						if req.query? && req.query.key? && App.config.labels[req.query.key]?
							obj = 
								label:App.config.labels[req.query.key];
								key:req.query.key;
							App.redisWorker.srem App.config.redisKey+'agencies', JSON.stringify obj
							if App.config.labels[req.query.key]?
								delete App.config.labels[req.query.key];
							if App.agencies[req.query.key]?
								delete App.agencies[req.query.key];
						res.end JSON.stringify true;

					else if method == 'approve'
						if req.query? && req.query.name?

							key = req.query.name.toLowerCase().split('');
							allowedChars = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
							_key = ''
							for i in [0...key.length]
								if allowedChars.indexOf(key[i]) >= 0
									_key += key[i];
							key = _key;
							App.redisWorker.get App.config.redisKey + 'agency:'+key, (err, reply)=>
								if reply == null

									val = 
										label:req.query.name
										key: key
									App.redisWorker.srem App.config.redisKey+'wishlist', req.query.name
									App.redisWorker.sadd App.config.redisKey+'agencies', JSON.stringify(val), (err, reply)->
										App.loadAgencies();

							if req.query? && req.query.callback
								res.end req.query.callback + '('+JSON.stringify(key)+')';
							else
								res.end JSON.stringify key
							return;
						res.end JSON.stringify true;
					else
						res.writeHead '404'
						res.end 'Method ' + method + ' not found'
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