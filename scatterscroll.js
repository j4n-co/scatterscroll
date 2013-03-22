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
  'padding-bottom': '50%'
})
//scatter
$.each($('.post.group'), function( index , article){
      
    var a = $(article)
    var left = Math.random()*500 + (doc.width()/2 - a.width())
    var top = docH -50
    var deg = Math.random(360)*100
    
    a.x = a.offset().top
    a.timeline = new TimelineMax({paused:true})
    a.timeline.to(a, 1, {top:0, rotation: 0, left: doc.width()/2 - a.width()/2 })

    a.ceiling = new TimelineMax({paused: true})
    a.ceiling.to(a, 1, { rotation: 30 })

    //initial position
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

  var speed = 0.03
  var progress = item.timeline.progress()
  var endProgress = item.ceiling.progress()

  //console.log('scrolltop:'+$('#container').scrollTop())
  //console.log('height:'+ (item.height() - (doc.height()/2) ) )
  //console.log(delta)
  if (progress === 1 && delta === -1 && $('#container').scrollTop() <= 0 ){
    //console.log('finished animation, scrolling down, at top of page')
    item.css({position: 'absolute', left: item.offset.left, top: 0})
  }

  else if (progress === 1 && delta === -1 && $('#container').scrollTop() > (item.height() - (doc.height()/2))  ) {
    //console.log('finished animation, scrolling down, not at top of page')
    var step = endProgress - (speed*delta)
    if (step < 0){
      step = 0.01
    }
    item.ceiling.progress(step)
    
  }

  else if (progress === 1 && delta === -1 && $('#container').scrollTop() > 0  ) {
    //console.log('finished animation, scrolling down, not at top of page')
    item.css({position: 'absolute', left: item.offset.left, top: 0})
  } 

  else if (progress === 1 && delta === 1 && $('#container').scrollTop() > 0 && $('#container').scrollTop() < (item.height() - (doc.height()/2)) ) {
     //console.log('finished animation, scrolling up, not at top of page')
     item.css({position: 'absolute', left: item.offset.left, top: 0})
 
  }

  else {
    //console.log('else')
    item.css({position: 'fixed'}) 
    var step = progress - (speed*delta)
    if (step < 0){
      step = 0.01
    }
      item.timeline.progress(step)
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