/*
$().ready(function(){
  $(".example script").each(function(){
    $(this).after('<pre class="brush: js;gutter: false;">' + $(this).html() + '</pre>');
  });
  SyntaxHighlighter.all();
});
*/// Fliparoo examples
$(".display li").fliparoo($(".queue li"));(function(e){function o(){s.content="width=device-width,minimum-scale="+i[0]+",maximum-scale="+i[1];e.removeEventListener(n,o,!0)}var t="addEventListener",n="gesturestart",r="querySelectorAll",i=[1,1],s=r in e?e[r]("meta[name=viewport]"):[];if((s=s[s.length-1])&&t in e){o();i=[.25,1.6];e[t](n,o,!0)}})(document);$(function(){$(".tablink").click(function(e){$(".tablink").removeClass("active");$(this).addClass("active");$(".tabs").removeClass("active");$(this).hasClass("tab1")?$("#tab1").addClass("active"):$(this).hasClass("tab2")?$("#tab2").addClass("active"):$(this).hasClass("tab3")&&$("#tab3").addClass("active");e.preventDefault()});$(".nice-menu-down > li > a + ul").after('<span class="js-toggle-dropdown"><span class="icon icon-plus-sign"></span></span>');$(".js-toggle-dropdown").click(function(e){e.preventDefault();$(this).parent().toggleClass("nav-dropdown-expanded");$(this).find("span").toggleClass("icon-plus-sign icon-remove-sign")});Modernizr.mq("only all and (min-width: 900px)")?$("body").addClass("mq-desktop"):Modernizr.mq("only all and (min-width: 700px)")?$("body").addClass("mq-lg_tab"):Modernizr.mq("only all and (min-width: 400px)")?$("body").addClass("mq-phone_wide-sm_tab"):$("body").addClass("mq-phone");$("#nav-toggle").click(function(e){e.preventDefault();$(".main-menu").toggleClass("open");$("body").toggleClass("nav-open");$(this).find("span").toggleClass("icon-reorder icon-remove-sign")})});(function(e){var t=e.document;if(!location.hash&&e.addEventListener){e.scrollTo(0,1);var n=1,r=function(){return e.pageYOffset||t.compatMode==="CSS1Compat"&&t.documentElement.scrollTop||t.body.scrollTop||0},i=setInterval(function(){if(t.body){clearInterval(i);n=r();e.scrollTo(0,n===1?0:1)}},15);e.addEventListener("load",function(){setTimeout(function(){r()<20&&e.scrollTo(0,n===1?0:1)},0)},!1)}})(this);