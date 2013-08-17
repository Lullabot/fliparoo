/*
This script is intended to swap out items in a display list with those 
in a stockpile list. The most obvious use is for a strip of images which 
swap out from a larger list.

This is meant to be an alternative to a carousel - a little more ambient 
with less user interaction.

Created by Jeff Robbins with Lullabot

Use examples: 
  $('ul.display').fliperoo($('ul.stockpile'));
  $('ul.display').fliperoo($('ul.stockpile'), {
    delay: 1000,
    transTime: 1000, 
    randomize: true
  });
  
Requires jQuery Transit plugin: http://ricostacruz.com/jquery.transit/

USAGE NOTES:
Fliperoo should be pointed at container elements representing the display and stockpile list. Most web developers will use a <ul> or <ol> list for this purpose. The children of these elements are used as the list items for display and stockpile. Since it is invalid to add elements between the <ul> and <li> items, Fliperoo creates a <div> element inside of each display <li> and effectively moves the content of the <li> into the <div>. Example:

    <ul>
      <li>one</li>
      <li>two</li>
      <li>three</li>
      <li>four</li>
    </ul>
    
after processing, becomes

    <ul>
      <li class="fliperoo-display-container">
        <div class="fliperoo-display fliperoo-front">one</div>
        <div class="fliperoo-display fliperoo-back">five</div>
      </li>
      <li class="fliperoo-display-container">
        <div class="fliperoo-display fliperoo-front">two</div>
        <div class="fliperoo-display fliperoo-back">six</div>
      </li>
      <li class="fliperoo-display-container">
        <div class="fliperoo-display fliperoo-front">three</div>
        <div class="fliperoo-display fliperoo-back">seven</div>
      </li>
      <li class="fliperoo-display-container">
        <div class="fliperoo-display fliperoo-front">four</div>
        <div class="fliperoo-display fliperoo-back">eight</div>
      </li>
    </ul>
    
The <li> "container" items are the items which use 3D transforms to flip. The front/back divs flip with their parent. However, note that the <li> items should not have a background color on them or they will obscure the child elements when flipped. Instead add styling to the "fliperoo-display" items.

*/


jQuery.fliperoo = {version: '0.1'};

;(function($) { 
  jQuery.fn.fliperoo = function(stockpile, options) {  
    
    return this.each(function(index) {
    
      var unifiedList = false; // are the display and stockpile the same list?
    
      if ((typeof stockpile == 'undefined' && typeof options == 'undefined') || (typeof options == 'undefined' && (typeof stockpile[0] == 'undefined' || typeof stockpile[0].nodeName == 'undefined'))) {
        // there's no second argument and the first isn't an HTML element
        // OR there are no arguments altogether
        // @todo find better test?
        options = stockpile;
        stockpile = {};
        unifiedList = true;
      }
    
      
      // set up the options, merging defaults, and any overrides from an external file
      var opts = jQuery.extend(false, jQuery.fliperoo.defaults, jQuery.fliperoo.options, options);
      
      var displayItems = []; // list of elements to display in
      if (unifiedList && opts.displayCount) {
        // if it's a unified list and the display count is not 0
        $(this).children().each(function(i){
          if (i < opts.displayCount) {
            // add the first x elements to the displayItems array
            displayItems.push(this);
          }
          else {
            // hide the rest
            $(this).hide();
          }
        });
      }
      else {
        displayItems = $(this).children().toArray(); 
      }
      
      var displayIndex = 0; // index of next item to display in      
            
      //create a random array representing the order of display
      var displayOrder = [];
      for (var i=0; i<displayItems.length; i++) {
        displayOrder[i] = i;
      }
      displayOrder = shuffle(displayOrder);
      
      // add copy of the display items to the end of the stock items array
      var stockItems = $(stockpile).children().toArray().concat($(this).children().clone().toArray());
      
      var stockIndex = 0; // the next item to pull from the stock pile
      if (unifiedList) {
        stockIndex = opts.displayCount;
      }
      
      // @todo: if we want to randomize, then shuffle stockpile, and swap out display items immediately
      if (opts.randomize) {
        stockItems = shuffle(stockItems);
      }
      // stockItems is an array of HTML elements in the order to be displayed
      
      //console.log(typeof stockItems);
      //console.log(stockItems);
      
      
      // let's start manipulating the HTML
      // first we wrap contents of each of the display elements
      $(displayItems).each(function(){
        if (opts.randomize) {
          // if we're random, then take the first items from the stockpile and stick 'em in before the page loads
          $(this).empty().append($(stockItems[stockIndex]).clone().contents());
          stockIndex = (stockIndex + 1) % (stockItems.length);
        }
        $(this).addClass('fliperoo-display-container').data('flipped', false).contents().wrapAll('<div class="fliperoo-display fliperoo-front" />');
        $(this).append('<div class="fliperoo-display fliperoo-back"></div>');
      });
      
      function doNext() {
        // replace the display item with the stockpile item
        
        var dispCont = displayItems[displayOrder[displayIndex]]; // display container
        var flipped = $(dispCont).data('flipped');
        
        // change out the (current) back side
        var side = flipped ? '.fliperoo-front' : '.fliperoo-back';
        $(dispCont).children(side).empty().append($(stockItems[stockIndex]).clone().contents());
        
        // toggle flipped status on this element
        $(dispCont).data('flipped', !flipped);
        
        // then turn it 180 degrees
        $(dispCont).transition(opts.transition, opts.transTime, opts.easing, function(){
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
    
    transition: {
      perspective: '500px',
      rotateY: '+=180deg'
    },
    // transit properties. See http://ricostacruz.com/jquery.transit/
    // for proper function it should flip element 180deg
    // when overriding the 'trasition' default, all properties of the transition should be specified
    // only Y-axis rotation currently works
    
    transTime: 1000,
    // transition time in milliseconds
    
    easing: 'cubic-bezier(.44,-0.23,.51,1.44)',
    // easing options from http://ricostacruz.com/jquery.transit/
    // I recommend http://cubic-bezier.com/
    
    randomize: false,
    // true = randomize the stockpile
    // false = go through stockpile in order
    
    displayCount: 4,
    // when using a single list, how many items should be displayed?
    // the remainder will be hidden
    // 0 = all (hide none)
    
    // these options don't work yet -------------------
    
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
  
  // override defaults by including a file overriding jQuery.fliperoo.options
  jQuery.fliperoo.options = {};
  
})(jQuery);