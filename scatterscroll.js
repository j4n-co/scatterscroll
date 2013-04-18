$(document).ready(function(){
  
/*------- get the DOM items -------*/
var doc = $(window)
var body = $('body')
var docH = $(window).height()
var items = []
var posts = $('.post.group')
var container = $('#container')


/*------- default page styles (should eventually be moved to a CSS file) -------*/
$('#header, #sidebar').css({position: 'fixed'})
$('html, body').css({
  height: '100%',
  overflow: 'hidden'
})
$('#container').css({
  position: 'absolute',
  width: '100%',
  height: '100%', 
  overflow: 'scroll',
  padding: 0
})
$('.post.group').css({
  'padding-bottom': '20%'
})


/*------- drop the Items -------*/
var dropItems = function(item){
    var a = $(item)
    var left = Math.random()*500 + (doc.width()/2 - a.width())
    var top = docH -50
    var deg = Math.random(360)*100    
    a.x = a.offset().top

    a.css({ 
      position: 'fixed',
      left:left,
      top: top,
      WebkitTransform: 'rotate('+deg+'deg)'    
    })
    
    a.state = 'atBottom'
    items.push(a)
}

/*------- attach the dropItems and push them into the array-------*/
$.each(posts, function( index , item){
  dropItems(item)
})


/*------- scatter -------*/
var scatter = function(a){

  /* bottom animation */
  a.afterBottomSwipe = function(){
    a.css({position:'absolute'})
    bindMouseScroll()  
    a.state = 'inFocus'
  }    
  a.afterBottomSwipeRev = function(){
    a.css({position:'fixed'})
    a.state = 'atBottom'
    bindMouseScroll()
  } 
  a.bottomSwipe = new TimelineMax({paused:true})
  a.bottomSwipe.to(a, 0.5, { top:0, rotation: 0, left: doc.width()/2 - a.width()/2, onStart: unbindMouseScroll, onComplete: a.afterBottomSwipe, onReverseComplete: a.afterBottomSwipeRev })


  /* top animation */
  a.afterTopSwipe = function(){
    a.css({position:'fixed', top: a.offset().top})
    a.state = 'atTop'
    bindMouseScroll()
  }
  a.afterTopSwipeRev = function(){
    a.css({position:'absolute', top:'0'})
    container.scrollTop(a.height())
    a.state = 'inFocus'
    bindMouseScroll()
  }

  a.onTopStart = function(){
    a.css({position:'fixed', top: a.offset().top })
    bindMouseScroll()
  }

  a.topSwipe = new TimelineMax({paused: true})
  a.topSwipe.to(a, 0.5, { rotation: 30 , onStart: a.onTopStart,onComplete: a.afterTopSwipe, onReverseComplete: a.afterTopSwipeRev })
}

/*------- attaching scatter -------*/
$.each(items, function( index , item){
  scatter(item)
})
  
var item;
var itemIndex; 
function MouseWheelHandler(event){
  
  if (!item){
    itemIndex = 0
    item = items[itemIndex]
  }  
  var e = window.event || e;
  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));  
  
  console.log(item.state) 
  console.log(delta)

  console.log(container.scrollTop())

  //scrolling down
  if (delta === -1){
    console.log('scrolling down')
    switch(item.state){
      case 'atBottom': 
        item.bottomSwipe.play()
      break; 
      
      case 'inFocus':
        if ((item.outerHeight() - container.outerHeight() -  container.scrollTop()) < 10){
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
        console.log(itemIndex)
        console.log('######itemIndex#########')
        item = items[itemIndex]
      break;
    }
  }
  else {
    console.log('scrolling up')
    switch(item.state){
      case 'atBottom': 
        item.bottomSwipe.reverse()
        itemIndex -= 1
        item = items[itemIndex]
      break; 
      
      case 'inFocus':
        if(container.scrollTop() === 0 ){
          item.bottomSwipe.reverse()
        } 
      break;
      
      case 'atTop':
        item.topSwipe.reverse()
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
  if (doc[0].removeEventListener) {
      doc[0].removeEventListener("mousewheel", MouseWheelHandler, false)
      doc[0].removeEventListener("DOMMouseScroll", MouseWheelHandler, false)
    }
  else {
      doc[0].detachEvent("onmousewheel", MouseWheelHandler)
  }
}

})