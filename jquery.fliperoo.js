/*
This script is intended to swap out items in a display list with those 
in a stockpile list. The most obvious use is for a strip of images which 
swap out from a larger list.

This is meant to be an alternative to a carousel - a little more ambient 
with less user interaction.

Created by Jeff Robbins with Lullabot

Use examples: 
  $('ul.display').fliperoo($('ul.stockpile'));
  $('ul.display').fliperoo($('ul.stockpile'), {delay: 1000, iterations: 5});


*/


jQuery.fliperoo = {version: '0.1'};

;(function($) { 
  jQuery.fn.fliperoo = function(stockpile, options) {
    // @todo: check to see if the stockpile is an element
    // if not, the stockpile and the display are the same
    
    // if stockpile and display are the same, offset stockpile start by
    // number of visible items
    
    
    return this.each(function(index) {
        
      var opts = jQuery.extend(false, jQuery.fliperoo.defaults, jQuery.fliperoo.options, options);
      
      var displayItems = $(this).children().toArray(); // list of elements to display in
      
      var displayIndex = 0; // index of next item to display in
      
      //console.log(displayItems);
      
      //create a random array representing the order of display
      var displayOrder = [];
      for (var i=0;i<displayItems.length;i++) {
        displayOrder[i] = i;
      }
      displayOrder = shuffle(displayOrder);
      //console.log(displayOrder);
      
      // add copy of the display items to the end of the stock items array
      var stockItems = $(stockpile).children().toArray().concat($(this).children().clone().toArray());
      
      // stockItems is an array of HTML elements in the order to be displayed
      
      //console.log(typeof stockItems);
      //console.log(stockItems);

      var stockIndex = 0; // the next item to pull from the stock pile
      
      // let's start manipulating the HTML
      // first we wrap contents of each of the display elements
      $(displayItems).each(function(){
        $(this).addClass('fliperoo-display-container').data('flipped', false).contents().wrapAll('<div class="fliperoo-display fliperoo-front" />');
        $(this).append('<div class="fliperoo-display fliperoo-back"></div>');
      });
      
      function doNext() {
        // replace the display item with the stockpile item
        // this next line could be replaced with some fancy animation
        /*
        $(displayItems[displayOrder[displayIndex]]).animate({opacity: 0}, 400, 'swing', function(){
          //console.log(this);
          $(this).replaceWith(stockItems[stockIndex]);
        });
        */
        //$(displayItems[displayOrder[displayIndex]]).replaceWith(stockItems[stockIndex]);
        
        var dispCont = displayItems[displayOrder[displayIndex]]; // display container
        var flipped = $(dispCont).data('flipped');
        
        // change out the back side
        var side = flipped ? '.fliperoo-front' : '.fliperoo-back';
        $(dispCont).children(side).empty().append($(stockItems[stockIndex]).clone().contents());
        
        // toggle flipped
        $(dispCont).data('flipped', !flipped);
        
        // then turn it 180 degrees
        $(dispCont).transition({perspective: opts.perspective, rotateY: '+=180deg'}, opts.transTime, function(){
          // when all the animations are done...
          // increment and modulus our indexes
          displayIndex = (displayIndex + 1) % (displayItems.length);
          stockIndex = (stockIndex + 1) % (stockItems.length);
          // set the timer for the next one
          setTimeout(doNext, opts.delay);
        });     
        
      };
      
      setTimeout(doNext, opts.delay);      
      
    });
  }
  
  //utility functions
  
  // Shuffle (randomize) an array
  function shuffle(o) {
  	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  	return o;
  };
  
  
  
  // default options
  // this can also be read as a manual for the plugin
  jQuery.fliperoo.defaults = {
    delay: 2000,
    // milliseconds between swaps
    
    perspective: '500px',
    // 3d rotation perspective
    
    transTime: 1000,
    // transition time in milliseconds
    
    // none of the other options work yet -------------------
    
    random: false,
    // true = randomize the stockpile
    // false = go through stockpile in order
    
    iterations: 0,
    // How many times should we iterate through the stockpile?
    // 0 = infinite
    
    pauseOnMouseover: false,
    // Pause when mouse hovers over the display container?
    
    animation: 'fade',
    // animation to use for swaps
    // options: 'none', 'flip', 'fade', 'fadethroughblack', 'fadethroughwhite'
    // 'custom'
    
    customAnimation: false,
    // function to use for custom animations    
    
    displayOrder: 'random-pattern',
    // options: 'random', 'random-pattern', 'ftl' (first to last), 'ltf'
    // random-pattern uses same random pattern through each iteratiion
    // it's much more intuitive than true random
    
    justVisible: true,
    // just swap out visible items
    
    hideAllBut: 0,
    // Number of items to show, hiding the remainder to use in the stockpile.
    // This is usually best handled with CSS, but if you'd like non-JS fallback
    // to be display of all images, then enter a number here.
    // 0 = show all (hide none)
    // example::    hideAllBut: 5
    
    
    
  };
  
  jQuery.fliperoo.options = {};
  
})(jQuery);