Meteor Hovercard
================

Simple, reactive hovercards for Meteor inspired by Facebook hovercards.

[Demo](https://hovercard-demo.meteor.com)
[Demo code](https://github.com/gwendall/meteor-hovercard-demo)

Installation
------------

``` sh
meteor add gwendall:hovercard
```

How to
-------

Simply wrap the element that should trigger an hovercard with an {{#hovercard}} Spacebars block.
``` html
{{#hovercard template="someTemplate" direction="horizontal" trigger="hover"}}
  <a href="#">A wild hovercard appears on hover!</a>
{{/hovercard}}
```

Options
-----

Pass those options as parameters to the {{#hovercard}} block.  


Option | Type | Default | Values | Description
----|------|----|----|----
template | string | null | * | The template that will be used in the hovercard
data | * | Blaze data context | * | The data that will be passed to the hovercard template (if not specified, the Blaze data context of the triggering element will be passed)
direction | string | vertical | vertical \| horizontal | Whether the hovercard should be displayed horizontally (on the left / right of the element) or vertically (top / bottom)
trigger | string | hover | hover \| click |The action upon which the hovercard appears

Notes
-----

- It automatically takes care of the positioning of the overlay, so that it doesn't show out of the viewport
- For the sake of laziness, some CSS code for the hovercard was taken from Bootstrap popover's
