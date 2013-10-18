/*
$().ready(function(){
  $(".example script").each(function(){
    $(this).after('<pre class="brush: js;gutter: false;">' + $(this).html() + '</pre>');
  });
  SyntaxHighlighter.all();
});
*/// Fliparoo examples
$(".display li").fliparoo($(".queue li"));(function(e){function o(){s.content="width=device-width,minimum-scale="+i[0]+",maximum-scale="+i[1];e.removeEventListener(n,o,!0)}var t="addEventListener",n="gesturestart",r="querySelectorAll",i=[1,1],s=r in e?e[r]("meta[name=viewport]"):[];if((s=s[s.length-1])&&t in e){o();i=[.25,1.6];e[t](n,o,!0)}})(document);(function(e){var t=e.document;if(!location.hash&&e.addEventListener){e.scrollTo(0,1);var n=1,r=function(){return e.pageYOffset||t.compatMode==="CSS1Compat"&&t.documentElement.scrollTop||t.body.scrollTop||0},i=setInterval(function(){if(t.body){clearInterval(i);n=r();e.scrollTo(0,n===1?0:1)}},15);e.addEventListener("load",function(){setTimeout(function(){r()<20&&e.scrollTo(0,n===1?0:1)},0)},!1)}})(this);