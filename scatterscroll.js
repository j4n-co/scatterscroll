$(document).ready(function(){
  
var doc = $(window)
var body = $('body')
var docH = $(window).height()
var items = []

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

//scatter
$.each($('.post.group'), function( index , article){
      
    var a = $(article)
    var left = Math.random()*500 + (doc.width()/2 - a.width())
    var top = docH -50
    var deg = Math.random(360)*100
    
    a.x = a.offset().top
    
    a.afterBottomSwipe = function(){
      a.css({position:'absolute'})
      a.state = 'inFocus'
    }

    a.afterTopSwipe = function(){
      a.css({position:'fixed'})
      a.state = 'atTop'
    }

    a.bottomSwipe = new TimelineMax({paused:true})
    a.bottomSwipe.to(a, 0.5, { top:0, rotation: 0, left: doc.width()/2 - a.width()/2, onComplete: a.afterBottomSwipe })

    a.topSwipe = new TimelineMax({paused: true})
    a.topSwipe.to(a, 0.5, { top: -a.height()-500, rotation: 30 , onComplete: a.afterTopSwipe})
    
    a.state = 'atBottom'

 
    a.css({ 
      position: 'fixed',
      left:left,
      top: top,
      WebkitTransform: 'rotate('+deg+'deg)'     
    })
    
    items.push(a)
})
  
var item;

function MouseWheelHandler(event){
  
  if (!item){
    item = items[0]
  }  
  var e = window.event || e;
  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));  
      console.log(item.state) 

  if ((item.outerHeight() - $('#container').outerHeight() -  $('#container').scrollTop()) === 0){
    item.state = 'doneScrolling'
  }
  //scrolling down
  if (delta === -1){
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
    switch(item.state){
      case 'atBottom': 
        item.bottomSwipe.reverse()
      break; 
      
      case 'inFocus':
      
      break;
      
      case 'atTop':
        item.topSwipe.reverse()
      break;
    }    
  }
    /*
    //at end of article
    if( (item.outerHeight() - $('#container').outerHeight() -  $('#container').scrollTop()) === 0 ){
      //not hung yet
      if (item.topSwipe.progress() === 0 ) {
        //hange it up
        item.css({top: item.offset().top})
        item.css({position:'fixed'})
        item.topSwipe.play()
      } 
    } 
    //not at end of article
    else {
      //then its down, swipe from bottom to 
      item.bottomSwipe.play()
    }
    */
  //}
  //scrolling up
  /*
  else if (delta === 1){
    //
    if ( item.topSwipe.progress() === 1 ){
    }
  }
  */
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