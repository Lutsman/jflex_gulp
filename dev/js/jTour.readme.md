**DEPENDENCIES**
- jquery 1.7+
- jTooltip.js
- cookie.js

**USAGE**

example:

```javascript
var options = {
      steps: [
        {
          element: '.js__jtour-step1',
          title: 'step 1',
          content: 'some bla-bla-bla'
        },
        {
          element: '.js__jtour-step2',
          title: 'step 2',
          content: 'some bla-bla-bla'
        },
        {
          element: '.js__jtour-step3',
          title: 'step 3',
          content: 'some bla-bla-bla'
        }
      ]
    };
var tour = $.jTour(options);
var $startBtn = $('.start-tour');

$startBtn.on('click', function () {
  tour.start();
});
````


**OPTIONS**

- steps, steps array
    - path: '' // string; path
    - element: '' // string, jquery object, dom element; 
    - animateType: 'simple' //string; animation type; 'simple', 'highlight';
    - tooltipPos: 'top' // string; tooltip position relative to element; 'top', 'right', 'bottom', 'left';
    - title: '', // string, dom element, jquery object; tooltip title;
    - content: '' // string, dom element, jquery object; tooltip content;
- name || 'tour' // string; tour name
- isMenu || false // boolean; adding tour menu to page
- menuContainer || document.body // string, jq object, dom element; menu parent;
- addMenuMethod || null // function
- removeMenuMethod || null // function
- triggeredEl || document.body // element for triggering events
- tooltipOptions || {} // object; tooltip options

**EVENTS**

events triggered on body

- tourStart: 'jTour:tourStart', arguments (event - jquery event; controller - tour object)
- tourStop: 'jTour:tourStop', arguments (event - jquery event; controller - tour object)
- tourReset: 'jTour:tourReset', arguments (event - jquery event; controller - tour object)
- tourGoNextPage: 'jTour:tourGoNextPage',  arguments (event - jquery event; path - next page path, string; controller - tour object)
- stepBeforeStart: 'jTour:stepBeforeStart', arguments (event - jquery event; step - step object; controller - tour object)
- stepAfterStart: 'jTour:stepAfterStart', arguments (event - jquery event; step - step object; controller - tour object)
- stepBeforeEnd: 'jTour:stepBeforeEnd', arguments (event - jquery event; step - step object; controller - tour object)
- stepAfterEnd: 'jTour:stepAfterEnd', arguments (event - jquery event; step - step object; controller - tour object)
- menuBeforeSwitch: 'jTour:menuBeforeSwitch', arguments (event - jquery event; controller - tour object)
- menuAfterSwitch: 'jTour:menuAfterSwitch' arguments (event - jquery event; controller - tour object)



**METHODS**

- stop - no arguments; stop tour, remove menu if has tour menu;
- start - no arguments; start tour, create menu if has tour menu;
- reset - no arguments; reset tour;


example:

```javascript
var jTour = $.jTour(options); 
jTour.start();
jTour.stop();
```