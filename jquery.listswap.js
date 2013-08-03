/*
This script is intended to swap out items in a display list with those 
in a stockpile list. The most obvious use is for a strip of images which 
swap out from a larger list.

This is meant to be an alternative to a carousel - a little more ambient 
with less user interaction.

Use examples: 
  $('ul.display').fliperoo($('ul.stockpile'));
  $('ul.display').fliperoo($('ul.stockpile'), {delay: 1000, iterations: 5});


*/


jQuery.fliperoo = {version: '0.1'};

;(function($) { 
  jQuery.fn.fliperoo = function(stockpile, options) {
    // check to see if the stockpile is an element
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
        
        
        $(displayItems[displayOrder[displayIndex]]).transition({perspective: '500px', rotateY: '+=90deg'}, 400, function(){          
          
          // empty out this li, fill with the contents of next stock item, and show
          $(this).empty().append($(stockItems[stockIndex]).clone().contents());
          $(this).transition({perspective: '500px', rotateY: '+=90deg'}, 400, function(){
            
            // do the same thing in the displayItems list so we can replace it later
            // displayItems[displayOrder[displayIndex]] = stockItems[stockIndex];
                      
            // when all the animations are done...
            // increment and modulus our indexes
            displayIndex = (displayIndex + 1) % (displayItems.length);
            stockIndex = (stockIndex + 1) % (stockItems.length);
            setTimeout(doNext, opts.delay);            
          });          
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
    
    // none of the other options work yet -------------------
    
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
    
    randomizeStockpile: false,
    // true = randomize the stockpile
    // false = go through stockpile in order
    
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