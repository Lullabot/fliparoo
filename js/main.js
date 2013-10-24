
/*
$().ready(function(){
  $(".example script").each(function(){
    $(this).after('<pre class="brush: js;gutter: false;">' + $(this).html() + '</pre>');
  });
  SyntaxHighlighter.all();
});
*/
// Fliparoo examples
$('.display li').fliparoo($('.queue li')); // plain vanilla


// Rewritten version for correcting a screen-zoom issue on rotation in iOS
// By @mathias, @cheeaun and @jdalton

(function(doc) {

	var addEvent = 'addEventListener',
		type = 'gesturestart',
		qsa = 'querySelectorAll',
		scales = [1, 1],
		meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];

	function fix() {
		meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
		doc.removeEventListener(type, fix, true);
	}

	if ((meta = meta[meta.length - 1]) && addEvent in doc) {
		fix();
		scales = [0.25, 1.6];
		doc[addEvent](type, fix, true);
	}

}(document));

$(function() {
	$('.tablink').click(function(e) {
		$('.tablink').removeClass('active');
		$(this).addClass('active');
		$('.tabs').removeClass('active');
		if ($(this).hasClass('tab1')) {
			$('#tab1').addClass('active');
		} else if ($(this).hasClass('tab2')) {
			$('#tab2').addClass('active');
		} else if ($(this).hasClass('tab3')) {
			$('#tab3').addClass('active');
		}
		e.preventDefault();
	});

	// Only add the toggle class if there are child pages
	$('.nice-menu-down > li > a + ul').after('<span class="js-toggle-dropdown"><span class="icon icon-plus-sign"></span></span>');
	$('.js-toggle-dropdown').click(function(e) {
		e.preventDefault();
		$(this).parent().toggleClass('nav-dropdown-expanded');
		$(this).find('span').toggleClass('icon-plus-sign icon-remove-sign');
	});
	if(Modernizr.mq('only all and (min-width: 900px)')) {
		$('body').addClass('mq-desktop');
	} else if(Modernizr.mq('only all and (min-width: 700px)')) {
		$('body').addClass('mq-lg_tab');
	} else if(Modernizr.mq('only all and (min-width: 400px)')) {
		$('body').addClass('mq-phone_wide-sm_tab');
	} else {
		$('body').addClass('mq-phone');
	}


	$('#nav-toggle').click(function(e) {
		e.preventDefault();
		$('.main-menu').toggleClass('open');
		$('body').toggleClass('nav-open');
		$(this).find('span').toggleClass('icon-reorder icon-remove-sign');

	});

	$('.usage-notes-menu').waypoint('sticky');



});



$(document).ready(function() {
$('.nav').onePageNav({
	currentClass: 'current',
	changeHash: false,
	scrollSpeed: 750,
	scrollOffset: 30,
	scrollThreshold: 0.5,
	filter: '',
	easing: 'swing',
	begin: function() {
		//I get fired when the animation is starting
	},
	end: function() {
		//I get fired when the animation is ending
	},
	scrollChange: function($currentListItem) {
		//I get fired when you enter a section and I pass the list item of the section
	}
});	
	
});


/*! Normalized address bar hiding for iOS & Android (c) @scottjehl MIT License */
(function( win ){
	var doc = win.document;

	// If there's a hash, or addEventListener is undefined, stop here
	if( !location.hash && win.addEventListener ){

		//scroll to 1
		win.scrollTo( 0, 1 );
		var scrollTop = 1,
			getScrollTop = function(){
				return win.pageYOffset || doc.compatMode === "CSS1Compat" && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
			},

			//reset to 0 on bodyready, if needed
			bodycheck = setInterval(function(){
				if( doc.body ){
					clearInterval( bodycheck );
					scrollTop = getScrollTop();
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}
			}, 15 );

		win.addEventListener( "load", function(){
			setTimeout(function(){
				//at load, if user hasn't scrolled more than 20 or so...
				if( getScrollTop() < 20 ){
					//reset to hide addr bar at onload
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}
			}, 0);
		}, false );
	}
})( this );
