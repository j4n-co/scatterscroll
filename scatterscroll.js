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
    a.css({ position: 'fixed', left:a.leftPos, top: docH, WebkitTransform: 'rotate('+a.deg+'deg)' })

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
    a.css({position:'fixed'})
    $('#posts').css({'position':'fixed'})
  }
  a.bottomSwipeOnComplete = function(){
    unbindMouseScroll()
    container.scrollTop(0)
    a.css({position:'absolute', top: 0})
    a.state = 'inFocus'
    a[0].className = a.defaultClasses +' '+ a.state

    $('#posts').css({'height':a.outerHeight() + docH*0.3,'position':'absolute'})
    window.setTimeout(function(){
      bindMouseScroll()      
    }, 500)
  }    
  a.bottomSwipeOnReverseComplete = function(){
    unbindMouseScroll()
    a.css({position:'fixed'})
    a.state = 'atBottom'
    a[0].className = a.defaultClasses +' '+ a.state
    
    window.setTimeout(function(){
      bindMouseScroll()      
    }, 500)  
  } 

  /* top animation */
  a.topSwipeOnComplete = function(){
    unbindMouseScroll()
    a.state = 'atTop'
    a[0].className = a.defaultClasses +' '+ a.state
 
    window.setTimeout(function(){
      bindMouseScroll()
    }, 500)
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
    }, 500)
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
    }, 500)   
  }

  a.bottomSwipe = new TimelineMax({paused:true})  
  a.bottomSwipe.to(a, 0.5, { top:$('#posts').offset().top, rotation: 0, transformOrigin:"0 50%", left: doc.width()/2 - a.width()/2 , onStart: a.bottomSwipeOnStart, onComplete: a.bottomSwipeOnComplete, onReverseComplete: a.bottomSwipeOnReverseComplete, ease:Sine.easeOut })

  a.topSwipe = new TimelineMax({paused: true})
  a.topSwipe.to(a, 0.5, { bottom: docH-300 ,rotation: a.deg ,transformOrigin:"100% 50%",  onStart: a.topSwipeOnStart, onComplete: a.topSwipeOnComplete, onReverseComplete: a.topSwipeOnReverseComplete, ease:Sine.easeIn })

}

/*------- attaching scatter -------*/
$.each(items, function( index , item){
  scatter(item)
})

/*------- mousewheel handler -------*/  
var item;
var itemIndex; 
function MouseWheelHandler(event){
  
  if (!item){
    itemIndex = 0
    item = items[itemIndex]
  }  
  var e = window.event || e;
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
    }    
  }
  return false
}


//binding
function bindMouseScroll(){
  if (doc[0].addEventListener) {
      doc[0].addEventListener("mousewheel", MouseWheelHandler, false)
      doc[0].addEventListener("DOMMouseScroll", MouseWheelHandler, false)
    }
  else {
      doc[0].attachEvent("onmousewheel", MouseWheelHandler)
  }
}

bindMouseScroll();


function unbindMouseScroll(){
  //alert('unbinding happening')
  if (doc[0].removeEventListener) {
      doc[0].removeEventListener("mousewheel", MouseWheelHandler, false)
      doc[0].removeEventListener("DOMMouseScroll", MouseWheelHandler, false)
    }
  else {
      doc[0].detachEvent("onmousewheel", MouseWheelHandler)
  }
}

})