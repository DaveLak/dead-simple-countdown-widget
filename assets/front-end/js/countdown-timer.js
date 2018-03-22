(function ($) {

    'use strict';

    /* CountDownTimer class  */
    var CountDownTimer = (function () {

        /* CountDownTimer constructor  */
        function CountDownTimer(settings) {

            // jQuery reference to the DOM Node we add this timer to
            this.$mountPoint = settings.$mountPoint;
            // Unique ID of this widget instance
            this.instanceID = settings.instanceID;
            // Text displayed when countdown finishes
            this.expiredText = settings.expiredText;
            // UNIX timestamp in milliseconds of the date the countdown is set to expire
            this.end = settings.endDate;

            // Initialize remaining time as undefined
            this.days = undefined;
            this.hours = undefined;
            this.minutes = undefined;
            this.seconds = undefined;

            // Initialize properties that will represent the elements holding numbers.
            this.$numberDays = null;
            this.$numberHours = null;
            this.$numberMinutes = null;
            this.$numberSeconds = null;

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

        // Calculate and update reaming days, hours, minutes, seconds until expiration
        CountDownTimer.prototype.calculateRemaining = function () {
            // Time left until countdown expires
            var timeRemaining = this.end - new Date();

            this.days = Math.floor(timeRemaining / this._day);
            this.hours = Math.floor((timeRemaining % this._day) / this._hour);
            this.minutes = Math.floor((timeRemaining % this._hour) / this._minute);
            this.seconds = Math.floor((timeRemaining % this._minute) / this._second);

            return timeRemaining;
        };

        // Recalculates time left in countdown, updating numbers as needed
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

        // Draws the box be put the timer in and mounts it to this.$mountPoint
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

        // Return CountDownTimer class
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
