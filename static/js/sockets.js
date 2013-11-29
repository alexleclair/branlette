// Generated by CoffeeScript 1.6.3
(function(){var e,t=this;e={config:{endpoint:"http://10.0.10.159:8090/"},socket:null,labels:{},agencies:{},code:null,agency:null,shakes:0,shakeTimeout:null,init:function(t){e.socket=io.connect(e.config.endpoint);e.socket.on("labels",function(t){e.labels=t;return e.resetTexts()});e.socket.on("pick",function(t){e.agency=t;return e.shakes=0});e.socket.on("shake",function(){e.shakes++;$('div[data-info="shake-sessioncount"]').text(e.shakes);$(".shake-bras").effect("shake",{direction:"up",times:1});clearTimeout(e.shakeTimeout);$("body").addClass("shake");e.shakeTimeout=setTimeout(function(){return $("body").removeClass("shake")},500);return console.log("current shakes for "+e.agency+" is "+e.shakes)});e.socket.on("agencies",function(t){e.agencies=t;return e.refreshLeaderboards()});e.socket.on("siblingsCount",function(e){return console.log("Eille, y'a "+e+"personnes connectées man")});e.socket.on("code",function(t){e.code=t;return e.refreshCodeScreen()});return e.socket.on("pick",function(t){e.agency=t;return e.resetTexts()})},bindToCode:function(t){return e.socket.emit("registerSibling",t)},pickAgency:function(t){return e.socket.emit("pick",t)},shake:function(t){t==null&&(t=e.agency);return e.socket.emit("shake",t)},resetTexts:function(){var t,n,r,i,s,o;n=e.agency;e.labels!=null&&e.labels[n]!=null&&$(".agencyName").text(e.labels[n]);if(e.agencies!=null&&e.agencies[n]){t=e.sortAgencies();i=-1;for(r=s=0,o=t.length;0<=o?s<o:s>o;r=0<=o?++s:--s)if(t[r].key===n){i=r+1;break}$(".agencyIndex").text(i);return $(".agenciesCount").text(t.length)}},refreshCodeScreen:function(){return $('div[data-info="code"]').text(e.code)},refreshLeaderboards:function(){var t,n,r;t=e.sortAgencies();n=$("#template-leaderboard").html();r=Handlebars.compile(n);$("#top5").html(r({limit:5,agencies:t}));return $("#leaderboard").html(r({limit:t.length,agencies:t}))},sortAgencies:function(t){var n,r,i,s,o,u,a,f;t==null&&(t=null);t==null&&(t=e.agencies);s=[];for(r in t){i={name:e.labels[r],key:r,score:t[r].count,people:t[r].people};if(s.length===0||i.score>s[s.length-1].score){s.push(i);continue}for(n=o=0,a=s.length;0<=a?o<a:o>a;n=0<=a?++o:--o)if(s[n].score>=i.score){s.splice(n,0,i);break}}s.reverse();for(n=u=0,f=s.length;0<=f?u<f:u>f;n=0<=f?++u:--u)s[n].rank=n+1;return s}};$(function(){var t,n,r,i,s,o,u;Handlebars.registerHelper("each_upto",function(e,t,n){var r,i,s,o;if(!e||e.length===0)return n.inverse(this);i=[];for(r=s=0,o=Math.min(e.length,t);0<=o?s<o:s>o;r=0<=o?++s:--s)i.push(n.fn(e[r]));return i.join("")});e.init();if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){$("div.step").hide();$("div.page-landing-iphonecode").show()}if(window.DeviceMotionEvent!=null){t=20;n=0;i=0;o=0;r=0;s=0;u=0;window.addEventListener("devicemotion",function(e){n=e.accelerationIncludingGravity.x;i=e.accelerationIncludingGravity.y;o=e.accelerationIncludingGravity.z;e.preventDefault();return!1},!1);return setInterval(function(){var a;a=Math.abs(n-r+i-s+o-u);a>t&&e.shake();r=n;s=i;return u=o},150)}});window.Branlette=e}).call(this);