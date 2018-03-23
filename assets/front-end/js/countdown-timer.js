(function ($) {

	'use strict';

	/**
	 * CountDownTimer class
	 */
	var CountDownTimer = (function () {

		/**
		 * CountDownTimer class constructor.
		 *
		 * @since 1.0.0
		 *
		 * @param {object} settings     Configuration options.
		 * @class
		 */
		function CountDownTimer(settings) {

			/**
			 * jQuery reference to the DOM Node we add this timer to.
			 *
			 * @since 1.0.0
			 * @type {jQuery}
			 */
			this.$mountNode = settings.$mountNode;

			/**
			 * Unique ID of this widget instance.
			 *
			 * @since 1.0.0
			 * @type {string}
			 */
			this.instanceID = settings.instanceID;

			/**
			 * Text displayed when countdown finishes.
			 *
			 * @since 1.0.0
			 * @type {string}
			 */
			this.expiredText = settings.expiredText;

			/**
			 * UNIX timestamp in milliseconds of the date the countdown is set to expire.
			 *
			 * @since 1.0.0
			 * @type {(number|string)}
			 */
			this.targetDate = settings.endDate;

			// Countdown container element.
			this.$countDownBox = null;

			// Elements that hold remaining time numbers.
			this.$numberDays = null;
			this.$numberHours = null;
			this.$numberMinutes = null;
			this.$numberSeconds = null;

			// Time remaining.
			this.days = undefined;
			this.hours = undefined;
			this.minutes = undefined;
			this.seconds = undefined;

		}

		/************************
		 * Prototype Properties *
		 ************************/

		// Time Bases in Milliseconds
		CountDownTimer.prototype._second = 1000;
		CountDownTimer.prototype._minute = 60000;
		CountDownTimer.prototype._hour = 3600000;
		CountDownTimer.prototype._day = 86400000;

		/***********************
		 *  Prototype Methods  *
		 ***********************/

		/**
		 * Starts the countdown widget instance.
		 *
		 * Renders the countdown widget to the DOM and starts the countdown.
		 *
		 * @since 2.0.0
		 *
		 * @see CountDownTimer.render
		 * @see CountDownTimer.calculateRemaining
		 * @see CountDownTimer.numberTransition
		 * @see CountDownTimer.showRemainingTime
		 *
		 * @return {number} `intervalID` of the timer or `0` if the timer already expired.
		 */
		CountDownTimer.prototype.start = function () {

			// Draw the timer
			this.render();

			// Set expired text if there's no time left
			if (this.calculateRemaining() < 0) {
				this.expireTimer();
				return 0;
			}

			// Animate the transition of the numbers from 0 to remaining value
			this.numberTransition(this.$numberDays, this.days);
			this.numberTransition(this.$numberHours, this.hours);
			this.numberTransition(this.$numberMinutes, this.minutes);
			this.numberTransition(this.$numberSeconds, this.seconds);

			// Reference to calling class
			var self = this;
			// Set the countdown to run every second and return `intervalID` for this timer.
			return this.timer = setInterval(function () {
				self.showRemainingTime();
			}, 1000);
		};

		/**
		 * Animates the number inside an element from it's value to the value of `endPoint`.
		 *
		 * @since 2.0.0
		 *
		 * @param {jQuery} $element - jQuery object to animate.
		 * @param {(number|string)} endPoint - Timestamp the animation will move toward.
		 * @param {(number|string)} [transitionDuration=2000] - Number of milliseconds the animation will run for.
		 */
		CountDownTimer.prototype.numberTransition = function ($element, endPoint, transitionDuration) {
			// Transition numbers from 0 to the final number
			$({numberCount: $element.text()}).animate({numberCount: endPoint}, {
				duration: transitionDuration || 2000,
				step: function () {
					$element.text(Math.floor(this.numberCount));
				},
				complete: function () {
					$element.text(this.numberCount);
				}
			});
		};

		/**
		 * Calculates, updates, and returns time remaining until expiration.
		 *
		 * Calculates time left in the countdown,
		 * Updates the days, hours, minutes, and seconds class properties with the remaining values;
		 * Returns the amount of time left.
		 *
		 * @since 2.0.0
		 *
		 * @returns {number} UNIX time in milliseconds remaining until expiration.
		 */
		CountDownTimer.prototype.calculateRemaining = function () {
			// Time left until countdown expires
			var timeRemaining = this.targetDate - new Date();

			this.days = Math.floor(timeRemaining / this._day);
			this.hours = Math.floor((timeRemaining % this._day) / this._hour);
			this.minutes = Math.floor((timeRemaining % this._hour) / this._minute);
			this.seconds = Math.floor((timeRemaining % this._minute) / this._second);

			return timeRemaining;
		};

		/**
		 * Updates DOM nodes with remaining time or expiration message.
		 *
		 * DOM nodes containing days, hours, minutes, and seconds are updated
		 * with time remaining or the countdown container's child nodes are
		 * replaced with the expiration text if the timer expired.
		 *
		 * @since 2.0.0
		 *
		 * @see CountDownTimer.calculateRemaining
		 */
		CountDownTimer.prototype.showRemainingTime = function () {

			// Check if there is still time left before the countdown expires
			if (this.calculateRemaining() > 0) {
				// There is still time left
				// Update the displayed numbers
				this.$numberDays.text(this.days);
				this.$numberHours.text(this.hours);
				this.$numberMinutes.text(this.minutes);
				this.$numberSeconds.text(this.seconds);

			}
		};

		/**
		 * Stops execution of a timer and replaces the displayed count with optional text.
		 *
		 * @since 2.0.0
		 *
		 * @param {number} [timer=this.timer] - Optional `intervalID` returned from `setInterval()` to clear.
		 * @param {(string|false)} [displayText=this.expiredText] - Text to replace numbers shown or `false` for no text.
		 */
		CountDownTimer.prototype.expireTimer = function (timer, displayText) {
			// If `timer` is null or undefined `timerID === this.timer`
			var timerID = (null == timer) ? this.timer : timer;
			// If `displayText` is null or undefined `text === this.expiredText`.
			var text = (null == displayText) ? this.expiredText : displayText;

			// Stop updating the timer.
			clearInterval(timerID);

			// Replace numbers displayed with `text` if not falsey.
			if (text) {
				this.$countDownBox.html('<h4 class="dscw-countdown-expired-text">' + text + '</h4>');
			}
		};

		/**
		 * Draws the timer.
		 *
		 * Draws the timer container element and it's children, assigns each element
		 * an id attribute based on the widget instance id and in and sets the
		 * $numberDays, $numberHours, $numberMinutes, and $numberSeconds class properties
		 * to jQuery objects referencing the DOM nodes containing the reaming time number.
		 *
		 * @since 2.0.0
		 */
		CountDownTimer.prototype.render = function () {

			// ID strings for created HTML elements
			var timerID = this.instanceID + '-countdown';
			var daysID = this.instanceID + '-days';
			var hoursID = this.instanceID + '-hours';
			var minutesID = this.instanceID + '-minutes';
			var secondsID = this.instanceID + '-seconds';

			// Create and mount the container
			this.$countDownBox = $('<div/>', {
				id: timerID,
				class: 'dscw-countdown-timer-box-container'
			}).appendTo(this.$mountNode);

			this.$countDownBox.html('' +
				'<ul class="dscw-countdown-timer-box">' +
				'    <li class="dscw-countdown-timer-box-items dscw-countdown-days">' +
				'       <div id="' + daysID + '" class="dscw-countdown-number">00</div>' +
				'       <div class="dscw-countdown-label">Days</div>' +
				'   </li>' +
				'    <li class="dscw-countdown-timer-box-items dscw-countdown-hours">' +
				'       <div id="' + hoursID + '" class="dscw-countdown-number">00</div>' +
				'       <div class=" dscw-countdown-label">Hours</div>' +
				'   </li>' +
				'    <li class="dscw-countdown-timer-box-items dscw-countdown-minutes">' +
				'       <div id="' + minutesID + '" class="dscw-countdown-number">00</div>' +
				'       <div class=" dscw-countdown-label">Minutes</div>' +
				'   </li>' +
				'    <li class="dscw-countdown-timer-box-items dscw-countdown-seconds">' +
				'       <div id="' + secondsID + '" class="dscw-countdown-number">00</div>' +
				'       <div class=" dscw-countdown-label">Seconds</div>' +
				'   </li>' +
				'</ul>'
			);

			// Assign jQuery objects representing each element holding a number.
			this.$numberDays = $('#' + daysID);
			this.$numberHours = $('#' + hoursID);
			this.$numberMinutes = $('#' + minutesID);
			this.$numberSeconds = $('#' + secondsID);
		};

		// Return CountDownTimer class.
		return CountDownTimer;
	})();

	/**
	 * Instantiate and start all countdowns on the page.
	 */
	$(document).ready(function () {
		// Get all instances of the countdown widget on the page
		var countdown = $('.dscw-countdown-instance');

		// Loop over each instance and set it's countdown clock
		countdown.each(function () {
			var instanceID = $(this).data('instance');
			var settings = {
				instanceID: instanceID,
				endDate: $(this).data('end-date'),
				expiredText: $(this).data('expired-text'),
				$mountNode: $('#timer-mount-' + instanceID)
			};
			new CountDownTimer(settings).start();
		});
	});
})(jQuery);
