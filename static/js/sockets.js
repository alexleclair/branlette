// Generated by CoffeeScript 1.6.3
(function() {
  var App,
    _this = this;

  App = {
    config: {
      endpoint: 'http://127.0.0.1:8090/'
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
        return App.labels = data;
      });
      App.socket.on('pick', function(data) {
        App.agency = data;
        return App.shakes = 0;
      });
      App.socket.on('shake', function() {
        App.shakes++;
        $('div[data-info="shake-sessioncount"]').text(App.shakes);
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
      return App.socket.on('code', function(code) {
        App.code = code;
        return App.refreshCodeScreen();
      });
    },
    bindToCode: function(code) {
      return App.socket.emit('registerSibling', code);
    },
    shake: function(agency) {
      if (agency == null) {
        agency = App.agency;
      }
      return App.socket.emit('shake', agency);
    },
    refreshCodeScreen: function() {
      return console.log('TODO');
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
          score: _agencies[key].count,
          people: _agencies[key].people
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
    return App.init();
  });

  window.Branlette = App;

}).call(this);
