$().ready(function(){ 
  $(".example script").each(function(){
    $(this).after('<pre class="brush: js;gutter: false;">' + $(this).html() + '</pre>');
  });
  SyntaxHighlighter.all();
});