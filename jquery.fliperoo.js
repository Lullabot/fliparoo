/*
  See README.md for information on usage
*/

;(function($) { 

  $.fliperoo = {
    version: '0.2',
    // override defaults by including a file overriding jQuery.fliperoo.options
    options: {}
  };
  
  $.fn.fliperoo = function(stockpile, options) {
  
    var unifiedList = false; // are the display and stockpile the same list?
  
    if ((typeof stockpile == 'undefined' && typeof options == 'undefined') || (typeof options == 'undefined' && (typeof stockpile[0] == 'undefined' || typeof stockpile[0].nodeName == 'undefined'))) {
      // if there are no arguments OR
      // if there's no second argument and the first isn't an HTML element
      // @todo find better test? use arguments array?
      options = stockpile;
      stockpile = null;
      unifiedList = true;
      //console.log('unified!');
    }
  
    // set up the options, merging defaults, and any overrides from an external file
    var opts = $.extend({}, $.fliperoo.defaults, $.fliperoo.options, options);
    
    var displayItems = []; // list of elements to display in

    //this.each(function(index) {
    
      if (unifiedList && opts.displayCount) {
        // if it's a unified list and the display count is not 0
        $(this).filter(":visible").each(function(i){
          if (i < opts.displayCount) {
            // add the first x elements to the displayItems array
            displayItems.push(this);
          }
          else {
            // hide the rest
            $(this).hide();
          }
        });
        //displayItems = $(this).filter(":lt("+ opts.displayCount +")").toArray();
        //$(this).not(":lt("+ opts.displayCount +")").hide();
      }
      else {
        displayItems = $(this).toArray(); 
      }
      
      var displayIndex = 0; // index of next item to display in      
            
      // create array representing the order of display
      var displayOrder = [];
      for (var i=0; i<displayItems.length; i++) {
        displayOrder[i] = i;
      }
      
      // reorder things based on displayOrder option
      if (opts.displayOrder == 'random') {
        // random
        displayOrder = shuffle(displayOrder);
      } else if (opts.displayOrder == 'reverse') {
        // reverse
        displayOrder.reverse();
      } else {
        // forward
        // do nothing - don't reorder 
      }
            
      // add copy of the display items to the end of the stock items array
      var stockItems = $(stockpile).toArray().concat($(this).clone().toArray());
      //console.log($(stockpile).toArray());
      
      var stockIndex = 0; // the next item to pull from the stock pile
      if (unifiedList) {
        stockIndex = opts.displayCount;
      }
      
      // @todo: if we want to randomize, then shuffle stockpile, and swap out display items immediately
      if (opts.randomize) {
        stockItems = shuffle(stockItems);
      }
      // stockItems is an array of HTML elements in the order to be displayed
      
      // let's make some rotation values
      var rotation = {};
      var rotationCSS = {};
      var axisArray = opts.rotateAxis.split("");
      var directionArray = opts.rotateDirection.split("");
      var directionIndex = 0;
      $.each(axisArray, function(i, e){
        var p = (e == 'Z') ? "" : e;
        rotation['rotate' + p] = directionArray[directionIndex] + "=180deg";
        directionIndex = (directionIndex + 1) % (directionArray.length);
      });
      
      // let's start manipulating the HTML
      // add class to display container
      // $(this).addClass('fliperoo-display-list');
      // then we wrap contents of each of the display elements
      $(displayItems).each(function(){
        if (opts.randomize) {
          // if we're random, then take the first items from the stockpile and stick 'em in before the page loads
          $(this).empty().append($(stockItems[stockIndex]).clone().contents());
          stockIndex = (stockIndex + 1) % (stockItems.length);
        }
        $(this).addClass('fliperoo-display-container').data('flipped', false).contents().wrapAll('<div class="fliperoo-display fliperoo-front" />');
        // stick on the back side and rotate it appropriately
        $('<div class="fliperoo-display fliperoo-back"></div>').appendTo(this).css(rotation);
      });
      
      //console.log(stockItems);
      
      function doNext() {
        // replace the display item with the stockpile item
        
        var dispCont = displayItems[displayOrder[displayIndex]]; // display container
        var flipped = $(dispCont).data('flipped');
        
        // change out the (current) back side
        var side = flipped ? '.fliperoo-front' : '.fliperoo-back';
        $(dispCont).children(side).empty().append($(stockItems[stockIndex]).clone().contents());
        
        // toggle flipped status on this element
        $(dispCont).data('flipped', !flipped);
        
        var transition = $.extend({}, {perspective: opts.perspective}, rotation, opts.transit);
        
        if (opts.flipFlop){
          //toggle direction
          $.each(rotation, function(i, e){
            rotation[i] = (e == "+=180deg") ? "-=180deg" : "+=180deg";
          });
        }
        
        // then turn it 180 degrees
        $(dispCont).addClass('fliperoo-animating').transition(transition, opts.transTime, opts.easing, function(){
          // when all the animations are done...
          $(this).removeClass('fliperoo-animating');
          // increment and modulus our indexes
          displayIndex = (displayIndex + 1) % (displayItems.length);
          stockIndex = (stockIndex + 1) % (stockItems.length);
          var delay = opts.delay;
          // if we're to the end of the set, add the setDelay
          if (displayIndex == 0) {
            delay += opts.setDelay;
          }
          // set the timer for the next one
          setTimeout(doNext, delay);
        });
        
      };
      
      setTimeout(doNext, opts.delay + opts.setDelay);      
      
    //});
    return this;
  }
  
  //utility functions
  
  // Shuffle (randomize) an array
  function shuffle(o) {
  	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  	return o;
  };
  
  
  
  // default options
  // this can also be read as a manual for the plugin options
  $.fliperoo.defaults = {
    delay: 2000,
    // milliseconds between flips
    
    transTime: 1000,
    // transition time of each flip in milliseconds
    
    easing: 'cubic-bezier(.44,-0.23,.51,1.44)',
    // easing of flip animation
    // options from http://ricostacruz.com/jquery.transit/
    // I recommend http://cubic-bezier.com/
    
    setDelay: 0,
    // delay between iterations through the display set
    // This is an additional delay added after all items in display set have been flipped
    
    randomize: false,
    // true = Randomize items to be displayed.
    // false = Go through display and stockpile in order.
    
    displayCount: 4,
    // when using a single list, how many items should be displayed?
    // the remainder will be hidden
    // 0 = all (hide none)
    
    displayOrder: 'random',
    // options: 'random', 'forward', 'reverse'
    // how should the repeating pattern of display order be chosen?
    
    perspective: '500px',
    // Depth of perspective. Lower values give a more pronounced effect.
    
    rotateAxis: 'Y',
    // options: 'X', 'Y', 'XY', 'XZ', 'YZ, or 'XYZ'
    // rotate along X, Y, or all axes
    // simple X or Y work best - others are buggy
        
    rotateDirection: '+',
    // options: '+', or '-'
    // rotate forward or back
    
    flipFlop: false,
    // if true, rotationDirection will alternate with each flip
    
    transit: {},
    // Additional Transit properties. See http://ricostacruz.com/jquery.transit/
    
    // ideas ------------------------------
    
    
    // these options don't work yet -------------------
    
    iterations: 0,
    // How many times should we iterate through the stockpile?
    // 0 = infinite
    
    pauseOnMouseover: false,
    // Pause when mouse hovers over the display container?
    
    customAnimation: false,
    // function to use for custom animations
    
    justVisible: true,
    // just swap out visible items
    
    hideAllBut: 0
    // Number of items to show, hiding the remainder to use in the stockpile.
    // This is usually best handled with CSS, but if you'd like non-JS fallback
    // to be display of all images, then enter a number here.
    // 0 = show all (hide none)
    // example::    hideAllBut: 5
    
    
    
  };
    
})(jQuery);