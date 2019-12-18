DEPENDENCIES
- jquery 1.7+

USAGE

Jflex

simple
- container class = 'js__equal'
- element class = none

selected elements, single group
- container class = 'js__equal-select'
- element class = 'js__equal-child'

selected elements, multiple groups
- container class = 'js__equal-select-mult'
- element class = 'js__equal-child-1', 'js__equal-child-2', 'js__equal-child-3'


Javascript

simple
```javascript
$('.some-element-parent').jEqualSize();
```

selected elements

```javascript
$('.some-element-parent').jEqualSize({
  children: '.some-children-selector' 
});
```

multiple groups selected elements

```javascript
$('.some-element-parent').jEqualSize({
  children: ['.some-children-selector-1', '.some-children-selector-2', '.some-children-selector-3']
});
```


OPTIONS

children: '.some-children-selector' // string, array of strings: children elements

METHODS

- stop - stops working controller, no arguments, nothing returns
- run - restart working controller, no arguments, nothing returns
- oneRun - single run controller, no arguments, nothing returns
- addChildren - include children selector to group, arguments:
    - children === string, children selectors
    - index === integrer, default 0, index of children group, using only with multiple groups
- removeChildren - exclude children selector from group, arguments:
    - children === string, children selectors
    - index === integrer, default 0, index of children group, using only with multiple groups
- getSelf - no arguments, return controller

example:

```javascript
var $el = $('.some-element-parent').jEqualSize();
var equal = $el.jEqualSize('getSelf');
equal.stop();
equal.run();
```


