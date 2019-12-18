**DEPENDENCIES**
- jquery 1.7+
- jTooltip.js
- cookie.js
- jTour.js

**USAGE**

example:

```javascript
    var tours = [
      {
        name: 'tour_1',
        title: 'Интернет-магазин на основе dropshipping-процессов',
        steps: [
          {
            element: '.js__jtour-step5',
            title: 'step 4',
            content: 'some bla-bla-bla',
            path: '/jflex/test.html'
          },
          {
            element: '.js__jtour-step3',
            title: 'step 3',
            content: 'some bla-bla-bla',
            path: '/jflex/test2.html'
          },
          {
            element: '.js__jtour-step2',
            title: 'step 2',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step4',
            title: 'step 4',
            content: 'some bla-bla-bla',
            animateType: 'highlight'
          },
          {
            element: '.js__jtour-step1',
            title: 'step 1',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step7',
            title: 'step 7',
            content: 'some bla-bla-bla',
            path: '/jflex/test3.html'
          }
        ]
      },
      {
        name: 'tour_2',
        title: 'Интернет-магазин на основе классического построения',
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
          },
          {
            element: '.js__jtour-step4',
            title: 'step 4',
            content: 'some bla-bla-bla',
            animateType: 'highlight'
          },
          {
            element: '.js__jtour-step5',
            title: 'step 5',
            content: 'some bla-bla-bla',
            path: '/review/master/test.html'
          }
        ]
      }
    ];
    var steps = [
      {
        element: '.js__jtour-step1',
        title: 'step 1',
        tag: 'Функциональные опции интернет-магазина',
        content: 'some bla-bla-bla'
      },
      {
        element: '.js__jtour-step2',
        title: 'step 2',
        tag: 'Функциональные опции интернет-магазина',
        content: 'some bla-bla-bla'
      },
      {
        element: '.js__jtour-step3',
        title: 'step 3',
        tag: 'Функциональные опции интернет-магазина',
        content: 'some bla-bla-bla'
      }
    ];
    var options = {
      tours: tours,
      steps: steps,
      autostart: true,
      autostartPath: '/test2.html',
      autostartCondition: 'new',
      layoutContainer: '#hidden',
      defaultTourOptions: {
        isMenu: true,
        menuContainer: '.admin-menu',
        addMenuMethod: function(menu) {
          var menuContainerTpl =
                '<div class="admin-menu">' +
                  '<button  class="btn_back btn small simple icon icon-uniE7DC">назад</button>' +
                  '<div class="title">Настройка системы</div>' +
                '</div>';
          var $container = $(menuContainerTpl);

          $container
            .append(menu)
            .appendTo($('body'));
        },
        removeMenuMethod: function(menu, container) {
          var $container = $(container);
          $container.remove();
        }
      }
    };
    var tourMaster = $.jTourMaster(options);
    var $startBtn = $('.js__tour-master-start');
    
    $startBtn.on('click', function (e) {
      e.preventDefault();

      tourMaster.start();
    });
```    

**OPTIONS**

- tours: // object; jtour options 
- steps: // object; jtour step options 
- defaultTourOptions: {isMenu: true} // object; jtour options, used like default options for tours
- customTourOptions: {name: 'custom-tour', isMenu: true} // object; jtour options, used like default options for custom tour compiled from steps steps
- autostart: false // boolean; autostart tourmaster
- autostartPath: '' // string; some page path without domain, example: https://gitlab.com/alphacrew/jflex/index.html will be /alphacrew/jflex/index.html
- autostartCondition: 'none' // string; values: 'none' - none, 'new' - new user relative current page
- autostartConditionFunc: null // function; arguments: controller; return boolean; if have autostartConditionFunction, autostartCondition ignoring
- layoutContainer: document.body // string, dom element, jquery object; dom element parent for layout;


**METHODS**
- stop - no arguments; stop tourmaster;
- start - no arguments; start tourmaster;
- startTourByName - tourName: string; start tour by tourName;
- getTourByName - tourName: string; return tour options by tourName;

example:
``` javascript
var tourMaster = $.jTourMaster(options);

tourMaster.startTourByName('tour name');
tourMaster.stop();
```

**TEMPLATE**

```
    popup1: `<div id="tour-master__popup-1" class="tour-master__popup-1 tour__popup center">
                <a href="/" class="flex__logo">
                    <img src="jflex/img/tour_logo.png" alt="Flex">
                </a>
                <h2 class="mv30">Мастер настройки</h2>
                <div class="small lh20">Начните с простой пошаговой настройки системы.</div>
                <div class="mb80 small lh20">Следуйте подсказкам интерактивного момощника.</div>
                <button class="btn_start btn small simple icon icon-triangle-right" data-show-popup=".tour-master__popup-2">Начать настройку</button>
                <a href="#" class="btn_skip js__jbox-close">пропустить настройку</a>
                <a href="#" class="educational-center__link icon icon-uniE7D3">Учебный центр</a>
                <a href="/" class="jeto__logo"><img class="retina" src="jflex/img/jeto-logo.png" alt="jeto"></a>
            </div>`,
    popup2: `<div id="tour-master__popup-2" class="tour-master__popup-2 tour__popup">
        <h2 class="mb30">Варианты настройки Flex</h2>
        
        <div class="marker blue mb50">
          <div class="row sp-20">
            <div class="col d6 m12">
              <h3 class="icon icon-uniE611">
                Шаблоны
                <br>
                процессов
              </h3>
              <div class="mb40 smaller lh20">Выберите, что бы выстроить процессы на основе шаблонов эффективных стандартов.</div>
              <button class="btn small simple" data-show-popup=".tour-master__popup-3">выбрать</button>
            </div>
    
            <div class="col d6 m12">
              <h3 class="icon icon-uniE62E">
                Собственные
                <br>
                процессы
              </h3>
              <div class="mb40 smaller lh20">Выберите, что бы настроить систему под действующие бизнес-процессы и структуру организации.</div>
              <button class="btn small simple" data-show-popup=".tour-master__popup-4">выбрать</button>
            </div>
    
          </div>
        </div>
    
        <a href="#" class="educational-center__link icon icon-uniE7D3">Учебный центр</a>
        <a href="/" class="jeto__logo"><img class="retina" src="jflex/img/jeto-logo.png" alt="jeto"></a>
      </div>`,
    popup3: `<div id="tour-master__popup-3" class="tour-master__popup-3 tour__popup">
        <button  class="btn_back btn small simple icon icon-uniE7DC"  data-show-popup=".tour-master__popup-2">назад</button>
        <h2 class="mb30">Выберите шаблон процессов</h2>
    
        <div class="marker blue mb50">
          <div class="process-lenks mt20 mb70">
            {{#each tours as |tour|}}
                <a href="#" data-start-tour="{{tour.name}}">{{tour.title}}</a>
            {{/each}}
          </div>
    
          <a href="#" class="btn_skip js__jbox-close">пропустить настройку</a>
    
        </div>
    
        <a href="#" class="educational-center__link icon icon-uniE7D3">Учебный центр</a>
        <a href="/" class="jeto__logo"><img class="retina" src="tmp/jeto-logo.png" alt="jeto"></a>
      </div>`,
    popup4: `<div id="tour-master__popup-4" class="tour-master__popup-4 tour__popup">
        <button  class="btn_back btn small simple icon icon-uniE7DC"  data-show-popup=".tour-master__popup-2">назад</button>
        <h2 class="mb30">Выберите опции процессов</h2>
    
        <div class="marker blue mb30">
          <div class="custom-template-form__wrap mt20">
            <form action="post" id="custom-template-form" class="custom-template-form">
              {{#each groupSteps as |groupStep|}}
                <div class="title">{{this.title}}</div>
                <div class="form-item">
                  {{#each ../steps as |step|}}
                    {{#ifCond step.tag '===' groupStep.title}}
                      <input id="template-checkbox-{{@index}}" type="checkbox" name="custom-template" value="{{@index}}">
                      <label for="template-checkbox-{{@index}}">{{step.title}}</label>
                    {{/ifCond}}
                  {{/each}}
                </div>
              {{/each}}
            
              <button type="submit" class="btn_start btn small simple icon icon-triangle-right">Начать настройку</button>
            </form>
          </div>
          
          <a href="#" class="btn_skip js__jbox-close">пропустить настройку</a>
    
        </div>
    
        <a href="#" class="educational-center__link icon icon-uniE7D3">Учебный центр</a>
        <a href="/" class="jeto__logo"><img class="retina" src="tmp/jeto-logo.png" alt="jeto"></a>
      </div>`
```