$(document).ready(function(){var e=[],t=[38,38,40,40,37,39,37,39,66,65];$(window).on("keyup",function(n){e.push(n.which);e.length>t.length&&e.splice(0,1);if(e.length!=t.length)return;var r=!0;for(var i=0;i<e.length;++i)if(e[i]!=t[i]){r=!1;break}r&&(window.location="http://www.google.ca/")});$(window).on("keydown",function(e){var t=$("#code-form input.code");if(t.is(":focus")){e.preventDefault();var n="abcdefghijklmnopqrstuvwxyz0123456789".split(""),r=String.fromCharCode(e.which).toLowerCase();n.indexOf(r)>=0?t.val(t.val()+r):e.which==8?t.val(t.val().substr(0,t.val().length-1)):e.which==13&&$("#code-form").submit();return!1}});$("#logo a, a.back-to-business").click(function(e){if(!Branlette.isMobile){e.preventDefault();Branlette.agency==null?Branlette.gotoPage("page-landing","landing-code",0):Branlette.siblingsCount>1?Branlette.gotoPage("page-shake"):Branlette.gotoPage("page-landing","landing-code");return!1}e.preventDefault();Branlette.agency==null?Branlette.gotoPage("pageiphone-agence"):Branlette.gotoPage("pageiphone-shake")});$("form.add-agency-form").submit(function(e){e.preventDefault();var t=$(this).find(".add-agency"),n=$.trim(t.val());if(n.length==0)return!1;var r=Branlette.config.endpoint+"api/agency/approve?name="+encodeURIComponent(n)+"&callback=?";$.getJSON(r,function(e){r=e;Branlette.siblingsCount>=2&&(r+="/"+Branlette.siblingCode);window.location="?"+(new Date).getTime()+"#!/"+r});return!1});$("form#code-form").submit(function(e){e.preventDefault();$(this).attr("readonly","readonly");Branlette.bindToCode($.trim($("input.code").val()).toLowerCase());$(this).blur();$("form#code-form input.code").blur();$("#logo").focus();return!1});$(".start").click(function(){Branlette.gotoPage("page-landing","landing-code")});$(".btn-leaderboard").click(function(e){e.preventDefault();Branlette.gotoPage("page-classement")});$(".btn-change-object").click(function(e){e.preventDefault();objects=Branlette.objects.slice(0);index=objects.indexOf(Branlette.currentObject);index>=0&&objects.splice(index,1);obj=objects[Math.floor(Math.random()*(objects.length-1))];Branlette.changeObject(obj,!0);return!1});$(".btn-no-code").click(function(e){e.preventDefault();Branlette.gotoPage("pageiphone-agence");return!1});$(".stepmaster").click(function(){var e=$(this).parent(".step"),t=e.next(".step");t.length===0&&(t=e.prevAll(".step").last());e.fadeOut();t.fadeIn()});$(".pageiphone-agence ul li").click(function(){$(".pageiphone-agence").addClass("one-selected");$(".pageiphone-agence ul li").removeClass("active").removeClass("prev-active");$(this).addClass("active");$(this).prev("li").addClass("prev-active")});$("ul li.active").click(function(){$(".pageiphone-agence").removeClass("one-selected");$(".pageiphone-agence ul li").removeClass("active").removeClass("prev-active")});$(".btn-shake").click(function(){$(".shake-bras").effect("shake",{direction:"up",times:1})});$(".shake-bulle").each(function(){var e=Math.floor(Math.random()*900-100),t=Math.floor(Math.random()*200-100);$(this).css({top:t,left:e})});$(".icon-facebook").click(function(e){e.preventDefault();Branlette.facebookShare();return!1});$(".icon-twitter").click(function(e){e.preventDefault();Branlette.twitterShare();return!1});$(".stopSound").click(function(){if(Branlette.playSounds){Branlette.stopSound();$(this).removeClass("playing").addClass("stopped")}else{Branlette.replaySound();$(this).removeClass("stopped").addClass("playing")}return!1})});window.iOSversion=function(){if(/iP(hone|od|ad)/.test(navigator.platform)){var e=navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);return[parseInt(e[1],10),parseInt(e[2],10),parseInt(e[3]||0,10)]}};