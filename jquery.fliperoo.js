/*
  See README.md for information on usage
*/

;(function($, window, document, undefined) { 

  $.fliperoo = {
    version: '0.2',
    // override defaults by including a file overriding jQuery.fliperoo.options
    options: {}
  };
  
  $.fn.fliperoo = function(queue, options) {
    
    // deprecated:
    // add a data property to reference this function
    // thisFunc = arguments.callee;
    // $(this).data('fliperoo', thisFunc);
  
    var unifiedList = false; // are the display and queue the same list?
  
    if ((typeof queue == 'undefined' && typeof options == 'undefined') || (typeof options == 'undefined' && (typeof queue[0] == 'undefined' || typeof queue[0].nodeName == 'undefined'))) {
      // if there are no arguments OR
      // if there's no second argument and the first isn't an HTML element
      // @todo find better test? use arguments array?
      options = queue;
      queue = null;
      unifiedList = true;
    }
  
    // set up the options, merging defaults, and any overrides from an external file
    var opts = $.extend({}, $.fliperoo.defaults, $.fliperoo.options, options);
    
    var displayItems = []; // list of elements to display in
    
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
          
    // add copy of the display items to the end of the queue items array
    var queueItems = $(queue).toArray().concat($(this).clone().toArray());
    //console.log($(queue).toArray());
    
    var queueIndex = 0; // the next item to pull from the queue
    if (unifiedList) {
      queueIndex = opts.displayCount;
    }
    
    // @todo: if we want to randomize, then shuffle queue, and swap out display items immediately
    if (opts.randomize) {
      queueItems = shuffle(queueItems);
    }
    // queueItems is an array of HTML elements in the order to be displayed
    
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
        // if we're random, then take the first items from the queue and stick 'em in before the page loads
        $(this).empty().append($(queueItems[queueIndex]).clone().contents());
        queueIndex = (queueIndex + 1) % (queueItems.length);
      }
      $(this).addClass('fliperoo-display-container').data('flipped', false).contents().wrapAll('<div class="fliperoo-display fliperoo-front" />');
      // stick on the back side and rotate it appropriately
      $('<div class="fliperoo-display fliperoo-back"></div>').appendTo(this).css(rotation);
    });
    
    //console.log(queueItems);
    
    var doNext = function() {
      // clear any existing timer (if doNext() was called early somehow)
      clearTimeout(timer);
      
      // replace the display item with the queue item
      var dispCont = displayItems[displayOrder[displayIndex]]; // display container
      var flipped = $(dispCont).data('flipped');
      
      // change out the (current) back side
      var side = flipped ? '.fliperoo-front' : '.fliperoo-back';
      if (!$.support.transition) {
        // if transitions aren't supported, we just swap the front side
        side = '.fliperoo-front';
      }
      
      $(dispCont).children(side).empty().append($(queueItems[queueIndex]).clone().contents());
      
      // toggle flipped status on this element
      $(dispCont).data('flipped', !flipped);
      
      var transition = $.extend({}, {perspective: opts.perspective}, rotation, opts.transit);
      
      if (opts.flipFlop){
        //toggle direction
        $.each(rotation, function(i, e){
          rotation[i] = (e == "+=180deg") ? "-=180deg" : "+=180deg";
        });
      }
      
      // We update the indexes and calculate the delay ahead of the transition 
      // in case it doesn't finish before next is triggered
      // increment and modulus our indexes
      displayIndex = (displayIndex + 1) % (displayItems.length);
      queueIndex = (queueIndex + 1) % (queueItems.length);
      var delay = opts.delay;
      // if we're to the end of the set, add the setDelay
      if (displayIndex == 0) {
        delay += opts.setDelay;
      }
      
      // Function to execute after animation
      var postAnimation = function() {
        // when all the animations are done...
        $(this).removeClass('fliperoo-animating');
        // set the timer for the next one
        timer = setTimeout(doNext, delay);
      }
      
      var animationFunc = opts.animationFunc;

      // then turn it 180 degrees
      $(dispCont).addClass('fliperoo-animating')[animationFunc](transition, opts.transTime, opts.easing, postAnimation);
      
    };
    
    var pause = function(){
      clearTimeout(timer);
    }
    
    var resume = function(){
      doNext();
    }
    
    $(this).each(function(){
      $(this).data('fliperoo.next', doNext);
      $(this).data('fliperoo.pause', pause);
      $(this).data('fliperoo.resume', resume);
    });
    
    var timer = setTimeout(doNext, opts.delay + opts.setDelay);      
    
    return this;
  }
  
  
  $.fn.fliperooNext = function(){
    $(this).data('fliperoo.next').call();
    return this;
  }
  
  $.fn.fliperooPause = function(){
    $(this).data('fliperoo.pause').call();
    return this;
  }
  
  $.fn.fliperooResume = function(){
    $(this).data('fliperoo.resume').call();
    return this;
  }
  
  // UTILITY FUNCTIONS
  
  // Shuffle (randomize) an array
  function shuffle(o) {
  	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  	return o;
  };
  
  
  // DEFAULT OPTIONS
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
    // false = Go through display and queue in order.
    
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
    
    animationFunc: 'transition',
    // Transit can be overridden with another (custom) jQuery plugin
    // arguments sent are:
    //   transition: an object containing the animation parameters for a flip
    //   transTime: transition time for animation
    //   Easing: easing parameters for animation
    //   postAnimation*: a function to execute when animation is finished
    //     * = Required - call this at end of your function. Hint: postAnimation.call();
    
    // these options don't work yet -------------------
    
    fallbackTo: 'no-animate',
    // options: 'no-animate', 'nothing'
    
    iterations: 0,
    // How many times should we iterate through the queue?
    // 0 = infinite
    
    pauseOnMouseover: false,
    // Pause when mouse hovers over the display container?
    
    customAnimation: false,
    // function to use for custom animations
    
    
  };
    
})(jQuery, window, document);