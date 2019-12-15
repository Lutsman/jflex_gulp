Пояснения к скриптам

Checkbox toggler:
- назодится в admin.js
- вешаем на chekbox или его родитель
- класс `js__checkboxTogglerDelegated` 
- аттрибут `data-ctd-target` в него передаем селектор например: `data-ctd-target=".reminder-period, .reminder-interval"`
- аттрибут `data-ctd-checkbox` передаем селектор чекбокса, если аттрибут отсутсвует скрипт будет искать любой чекбокс 

класс на кнопку
.js__et мгновенно открыть/закрыть
.js__et-na ничего не делает навешивает на открытие и закрытие класс, бывают моменты когда по сути и открывать ничего не надо, все просиходит по класу на самом тогллере, кажется так работает корзина выезжающая сбоку
.js__et-fa анимация fade
.js__et-sla анимация slide

аттрибут на кнопку
data-et-target="some selector" цель что открывать

класс на кнопку
.js__et-p1
.js__et-na-p1 
.js__et-fa-p1
.js__et-sla-p1

все то же самое, но поиск цели ведется в родителе кнопки $togglerBtn.parent().find($togglerBtn.attr('data-et-target')


Toolip:
- добавить на елемент класс ".js__jtooltip"
- содержимое в аттрибут "data-jtooltip-title"

Slick:
- .js__slick на элемент, инициализация slick
- .js__slick-dots, включает точки
- data-slick-options, аттрибут, добавление опций 
```
'{
    "dots":true,
    "slidesToShow":4,
    "responsive":[
      {
        "breakpoint":1024,
        "settings":{
          "slidesToShow":3
        }
      },
      {
        "breakpoint":600,
        "settings":{
          "slidesToShow":2
        }
      },
      {
        "breakpoint":320,
        "settings":{
          "slidesToShow":1,
          "unslick": true
        }
      }
    ]
}'
```

EqualSize:
simple
- container class = 'js__equal'
- element class = none

selected elements, single group
- container class = 'js__equal-select'
- element class = 'js__equal-child'

selected elements, multiple groups
- container class = 'js__equal-select-mult'
- element class = 'js__equal-child-1', 'js__equal-child-2', 'js__equal-child-3'


jTooltip:

Position
- class - 'js__jtooltip' - vertical position
- class - 'js__jtooltip-horizontal' - horizontal position

Custom class
- class - 'js__jtooltip-s_customClassName' - adding class to tooltip wrapper
