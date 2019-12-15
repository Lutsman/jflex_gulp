DEPENDENCIES
- jquery 1.7+

USAGE

Jflex

example:
``` html
<a href="#" class="ml5 big js__jtooltip js__jtooltip-s_white" data-jtooltip-title="всплывающая подсказка">tooltip s_default</a>
```
Position
- positionTop: 'js__jtooltip-t',
- positionRight: 'js__jtooltip-r',
- positionBottom: 'js__jtooltip-b',
- positionleft: 'js__jtooltip-l'

old version still working
- class - 'js__jtooltip' - vertical position
- class - 'js__jtooltip-horizontal' - horizontal position

Custom class
- class - 'js__jtooltip-s_customClassName' - adding class to tooltip wrapper


Javascript

```javascript
$('element').jTooltip({
  position: 'horizontal'
});
```

OPTIONS

- position: 'vertical' // string, values: 'vertical', 'horizontal', default 'vertical'
- extraMargin: 5 // int, length between tooltip and element in px, default 5
- showAnimation: 'fade', // string, values: 'simple', 'fade', 'slide', default 'fade', 
- hideAnimation: 'fade', // string, values: 'simple', 'fade', 'slide', default 'fade'
- showAnimationSpeed: 400, // int, animation speed
- hideAnimationSpeed: 400 // int, animation speed

EVENTS

- beforeOpenEvent = 'jTooltip:beforeOpen';
- afterOpenEvent = 'jTooltip:afterOpen';
- beforeCloseEvent = 'jTooltip:beforeClose';
- afterCloseEvent = 'jTooltip:afterClose';

events triggered on element

arguments 
- event - jquery event, 
- tooltip - jquery obj, 
- controller - object

TEMPLATE
``` html
<div class="jtooltip">
  <div class="jtooltip-arrow"></div>
  <div class="jtooltip-inner">Content</div>
</div>
```

METHODS

- getSelf - no arguments, return controller

example:

```javascript
var $el = $('.some-element-parent').jTooltip(); 
var jTooltip = $el.jTooltip('getSelf');
jtooltip.addTooltip();
jtooltip.removeTooltip();
```