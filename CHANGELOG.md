# 2.0.0

Version 2 is a major release. Please be sure to test this version in a development
or staging environment and take a backup before upgrading.

### New:
* There is now an option to set a minimal theme that styles the widget. Only two basic themes are included for now, a light theme and a dark theme.
* Added `CountDownTimer.start()` method for drawing and starting the timer.
* Return the timer's `intervalID` from `start()` method or `0` if the timer is already expired.
* Animate number the transition of numbers to from 0 to their starting postions.
* Gulp is now used to pre-proccess all assets (images, JS, CSS).
  - Gulp task don't need to be run directly, instead refer to scripts in `package.json`.
* Filter hook for modifying the available theme options.
* Filter hook for modifying the default selected theme.
* Filter hook for modifying the timer's primary HTML container class attribute.
* Action hook at the beginning of the widget's render method (useful for enqueuing scripts/styles). 
* Adds `DSCW_VERSION` constant containing the current plugin version. 
* TravisCI is used to verify JS, CSS and PHP passes all lint rules.
* Add `font-size: 16px;` to `.dscw-countdown-instance`.
* Add `font-size` properties to nested `h3` and `h4` elements defined in `em`s.
* Add prototype methods to validate mount node and
instance ids.
* `expiredText` defaults to empty string.
* `targetDate` defaults to 0.
* Add `400px` `max-width` and `auto` left and right margins on the widget output. This is intended to stay sane looking in very wide widget areas.

### Changed:
* Renamed `countdown-widget.php` to `class-dead-simple-countdown-widget.php`.
* WordPress & Wordpress.com VIP coding standards are now used.
* The countdown box's `.dscw-countdown-timer-box-wrapper` CSS class is now `.dscw-countdown-timer-box-container`.
* Replaced `<p>` tags with `<div>`s in settings form.
* Many `CountDownTimer` instance properties have been renamed.
*  `CountDownTimer` instance property assignment has been moved into the constructor.
* Moved logic to expire the timer into it's own method.
* `countdown-timer.js` gets wrapped in IIFE at build time because Babel adds `use strict;` globally and we don't want to step on other plugin/theme code.
* No longer aliasing `jQuery`. Instead it's used directly.
* Remaining times in `CountDownTimer` are initialized to 0 instead of undefined.
* Rename $theme_class to $container_class in widget's render method.
* Theme options are now stored in an array and html is built in a `foreach()` loop after passing through a filter hook.
* Replace JSHint with ESLint.
* Update `.dscw-countdown-timer-box`'s `font-weight` value to `600` instead of `bold` in CSS.


### Fixed:

* Use "late escaping" on HTML & HTML attributes to conform with WP/WP.com VIP coding standards.
* Query UI Datepicker theme was updated to include missing icon images.
* Margins on the countdown box, widget title, and countdown box items (numbers) have been changed to prevent opinionated themes from breaking the basic layout.
* Add missing semicolon to the end of `countdown.each()` loop.
* Use `Date.now()` instead of `new Date` when calculating remaining time.
* Use jQuery's `.attr()` instead of `.data()` to read instance settings from rendered widget HTML. The former does not try to guess data types.



### Performance:
* `CountDownTimer` methods have been moved into class prototype.
* Assets are now minified.
* Images are minified in production.
* `CountDownTimer.prototype.showRemainingTime` now only updates a node's text if it has changed since last draw.
