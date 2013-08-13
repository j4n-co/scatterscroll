/*! Copyright (c) 2013 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.1.3
 *
 * Requires: 1.2.2+
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'];
    var toBind = 'onwheel' in document || document.documentMode >= 9 ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];
    var lowestDelta, lowestDeltaXY;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    $.event.special.mousewheel = {
        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },

        unmousewheel: function(fn) {
            return this.unbind("mousewheel", fn);
        }
    });


    function handler(event) {
        var orgEvent = event || window.event,
            args = [].slice.call(arguments, 1),
            delta = 0,
            deltaX = 0,
            deltaY = 0,
            absDelta = 0,
            absDeltaXY = 0,
            fn;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";

        // Old school scrollwheel delta
        if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta; }
        if ( orgEvent.detail )     { delta = orgEvent.detail * -1; }

        // New school wheel delta (wheel event)
        if ( orgEvent.deltaY ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( orgEvent.deltaX ) {
            deltaX = orgEvent.deltaX;
            delta  = deltaX * -1;
        }

        // Webkit
        if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY; }
        if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Look for lowest delta to normalize the delta values
        absDelta = Math.abs(delta);
        if ( !lowestDelta || absDelta < lowestDelta ) { lowestDelta = absDelta; }
        absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
        if ( !lowestDeltaXY || absDeltaXY < lowestDeltaXY ) { lowestDeltaXY = absDeltaXY; }

        // Get a whole value for the deltas
        fn = delta > 0 ? 'floor' : 'ceil';
        delta  = Math[fn](delta / lowestDelta);
        deltaX = Math[fn](deltaX / lowestDeltaXY);
        deltaY = Math[fn](deltaY / lowestDeltaXY);

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

}));








$(document).ready(function(){
  
/*------- get the DOM elems -------*/
var doc = $(window),
    body = $('body'),
    docH = $(window).height(),
    items = [],
    posts = $('.post.group'),
    container = $('#container')

/*------- initialize first state,'atBottom', then add items to array -------*/
function dropItems(item){
    var a = $(item)
    
    a.leftPos = Math.random()*500 + (doc.width()/2 - a.width())
    a.deg = Math.random(360)*100
    a.defaultClasses = a[0].className
    a.css({ position: 'fixed', left:a.leftPos, top: docH, transform: 'rotate('+a.deg+'deg)', webkitTransform: 'rotate('+a.deg+'deg)'  })

    a.state = 'atBottom'
    a[0].className = a.defaultClasses +' '+ a.state

    items.push(a)
}

/*------- drop items-------*/
$.each(posts, function( index , item){
  dropItems(item)
})


/*------- scatter -------*/
function scatter(a){

  /* bottom animation */
  a.bottomSwipeOnStart = function(){
    unbindMouseScroll()
    //$('#posts').css({'position':'fixed'})
    a.css({position:'fixed'})
  }
  a.bottomSwipeOnComplete = function(){
    unbindMouseScroll()
    container.scrollTop(0)
    a.css({position:'absolute', top: 0, bottom:'auto'})
    a.state = 'inFocus'
    a[0].className = a.defaultClasses +' '+ a.state

    $('#posts').css({'height':a.outerHeight() + docH*0.3,'position':'absolute'})
    window.setTimeout(function(){
      bindMouseScroll()      
    }, 50)
  }    
  a.bottomSwipeOnReverseComplete = function(){
    unbindMouseScroll()
    a.css({position:'fixed'})
    a.state = 'atBottom'
    a[0].className = a.defaultClasses +' '+ a.state
    
    window.setTimeout(function(){
      bindMouseScroll()      
    }, 50)  
  } 

  /* top animation */
  a.topSwipeOnComplete = function(){
    unbindMouseScroll()
    a.state = 'atTop'
    a[0].className = a.defaultClasses +' '+ a.state
 
    window.setTimeout(function(){
      bindMouseScroll()
    }, 50)
  }
  a.topSwipeOnReverseComplete = function(){
    unbindMouseScroll()    
    a.css({position:'absolute' /*, top:a.offset().top*/ })
    $('#posts').css({'height':a.outerHeight() + docH*0.3})
    container.scrollTop( $('#posts').outerHeight())
    a.state = 'inFocus'
    a[0].className = a.defaultClasses +' '+ a.state

    window.setTimeout(function(){
      bindMouseScroll()      
    }, 50)
  }

  a.topSwipeOnStart = function(){
    unbindMouseScroll()    
    /*-- removes the 'top' css and sticks the bottom where is should be--*/
    windowHeight = $(window).outerHeight();
    objectHeight = a.outerHeight();
    objectOffsetTop = a.offset().top;
    bottomOffsetInPixels = windowHeight - objectHeight - objectOffsetTop;
    a.css({position:'fixed', 'top':'auto', 'bottom':bottomOffsetInPixels })
    
    $('#posts').css({'height':a.outerHeight() + docH*0.3})
 
    window.setTimeout(function(){
      bindMouseScroll()
    }, 50)   
  }

  a.bottomSwipe = new TimelineMax({paused:true})  
  a.bottomSwipe.to(a, 0.3, { top:$('#posts').offset().top, rotation: 0, transformOrigin:"0 50%", left: doc.width()/2 - a.width()/2 , onStart: a.bottomSwipeOnStart, onComplete: a.bottomSwipeOnComplete, onReverseComplete: a.bottomSwipeOnReverseComplete })

  a.topSwipe = new TimelineMax({paused: true})
  a.topSwipe.to(a, 0.3, { bottom: docH-200,rotation: a.deg ,transformOrigin:"100% 50%",  onStart: a.topSwipeOnStart, onComplete: a.topSwipeOnComplete, onReverseComplete: a.topSwipeOnReverseComplete })

}

/*------- attaching scatter -------*/
$.each(items, function( index , item){
  scatter(item)
})

/*------- mousewheel handler -------*/  
var item;
var itemIndex; 
function MouseWheelHandler(event, delta, deltaX, deltaY){
  
  if (!item){
    itemIndex = 0
    item = items[itemIndex]
  }  
  var e = window.event || event;
  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));  
  
  //scrolling down
  if (delta === -1){
    switch(item.state){
      case 'atBottom': 
          item.bottomSwipe.play()          
      break; 
      
      case 'inFocus':
        if (($('#posts').height() - container.outerHeight() -  container.scrollTop()) <= 30){
          item.state = 'doneScrolling'
        }       
      break;
      
      case 'doneScrolling':
        item.topSwipe.play()
        if ((item.outerHeight() - container.outerHeight() -  container.scrollTop()) > 10){
          item.state = 'inFocus'
          //items[itemIndex-1].state = 'atTop'
          //items[itemIndex+1].state = 'atBottom'
        } 
      break;
      
      case 'atTop':
        itemIndex += 1
        itemIndex = Math.min(itemIndex, items.length -1)
        item = items[itemIndex]
      break;
    }
  }
  else {
    switch(item.state){
      case 'atBottom': 
        item.bottomSwipe.reverse()
        itemIndex -= 1
        itemIndex = Math.max(itemIndex, 0)
        item = items[itemIndex]
      break; 
      
      case 'inFocus':
        if(container.scrollTop() === 0 ){
          item.bottomSwipe.reverse()
        } 
      break;
      
      case 'atTop':
          item.topSwipe.reverse()
          item.onTopStart()
      break;

      case 'doneScrolling':
        item.topSwipe.play()
        if ((item.outerHeight() - container.outerHeight() -  container.scrollTop()) > 10){
          item.state = 'inFocus'
          items[itemIndex-1].state = 'atTop'
          items[itemIndex+1].state = 'atBottom'
        } 
      break;
    }    
  }
  return false
}


//binding
function bindMouseScroll(){
  $(window).bind("mousewheel", function(event, delta, deltaX, deltaY){
    MouseWheelHandler(event, delta, deltaX, deltaY)
  } )
}

bindMouseScroll();


function unbindMouseScroll(){
  $(window).unbind("mousewheel")
}

})