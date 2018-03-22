(function ($) {

    'use strict';

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
            this.$mountPoint = settings.$mountPoint;

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
            this.end = settings.endDate;

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
         * @see CountDownTimer.showRemainingTime
         */
        CountDownTimer.prototype.start = function () {
            // Reference to calling class
            var self = this;

            // Draw the timer
            this.render();

            this.timer = setInterval(function () {
                // Run the actual countdown until it expires
                self.showRemainingTime();
            }, 1000);
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
            var timeRemaining = this.end - new Date();

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

            } else {
                // The countdown expired. Stop future execution of this countdown.
                clearInterval(this.timer);
                // Set the expiration text and exit
                this.$countDownBox.html('<h4 class="dscw-countdown-expired-text">' + this.expiredText + '</h4>');
                // Finished
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
            }).appendTo(this.$mountPoint);

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

    $(document).ready(function () {
        // Get all instances of the countdown widget on the page
        var countdown = $(".dscw-countdown-instance");

        // Loop over each instance and set it's countdown clock
        countdown.each(function () {
            var instanceID = $(this).data("instance");
            var settings = {
                instanceID: instanceID,
                endDate: $(this).data("end-date"),
                expiredText: $(this).data("expired-text"),
                $mountPoint: $('#timer-mount-' + instanceID)
            };
            new CountDownTimer(settings).start();
        })
    });
})(jQuery);
