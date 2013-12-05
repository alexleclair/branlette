// Generated by CoffeeScript 1.6.3
(function() {
  var App,
    _this = this;

  App = {
    config: {
      endpoint: 'http://branlettedenoel.com/'
    },
    socket: null,
    labels: {},
    agencies: {},
    code: null,
    agency: null,
    shakes: 0,
    isMobile: false,
    shakeTimeout: null,
    lastShakeTimes: [],
    siblingsCount: 0,
    objects: ['marie', 'jesus', 'nutcracker', 'emballage', 'boite', 'canne', 'explosif', 'ange', 'roi', 'canne2', 'cierge', 'boule'],
    messages: ['Enweille, lâche pas la banane!', 'T\'y es presque, hein?', 'Allez, viens! On est bien!', 'Pas game d\'aller plus vite.', 'Arrête pas!', 'Tes parents seraient fiers de toi.', 'Spit on it!', 'T\'es à deux doigts de l\'avoir!', 'Donne-toi un bon coup de main', 'Essayes sans les mains', ''],
    messagesTimeout: {
      min: 3000,
      max: 9000,
      timerId: null
    },
    sounds: [
      {
        mp3: 'sounds/branlette_01.mp3',
        ogg: 'sounds/branlette_01.ogg'
      }, {
        mp3: 'sounds/branlette_02.mp3',
        ogg: 'sounds/branlette_02.ogg'
      }, {
        mp3: 'sounds/branlette_03.mp3',
        ogg: 'sounds/branlette_03.ogg'
      }, {
        mp3: 'sounds/branlette_04.mp3',
        ogg: 'sounds/branlette_04.ogg'
      }, {
        mp3: 'sounds/branlette_05.mp3',
        ogg: 'sounds/branlette_05.ogg'
      }, {
        mp3: 'sounds/branlette_06.mp3',
        ogg: 'sounds/branlette_06.ogg'
      }, {
        mp3: 'sounds/branlette_07.mp3',
        ogg: 'sounds/branlette_07.ogg'
      }, {
        mp3: 'sounds/branlette_08.mp3',
        ogg: 'sounds/branlette_08.ogg'
      }, {
        mp3: 'sounds/branlette_09.mp3',
        ogg: 'sounds/branlette_09.ogg'
      }, {
        mp3: 'sounds/branlette_10.mp3',
        ogg: 'sounds/branlette_10.ogg'
      }, {
        mp3: 'sounds/branlette_11.mp3',
        ogg: 'sounds/branlette_11.ogg'
      }, {
        mp3: 'sounds/branlette_12.mp3',
        ogg: 'sounds/branlette_12.ogg'
      }, {
        mp3: 'sounds/branlette_13.mp3',
        ogg: 'sounds/branlette_13.ogg'
      }, {
        mp3: 'sounds/branlette_14.mp3',
        ogg: 'sounds/branlette_14.ogg'
      }
    ],
    silenceSound: {
      mp3: 'sounds/silence.mp3',
      ogg: 'sounds/silence.ogg'
    },
    currentObject: null,
    playSounds: true,
    init: function(callback) {
      $('#audio').on('ended', function(e) {
        if (!App.isMobile) {
          return App.playSound();
        } else {
          return App.playSound(App.silenceSound);
        }
      });
      App.socket = io.connect(App.config.endpoint);
      App.socket.on('labels', function(data) {
        App.labels = data;
        return App.resetTexts();
      });
      App.socket.on('pick', function(data) {
        App.agency = data;
        App.shakes = 0;
        App.resetTexts();
        $('body').addClass('has-agency');
        if (App.isMobile) {
          App.gotoPage('pageiphone-shake');
          if (App.siblingsCount < 2) {
            App.changeObject(App.objects[Math.floor(Math.random() * (App.objects.length - 1))], true);
          }
        } else {
          App.gotoPage('page-shake', 'shake-intro');
          App.changeObject(App.objects[Math.floor(Math.random() * (App.objects.length - 1))], true);
        }
        return setTimeout(App.displayMessage, 5000);
      });
      App.socket.on('object', function(obj) {
        return App.changeObject(obj);
      });
      App.socket.on('disconnect', function() {
        return window.location = window.location;
      });
      App.socket.on('shake', function() {
        var i, total, velocity, _class, _i, _ref;
        App.lastShakeTimes.push(new Date().getTime());
        if (App.lastShakeTimes.length > 5) {
          App.lastShakeTimes.splice(0, 1);
        }
        total = 0;
        for (i = _i = 1, _ref = App.lastShakeTimes.length; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
          total += App.lastShakeTimes[i] - App.lastShakeTimes[i - 1];
        }
        velocity = 1000;
        if (App.lastShakeTimes.length > 1) {
          velocity = total / App.lastShakeTimes.length - 1;
        }
        _class = 'shakelent';
        if (velocity >= 350) {
          _class = 'shakelent';
        } else if (velocity >= 170) {
          _class = 'shakemedium';
        } else {
          _class = 'shake';
        }
        App.shakes++;
        App.lastShakeTime = new Date().getTime();
        $('div[data-info="shake-sessioncount"]').text(App.shakes);
        clearTimeout(App.shakeTimeout);
        if (!$('body').is('.' + _class)) {
          $('body').removeClass('shake').removeClass('shakemedium').removeClass('shakelent');
        }
        $('body').addClass(_class);
        App.shakeTimeout = setTimeout(function() {
          $('body').removeClass('shake').removeClass('shakemedium').removeClass('shakelent');
          $('.shake-bras').stop(true);
          if (!App.isMobile) {
            return App.gotoPage('page-shake', 'shake-repos', 500);
          }
        }, 2500);
        if (!App.isMobile) {
          return App.gotoPage('page-shake', 'shake-shake', 0);
        }
      });
      App.socket.on('agencies', function(data) {
        App.agencies = data;
        App.refreshLeaderboards();
        return App.resetTexts();
      });
      App.socket.on('wrongcode', function(data) {
        alert('Ce code n\'existe pas.');
        if (App.isMobile) {
          return App.gotoPage('pageiphone-landing');
        } else {
          return App.gotoPage('page-landing', 'landing-code');
        }
      });
      App.socket.on('siblingsCount', function(count) {
        var $current, isLanding;
        App.siblingsCount = count;
        $current = $('div.step.current');
        isLanding = $current.length > 0 && $current.is('.page-landing');
        if (count === 1 && App.isMobile) {
          window.location = window.location;
        }
        if (!App.isMobile && isLanding) {
          App.gotoPage('page-landing', 'landing-confirmation');
        }
        if (App.isMobile && $('div.step.current').is('.pageiphone-landing')) {
          return App.gotoPage('pageiphone-agence');
        }
      });
      App.socket.on('code', function(code) {
        App.code = code;
        return App.refreshCodeScreen();
      });
      return App.socket.on('connect', function() {
        return setTimeout(function() {
          if (App.isMobile) {
            return App.gotoPage('pageiphone-landing', null);
          } else {
            App.gotoPage('page-landing', 'landing-code');
            return App.playSound();
          }
        }, 1500);
      });
    },
    displayMessage: function(msg, x, y, fadeTime, timer) {
      var $bulle, $parent, index, _msgs;
      if (fadeTime == null) {
        fadeTime = 200;
      }
      if (timer == null) {
        timer = null;
      }
      $bulle = $('.shake-bulle');
      $parent = $bulle.parent();
      if (msg == null) {
        _msgs = App.messages.slice(0);
        index = _msgs.indexOf($bulle.find('h3').text());
        if (index >= 0) {
          _msgs.splice(index, 1);
        }
        msg = _msgs[Math.floor(Math.random() * _msgs.length)];
      }
      if (x == null) {
        x = Math.random() * ($parent.width() / 1);
      }
      if (y == null) {
        y = Math.random() * ($parent.height() / 1) - 200;
      }
      $bulle.fadeOut(fadeTime, function() {
        $bulle.find('h3').text(msg);
        return $bulle.css('top', y + 'px').css('left', x + 'px').fadeTo(fadeTime, 1);
      });
      if (timer == null) {
        timer = Math.random() * (App.messagesTimeout.max - App.messagesTimeout.min) + App.messagesTimeout.min;
      }
      if ((timer != null) && timer > 0) {
        return App.messagesTimeout.timerId = setTimeout(App.displayMessage, timer);
      }
    },
    playSound: function(sound) {
      var e, html;
      if (!App.playSounds) {
        return;
      }
      if (sound == null) {
        sound = App.sounds[Math.floor(Math.random() * App.sounds.length)];
      }
      $('#audio source').remove();
      html = '<source src="' + sound.mp3 + '" type="audio/mpeg" />';
      $('#audio-player #audio').append($(html));
      html = '<source src="' + sound.ogg + '" type="audio/ogg />';
      $('#audio-player #audio').append($(html));
      try {
        return $('#audio').get(0).play();
      } catch (_error) {
        e = _error;
      }
    },
    stopSound: function() {
      var e;
      try {
        $('#audio').get(0).pause();
      } catch (_error) {
        e = _error;
      }
      return App.playSounds = false;
    },
    replaySound: function() {
      App.playSounds = true;
      return App.playSound();
    },
    bindToCode: function(code) {
      return App.socket.emit('registerSibling', code);
    },
    pickAgency: function(agency) {
      App.socket.emit('pick', agency);
      return ga('send', 'pageview', '/virtual/pick/' + agency);
    },
    shake: function(agency) {
      if (agency == null) {
        agency = App.agency;
      }
      return App.socket.emit('shake', agency);
    },
    changeObject: function(obj, sendToServer) {
      var classes, i, _i, _ref;
      if (sendToServer == null) {
        sendToServer = false;
      }
      classes = ($('body').attr('class') + '').split(' ');
      for (i = _i = 0, _ref = classes.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (classes[i].substr(0, 7) === 'object-') {
          $('body').removeClass(classes[i]);
        }
      }
      $('body').addClass('object-' + obj);
      App.currentObject = obj;
      if (sendToServer) {
        App.socket.emit('object', obj);
      }
      return ga('send', 'pageview', '/virtual/background/' + obj);
    },
    resetTexts: function() {
      var agencies, agency, i, index, key, source, template, _agencies, _byName, _i, _j, _ref, _ref1;
      agency = App.agency;
      if ((App.labels != null) && (App.labels[agency] != null)) {
        $('.agencyName').text(App.labels[agency]);
      }
      if ((App.agencies != null) && (App.agencies[agency] != null)) {
        agencies = App.sortAgencies();
        index = -1;
        for (i = _i = 0, _ref = agencies.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          if (agencies[i].key === agency) {
            index = i + 1;
            break;
          }
        }
        $('.agencyIndex').text(index);
        $('.agenciesCount').text(agencies.length);
        $('.agencyShakes').text(App.agencies[agency].count);
        $('.agencyPeople').text(App.agencies[agency].people);
      }
      if (App.labels != null) {
        _agencies = [];
        _byName = {};
        for (key in App.labels) {
          _agencies.push(App.labels[key]);
          _byName[App.labels[key]] = key;
        }
        _agencies.sort(function(a, b) {
          var _a, _b;
          if ((a != null) && (b != null)) {
            _a = a.toLowerCase();
            _b = b.toLowerCase();
            if (_a < _b) {
              return -1;
            }
            if (_a > _b) {
              return 1;
            }
            return 0;
          }
          return 0;
        });
        for (i = _j = 0, _ref1 = _agencies.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
          _agencies[i] = {
            name: _agencies[i],
            key: _byName[_agencies[i]]
          };
        }
        source = $('#template-agencies-list').html();
        template = Handlebars.compile(source);
        $('#agency-picker').html(template({
          agencies: _agencies
        }));
        return $('#agency-picker li a').click(function(e) {
          e.preventDefault();
          App.pickAgency($(this).attr('data-key'));
          App.playSound(App.silenceSound);
          return false;
        });
      }
    },
    refreshCodeScreen: function() {
      $('div[data-info="code"]').text(App.code);
      return $('div.landing-code .biphone-contenu').show();
    },
    refreshLeaderboards: function() {
      var agencies, source, template;
      agencies = App.sortAgencies();
      source = $('#template-leaderboard').html();
      template = Handlebars.compile(source);
      $('#top5').html(template({
        limit: 5,
        agencies: agencies
      }));
      return $('#leaderboard').html(template({
        limit: agencies.length,
        agencies: agencies
      }));
    },
    gotoPage: function(step, substep, fadeTime) {
      var $div, page;
      if (fadeTime == null) {
        fadeTime = 500;
      }
      if ((window.isOli != null) || (window.location + '').indexOf('static') > 0) {
        return;
      }
      $div = $('div.step.' + step);
      if (!$('div.step.current').is('.' + step)) {
        $('div.step').finish().hide().removeClass('current');
      }
      if ((substep != null) && !$div.find('.substep.current').is('.' + substep)) {
        $div.find('.substep').not('.' + substep).finish().fadeOut(fadeTime, function(e) {
          $div.find('.substep').removeClass('current');
          return $div.find('.substep.' + substep).finish().fadeIn(fadeTime).addClass('current');
        });
      }
      $div.addClass('current').finish().fadeIn(fadeTime);
      page = '/virtual/' + step;
      if (substep != null) {
        page += '/' + substep;
      }
      if ((App.lastPage == null) || App.lastPage !== page) {
        ga('send', 'pageview', page);
      }
      return App.lastPage = page;
    },
    facebookShare: function() {
      var msg;
      msg = 'Viens shaker pour ton équipe favorite et prend part à la Grande Branlette de Noël.';
      if (App.agency != null) {
        msg = 'J\'ai shaké ' + App.shakes + ' fois pour ' + App.labels[App.agency] + ' sur la Grande Branlette de Noël!';
      }
      return FB.ui({
        method: 'feed',
        name: 'La Grande Branlette de Noël',
        link: 'http://localhost/',
        picture: ' http://7cffd474.ngrok.com/img/logo_branlette.png',
        caption: msg,
        description: 'En participant à la Grande Branlette, tu aides ton équipe à gagner.'
      });
    },
    twitterShare: function() {
      var i, key, msg, params, twitter_url;
      twitter_url = 'https://twitter.com/share';
      msg = 'Viens te la shaker pour ton équipe préférée sur La Grande Branlette de Noël: ';
      params = {
        url: window.location.href,
        via: 'akufen',
        text: msg
      };
      i = 0;
      for (key in params) {
        ++i;
        if (i === 1) {
          twitter_url += '?';
        } else {
          twitter_url += '&';
        }
        twitter_url += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      }
      return window.open(twitter_url, 'tw-share', 'height=256, width=600');
    },
    sortAgencies: function(_agencies) {
      var i, key, obj, sorted, _i, _j, _ref, _ref1;
      if (_agencies == null) {
        _agencies = null;
      }
      if (_agencies == null) {
        _agencies = App.agencies;
      }
      sorted = [];
      for (key in _agencies) {
        obj = {
          name: App.labels[key],
          key: key,
          score: parseInt(_agencies[key].count),
          people: parseInt(_agencies[key].people)
        };
        if (sorted.length === 0 || obj.score > sorted[sorted.length - 1].score) {
          sorted.push(obj);
          continue;
        }
        for (i = _i = 0, _ref = sorted.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          if (sorted[i].score >= obj.score) {
            sorted.splice(i, 0, obj);
            break;
          }
        }
      }
      sorted.reverse();
      for (i = _j = 0, _ref1 = sorted.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
        sorted[i].rank = i + 1;
      }
      return sorted;
    }
  };

  $(function() {
    var sensitivity, x1, x2, y1, y2, z1, z2;
    Handlebars.registerHelper('each_upto', function(ary, max, options) {
      var i, result, _i, _ref;
      if (!ary || ary.length === 0) {
        return options.inverse(this);
      }
      result = [];
      for (i = _i = 0, _ref = Math.min(ary.length, max); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        result.push(options.fn(ary[i]));
      }
      return result.join('');
    });
    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      App.isMobile = true;
    }
    App.init();
    if (App.isMobile && (window.DeviceMotionEvent != null)) {
      sensitivity = 30;
      x1 = 0;
      y1 = 0;
      z1 = 0;
      x2 = 0;
      y2 = 0;
      z2 = 0;
      window.addEventListener('devicemotion', function(e) {
        x1 = e.accelerationIncludingGravity.x;
        y1 = e.accelerationIncludingGravity.y;
        z1 = e.accelerationIncludingGravity.z;
        e.preventDefault();
        return false;
      }, false);
      return setInterval(function() {
        var change;
        change = Math.abs(x1 - x2 + y1 - y2 + z1 - z2);
        if (change > sensitivity) {
          App.shake();
        }
        x2 = x1;
        y2 = y1;
        return z2 = z1;
      }, 150);
    }
  });

  window.Branlette = App;

}).call(this);
