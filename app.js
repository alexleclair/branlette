// Generated by CoffeeScript 1.6.3
(function(){var e,t,n=this;t=function(e){var t;t="";t=e.replace(/[^\\]'/g,function(e,t,n){return e.slice(0,1)+"\\'"});return"'"+t+"'"};e={io:null,redis:require("redis"),redisWorker:null,fs:null,httpServer:null,express:null,config:{port:8080,redisHost:"localhost",redisPort:6379,redisKey:"noel:dev:",wwwPath:"./static/",updateRedisTimer:5e3,labels:{cossette:"Cossette",akufen:"Akufen",commun:"Commun",bbr:"BleuBlancRouge",ecorce:"Écorce",tp1:"TP1",sidlee:"Sid Lee",cri:"CRI"}},agencies:{},events:[],init:function(t){var n,r,i,s=this;t!=null&&(this.config=this._mergeOptions(this.config(t)));process.argv.length>2&&(this.config.port=process.argv[2]);this.fs=require("fs");n=require("express");this.express=n.call(this);this.httpServer=require("http").createServer(this.express);this.httpServer.listen(this.config.port);this.io=require("socket.io").listen(this.httpServer);this.io.set("log level",1);this.express.get("/api/*",this._handleAPICalls);this.express.post("/api/*",this._handleAPICalls);this.express.get("/*",this._handleHttpRequest);this.express.use(n.bodyParser());this.express.use(function(e,t,n,r){console.error(e.stack);return n.send(500,"Oops ! Something went super wrong.")});this.redisWorker=this.redis.createClient(e.config.redisPort,e.config.redisHost);for(r in e.config.labels){console.log("Fetching data for "+r);i=function(t){return s.redisWorker.get(e.config.redisKey+"agency:"+t,function(n,r){var i;i=r;i==null&&(i=0);return e.agencies[t]={count:i,people:0}})};i(r)}setInterval(this._saveScores,this.config.updateRedisTimer);return this.io.on("connection",function(t){t.emit("labels",e.config.labels);t.emit("agencies",e.agencies);t.on("pick",function(n){return t.get("agency",function(r,i){r==null&&i!=null&&e.agencies[i]!=null&&e.agencies[i].people--;if(e.agencies[n]!=null){t.set("agency",n);console.log("setting +1 on agency "+n,e.agencies[n]);e.agencies[n].people++;console.log("set +1 on agency "+n,e.agencies[n])}return e.sendAgencies()})});t.on("shake",function(n){n==null&&(n=null);console.log("Shake");if(n!=null&&e.agencies[n]!=null){e.agencies[n].count++;return e.sendAgencies()}return t.get("agency",function(t,n){if(t==null&&n!=null&&e.agencies[n]!=null){e.agencies[n].count++;return e.sendAgencies()}})});return t.on("disconnect",function(){return t.get("agency",function(t,n){if(t==null&&n!=null&&e.agencies[n]!=null){e.agencies[n].people--;return e.sendAgencies()}})})})},sendAgencies:function(){return e.io.sockets.emit("agencies",e.agencies)},_handleAPICalls:function(t,n){var r,i,s;s=t.url.split("?")[0].split("/");if(s.length<4){n.writeHead("500");n.end("API calls expect at least a module/parameter combo.");return}i=s[2];r=s[3];switch(i){case"stats":n.setHeader("Content-Type","application/json");n.send(JSON.stringify(e.agencies));return!1;default:n.writeHead("404");return n.end("Module "+i+" not found")}},_saveScores:function(){var t,n;n=[];for(t in e.agencies)n.push(e.redisWorker.set(e.config.redisKey+"agency:"+t,e.agencies[t].count,function(e,t){}));return n},_saveEvent:function(t,n){return e.redisWorker.zadd(["clowntriste:events",(new Date).getTime(),JSON.stringify(t)],function(e,t){return n(t)})},_handleHttpRequest:function(t,n){var r,i;r=t.url.split("?")[0];r=r==="/"?"index.html":r;r=r.split("..").join("");i=__dirname+"/"+e.config.wwwPath+r;return e.fs.readFile(i,function(e,t){if(e){n.writeHead("500");return n.end("Error loading "+r)}n.writeHead("200");return n.end(t)})}};e.init()}).call(this);