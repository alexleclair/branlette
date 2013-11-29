// Generated by CoffeeScript 1.6.3
(function() {
  var App,
    _this = this;

  App = {
    config: {
      endpoint: 'http://10.0.10.159:8090/'
    },
    socket: null,
    labels: {},
    agencies: {},
    code: null,
    agency: null,
    shakes: 0,
    shakeTimeout: null,
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
        return $('body').addClass('has-agency');
      });
      App.socket.on('shake', function() {
        App.shakes++;
        $('div[data-info="shake-sessioncount"]').text(App.shakes);
        $('.shake-bras').effect('shake', {
          direction: 'up',
          times: 1
        });
        clearTimeout(App.shakeTimeout);
        $('body').addClass('shake');
        App.shakeTimeout = setTimeout(function() {
          return $('body').removeClass('shake');
        }, 500);
        return console.log('current shakes for ' + App.agency + ' is ' + App.shakes);
      });
      App.socket.on('agencies', function(data) {
        App.agencies = data;
        return App.refreshLeaderboards();
      });
      App.socket.on('siblingsCount', function(count) {
        return console.log('Eille, y\'a ' + count + 'personnes connectées man');
      });
      return App.socket.on('code', function(code) {
        App.code = code;
        return App.refreshCodeScreen();
      });
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
    resetTexts: function() {
      var agencies, agency, i, index, _i, _ref;
      agency = App.agency;
      if ((App.labels != null) && (App.labels[agency] != null)) {
        $('.agencyName').text(App.labels[agency]);
      }
      if ((App.agencies != null) && App.agencies[agency]) {
        agencies = App.sortAgencies();
        index = -1;
        for (i = _i = 0, _ref = agencies.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          if (agencies[i].key === agency) {
            index = i + 1;
            break;
          }
        }
        $('.agencyIndex').text(index);
        return $('.agenciesCount').text(agencies.length);
      }
    },
    refreshCodeScreen: function() {
      return $('div[data-info="code"]').text(App.code);
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
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      $('div.step').hide();
      $('div.page-landing-iphonecode').show();
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
