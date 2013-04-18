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
  position: 'fixed',
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
    a.state = 'inFocus'
  }    
  a.afterBottomSwipeRev = function(){
    a.css({position:'fixed'})
    a.state = 'atBottom'
  } 
  a.bottomSwipe = new TimelineMax({paused:true})
  a.bottomSwipe.to(a, 0.5, { top:0, rotation: 0, left: doc.width()/2 - a.width()/2, onComplete: a.afterBottomSwipe, onReverseComplete: a.afterBottomSwipeRev })


  /* top animation */
  a.afterTopSwipe = function(){
    a.css({position:'fixed'})
    a.state = 'atTop'
  }
  a.afterTopSwipeRev = function(){
    a.css({position:'absolute'})
    container.scrollTop(a.height())
    a.state = 'inFocus'
  }
  a.onTopStart = function(){
    a.css({position:'absolute'})
    container.scrollTop(a.height())
  }
  a.topSwipe = new TimelineMax({paused: true})
  a.topSwipe.to(a, 5, { top: -a.height()-500, rotation: 30 , onStart: a.onTopStart ,onComplete: a.afterTopSwipe, onReverseComplete: a.afterTopSwipeRev })
}

/*------- attaching scatter -------*/
$.each(items, function( index , item){
  scatter(item)
})
  
var item;

function MouseWheelHandler(event){
  if (!item){
    item = items[0]
  }  
  var e = window.event || e;
  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));  
  
  console.log(item.state) 
  console.log(delta)

  console.log(container.scrollTop())
  if ((item.outerHeight() - container.outerHeight() -  container.scrollTop()) === 1){
    item.state = 'doneScrolling'
  }
  //scrolling down
  if (delta === -1){
    console.log('scrolling down')
    switch(item.state){
      case 'atBottom': 
        item.bottomSwipe.play()
      break; 
      
      case 'inFocus':
      
      break;
      
      case 'doneScrolling':
        item.topSwipe.play()
      break;
    }
  }
  else {
    console.log('scrolling up')
    switch(item.state){
      case 'atBottom': 
        item.bottomSwipe.reverse()
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
if (doc[0].addEventListener) {
    doc[0].addEventListener("mousewheel", MouseWheelHandler, false)
    doc[0].addEventListener("DOMMouseScroll", MouseWheelHandler, false)
  }
else {
    doc[0].attachEvent("onmousewheel", MouseWheelHandler)
}
  
})