DEPENDENCIES
- jquery 1.7
- jBox
- simplebox (now attached to plugin)

USAGE

```javascript
$('.some-element').jPageEventLive({
  target: '.jbox-anchor',
  event: 'click',
  showAfter: '0 - 5, 10 - 15',
  priority: 2
});
```

OPTIONS

- target: null, //string, jQuery Object, image link: target block, using multiple selectors or objects only with simplebox
- event: null, /*string: native or custom events, multiple events allowed like 'click, hover, myCustomEvent',
            'none' event for autoplay usage, if no need to trigger play scenario againe */
- triggeredEvent: 'playScenario', // string: 'playScenario' triggered event name
- openingMethod: 'jBox', // string: 'simplebox', 'jBox'
- showAfter: 0, // string: '0 - 10, 20 - 30', timer cycles in minutes
- priority: 1, // integrer
- autoplay: false, //boolean: enable autoplay
- autoplayDelay: 0, // seconds
- delay: 0, // event triggering delay
- sessionId: Math.random(), //integrer: unique current session id
- userStatus: false, //string: 'new', 'old', false
- newUserGlobal: 'userInfoGlobal', //string: global (current website) user cookies name
- newUserPage: 'userInfoPage', //string: local (current page) user cookies name
- newUserStatus: 7, // integrer: days user is new
- newUserEntrance: 'page', // 'page', 'site'
- onShow: null, //function: callback on show
- onClose: null //function not used