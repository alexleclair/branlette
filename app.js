// Generated by CoffeeScript 1.6.3
(function() {
  var App, escapeshellarg,
    _this = this;

  escapeshellarg = function(arg) {
    var ret;
    ret = '';
    ret = arg.replace(/[^\\]'/g, function(m, i, s) {
      return m.slice(0, 1) + '\\\'';
    });
    return "'" + ret + "'";
  };

  App = {
    io: null,
    redis: require('redis'),
    redisWorker: null,
    fs: null,
    httpServer: null,
    express: null,
    config: {
      port: 8080,
      redisHost: 'localhost',
      redisPort: 6379,
      redisKey: 'noel:dev:',
      wwwPath: './static/',
      updateRedisTimer: 5000,
      labels: {
        acolyte: 'Acolyte Communication',
        braque: 'Agence Braque',
        alfred: 'Alfred info',
        amazone: 'Amazone communications gestion',
        amuse: 'Amuse/Lowe Roche',
        bcp: 'BCP',
        beauchemin: 'Beauchemin',
        bbr: 'Bleublancrouge',
        bob: 'Bob',
        brad: 'Brad',
        cap: 'Cap Communication',
        carat: 'Carat',
        cart1er: 'CART1ER',
        gccom: 'CGCOM',
        cossette: 'Cossette',
        coutu: 'Coutu Communication',
        cri: 'CRI',
        cundari: 'Cundari',
        defi: 'Défi marketing',
        dentsubos: 'DentsuBos',
        desarts: 'DesArts Communication',
        draft: 'Draftfcb',
        ecorce: 'Écorce',
        egzakt: 'Egzakt',
        em: 'EM L\'agence',
        espacem: 'Espace M',
        gendron: 'Gendron Communication',
        generation: 'Génération',
        gvm: 'Groupe GVM',
        aod: 'Group Média AOD',
        hop: 'HOP comportement de marque',
        jazz: 'Jazz Marketing Communications',
        jwt: 'JWT',
        kabane: 'Kabane',
        kbsp: 'kbs+p',
        lesaint: 'Le saint publicité et design',
        lemieux: 'Lemieux Bédard',
        dompteurs: 'Les Dompteurs de souris',
        evades: 'Les Évadés',
        lg2: 'lg2',
        marketel: 'Marketel',
        martel: 'Martel et compagnie',
        mediaexperts: 'Media Experts',
        mediavation: 'Mediavation',
        merlicom: 'Merlicom',
        minimal: 'Minimal Médias',
        morrow: 'Morrow',
        nolin: 'Nolin BBDO',
        nurun: 'Nurun',
        ogilvy: 'Ogilvy Montréal',
        orangetango: 'orangetango',
        otis: 'Otis Léger Marketing',
        oui: 'Oui Marketing',
        palm: 'PALM + HAVAS',
        pheromone: 'Phéromone',
        publicis: 'Publicis',
        republik: 'Republik',
        reservoir: 'Réservoir Publicité Conseil',
        ressac: 'Ressac',
        revolver3: 'revolver3',
        svyr: 'Saint-Jacques Vallée Y&R',
        sidlee: 'Sid Lee',
        tamtam: 'TAM-TAM\\TBWA',
        tank: 'TANK',
        taxi: 'TAXI',
        tequila: 'Tequila communication et marketing',
        terrain: 'Terrain marketing',
        tonik: 'Tonik Groupimage',
        touche: 'Touché! PHD',
        tp1: 'TP1',
        trinergie: 'Trinergie',
        uber: 'Über',
        upperkut: 'Upperkut',
        wasabi: 'Wasabi Communications',
        youville: 'Youville Communauté Créative',
        zip: 'ZiP communication',
        imedia: 'Imédia'
      }
    },
    agencies: {},
    siblings: {},
    sockets: {},
    connCounter: 0,
    init: function(config) {
      var express, key, _call,
        _this = this;
      if (config != null) {
        this.config = this._mergeOptions(this.config(config));
      }
      if (process.argv.length > 2) {
        this.config.port = process.argv[2];
      }
      this.fs = require('fs');
      express = require('express');
      this.express = express.call(this);
      this.httpServer = require('http').createServer(this.express);
      this.httpServer.listen(this.config.port);
      this.io = require('socket.io').listen(this.httpServer);
      this.io.set('log level', 1);
      this.express.get('/api/*', this._handleAPICalls);
      this.express.post('/api/*', this._handleAPICalls);
      this.express.get('/*', this._handleHttpRequest);
      this.express.use(express.bodyParser());
      this.express.use(function(err, req, res, next) {
        console.error(err.stack);
        return res.send(500, 'Oops ! Something went super wrong.');
      });
      this.redisWorker = this.redis.createClient(App.config.redisPort, App.config.redisHost);
      for (key in App.config.labels) {
        console.log('Fetching data for ' + key);
        _call = function(_key) {
          return _this.redisWorker.get(App.config.redisKey + 'agency:' + _key, function(err, reply) {
            var val;
            val = reply;
            if (val == null) {
              val = 0;
            }
            return App.agencies[_key] = {
              count: val,
              people: 0
            };
          });
        };
        _call(key);
      }
      setInterval(this._saveScores, this.config.updateRedisTimer);
      return this.io.on('connection', function(socket) {
        var code;
        ++App.connCounter;
        code = App.generateCode(App.connCounter);
        console.log('Code is' + code);
        App.siblings[code] = [];
        App.sockets[socket.id] = socket;
        socket.set('code', code);
        App.attachSiblings(socket, code);
        socket.emit('code', code);
        socket.emit('labels', App.config.labels);
        socket.emit('agencies', App.agencies);
        socket.on('pick', function(agency) {
          return socket.get('agency', function(err, currentAgency) {
            if (!((err != null) || (currentAgency == null)) && (App.agencies[currentAgency] != null)) {
              App.agencies[currentAgency].people--;
            }
            if (App.agencies[agency] != null) {
              socket.set('agency', agency);
              console.log('setting +1 on agency ' + agency, App.agencies[agency]);
              App.agencies[agency].people++;
              console.log('set +1 on agency ' + agency, App.agencies[agency]);
            }
            App.sendToSiblings(socket, 'pick', agency);
            return App.sendAgencies();
          });
        });
        socket.on('shake', function(agency) {
          if (agency == null) {
            agency = null;
          }
          if ((agency != null) && (App.agencies[agency] != null)) {
            App.agencies[agency].count++;
            App.sendAgencies();
          } else {
            socket.get('agency', function(err, currentAgency) {
              if (!((err != null) || (currentAgency == null)) && (App.agencies[currentAgency] != null)) {
                App.agencies[currentAgency].count++;
                return App.sendAgencies();
              }
            });
          }
          return App.sendToSiblings(socket, 'shake', agency);
        });
        socket.on('registerSibling', function(inviteId) {
          console.log('INVITED', inviteId);
          socket.set('code', inviteId);
          App.attachSiblings(socket, inviteId);
          return App.sendToSiblings(socket, 'siblingsCount', App.siblings[inviteId].length);
        });
        return socket.on('disconnect', function() {
          socket.get('agency', function(err, currentAgency) {
            if (!((err != null) || (currentAgency == null)) && (App.agencies[currentAgency] != null)) {
              App.agencies[currentAgency].people--;
              return App.sendAgencies();
            }
          });
          socket.get('code', function(err, code) {
            if (code != null) {
              return delete App.siblings[code];
            }
          });
          return delete App.sockets[socket.id];
        });
      });
    },
    attachSiblings: function(socket, code) {
      if ((App.siblings != null) && App.siblings[code]) {
        return App.siblings[code].push(socket.id);
      }
    },
    sendToSiblings: function(socket) {
      var args, i, _i, _ref;
      args = [];
      for (i = _i = 1, _ref = arguments.length; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
        args.push(arguments[i]);
      }
      return socket.get('code', function(err, code) {
        var socketId, _j, _ref1, _results;
        if (App.siblings[code] != null) {
          _results = [];
          for (i = _j = 0, _ref1 = App.siblings[code].length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
            try {
              socketId = App.siblings[code][i];
              if (App.sockets[socketId] != null) {
                console.log('Sent to ' + socketId);
                if (args.length === 1) {
                  _results.push(App.sockets[socketId].emit(args[0]));
                } else if (args.length >= 2) {
                  _results.push(App.sockets[socketId].emit(args[0], args[1]));
                } else {
                  _results.push(void 0);
                }
              } else {
                _results.push(void 0);
              }
            } catch (_error) {
              err = _error;
              _results.push(console.log('[error] ', err.message, err));
            }
          }
          return _results;
        }
      });
    },
    generateCode: function(id) {
      return (id + 1000).toString(36);
    },
    sendAgencies: function() {
      return App.io.sockets.emit('agencies', App.agencies);
    },
    _handleAPICalls: function(req, res) {
      var method, module, parts;
      parts = req.url.split('?')[0].split('/');
      if (parts.length < 4) {
        res.writeHead('500');
        res.end('API calls expect at least a module/parameter combo.');
        return;
      }
      module = parts[2];
      method = parts[3];
      switch (module) {
        case "stats":
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(App.agencies));
          return false;
        default:
          res.writeHead('404');
          return res.end('Module ' + module + ' not found');
      }
    },
    _saveScores: function() {
      var key, _results;
      _results = [];
      for (key in App.agencies) {
        _results.push(App.redisWorker.set(App.config.redisKey + 'agency:' + key, App.agencies[key].count, function(err, reply) {}));
      }
      return _results;
    },
    _saveEvent: function(data, callback) {
      return App.redisWorker.zadd(['clowntriste:events', new Date().getTime(), JSON.stringify(data)], function(err, reply) {
        return callback(reply);
      });
    },
    _handleHttpRequest: function(req, res) {
      var file, path;
      file = req.url.split('?')[0];
      file = file === '/' ? 'index.html' : file;
      file = file.split('..').join('');
      path = __dirname + '/' + App.config.wwwPath + file;
      return App.fs.readFile(path, function(err, data) {
        if (err) {
          res.writeHead('500');
          return res.end('Error loading ' + file);
        }
        res.writeHead('200');
        return res.end(data);
      });
    }
  };

  App.init();

}).call(this);
