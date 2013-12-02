// Generated by CoffeeScript 1.6.3
(function() {
  var App,
    _this = this;

  App = {
    config: {
      endpoint: 'http://alexleclair.ca:8090/'
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
    sounds: [
      {
        mp3: 'http://dl.dropbox.com/u/1538714/article_resources/cat.m4a',
        ogg: 'http://dl.dropbox.com/u/1538714/article_resources/cat.ogg'
      }
    ],
    currentObject: null,
    init: function(callback) {
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
          return App.gotoPage('pageiphone-shake');
        } else {
          App.gotoPage('page-shake', 'shake-intro');
          App.changeObject(App.objects[Math.floor(Math.random() * (App.objects.length - 1))], true);
          return App.playSound();
        }
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
        }, 1000);
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
          return App.gotoPage('page-landing', 'landing-intro');
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
      return App.socket.on('code', function(code) {
        App.code = code;
        return App.refreshCodeScreen();
      });
    },
    displayMessage: function(msg, x, y, fadeTime) {
      var $bulle;
      if (fadeTime == null) {
        fadeTime = 200;
      }
      if (x == null) {
        x = Math.random() * ($(window).width() / 2) + $(window).width() / 4;
      }
      if (y == null) {
        y = Math.random() * ($(window).height() / 2) + $(window).height() / 4;
      }
      $bulle = $('.shake-bulle');
      return $bulle.fadeOut(fadeTime, function() {
        $bulle.find('h3').text(msg);
        return $bulle.css('top', x + 'px').css('left', y + 'px').fadeIn(fadeTime);
      });
    },
    playSound: function(sound) {
      if (sound == null) {
        sound = App.sounds[Math.floor(Math.random() * App.sounds.length)];
      }
      $('#audio').html('<source src="' + sound.mp3 + '" type="audio/mpeg" />' + '<source src="' + sound.ogg + '" type="audio/ogg" />');
      return $('#audio').get(0).play();
    },
    bindToCode: function(code) {
      return App.socket.emit('registerSibling', code);
    },
    pickAgency: function(agency) {
      return App.socket.emit('pick', agency);
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
        return App.socket.emit('object', obj);
      }
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
        _agencies.sort();
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
          if (App.siblingsCount <= 1) {
            App.playSound();
          }
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
      var $div;
      if (fadeTime == null) {
        fadeTime = 500;
      }
      if ((window.isOli != null) || (window.location + '').indexOf('static') > 0) {
        return;
      }
      $div = $('div.step.' + step);
      if (!$('div.step.current').is('.' + step)) {
        $('div.step').hide().removeClass('current');
      }
      if ((substep != null) && !$div.find('.substep.current').is('.' + substep)) {
        $div.find('.substep').not('.' + substep).fadeOut(fadeTime, function(e) {
          $div.find('.substep').removeClass('current');
          return $div.find('.substep.' + substep).fadeIn(fadeTime).addClass('current');
        });
      }
      return $div.addClass('current').fadeIn(fadeTime);
    },
    facebookShare: function() {
      var msg;
      msg = 'Viens shaker pour ton agence favorite et prend part à la Grande Branlette de Noël.';
      if (App.agency != null) {
        msg = 'J\'ai shaké ' + App.shakes + ' fois pour ' + App.labels[App.agency] + ' sur la Grande Branlette De Noël!';
      }
      return FB.ui({
        method: 'feed',
        name: 'La Grande Branlette de Noël',
        link: 'http://localhost/',
        picture: ' http://7cffd474.ngrok.com/img/logo_branlette.png',
        caption: msg,
        description: 'Viens participer à la Grande Branlette et aide ton agence à remporter la course!'
      });
    },
    twitterShare: function() {
      var i, key, msg, params, twitter_url;
      twitter_url = 'https://twitter.com/share';
      msg = 'Viens te la shaker pour ton agence préférée sur La Grande Branlette De Noël: ';
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
    App.init();
    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      App.gotoPage('pageiphone-landing', null, 0);
      App.isMobile = true;
    } else {
      App.gotoPage('page-landing', 'landing-intro', 0);
    }
    if (window.DeviceMotionEvent != null) {
      sensitivity = 20;
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
