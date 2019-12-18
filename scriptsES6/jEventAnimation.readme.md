DEPENDENCIES
- jquery 1.7+

USAGE

Jflex

example:
``` html
<span class="js__jeventanimation js__jeventanimation-number">5000</span>
<span class="js__jeventanimation slideDown">Hello!</span>
```

Javascript

```javascript
$('element').jEventAnimation();
```

OPTIONS
- js__jeventanimation-infinite - class, animate element on every showing
- js__jeventanimation-number - class, animate number
- data-animation-delay - attribute, int, seconds, animation delay
- data-animation-speed - attribute, int, seconds, animation speed

EVENTS (firing by object)
- refreshStart: 'jEventAnimation:refreshStart',
- inView: 'jEventAnimation:inView',
- inViewFirstTime: 'jEventAnimation:inViewFirstTime',
- outOfView: 'jEventAnimation:outOfView',
- outOfViewFirstTime: 'jEventAnimation:outOfViewFirstTime',
- animateStart: 'jEventAnimation:animateStart',
- animateEnd: 'jEventAnimation:animateEnd'

events firing on element

arguments 
- event - jquery event, 
- el - dom element, 
- controller - object

example:

```javascript
var $el = $('.some-element').jEventAnimation();

$('body').on('jEventAnimation:animateStart', function(event, el, controller) {
    //do something
});
```

EVENTS (firing by user)
- refresh: 'jEventAnimation:refreshEl'

example:
```javascript
var $el = $('.some-element').jEventAnimation(); 
$el.trigger('jEventAnimation:refreshEl');
```

METHODS
- addElement
- removeElement
- stop - no arguments, stop controller
- start - no arguments, start controller (after stop, it is not init)
- destroy - no arguments, destroy controller
- getSelf - no arguments, return controller
- addJsAnimation - animation object, default object is
```javascript
{
    name: '',
    hideOnStart: false,
    speed: 200,
    method: function (element, speed) {

    }
}
```

example:

```javascript
var $el = $('.some-element').jEventAnimation(); 
var jEventAnimation = $el.jEventAnimation('getSelf');
jAnimator.stop();
jAnimator.start();
jAnimator.removeElement($el);
```