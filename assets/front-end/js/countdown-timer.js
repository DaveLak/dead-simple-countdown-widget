(function ($) {

    'use strict';

    /* CountDownTimer class  */
    var CountDownTimer = function (settings) {

        /* Configuration options */

        // jQuery reference to the DOM Node we add this timer to
        this.$mountPoint = settings.$mountPoint;
        // Unique ID of this widget instance
        this.instanceID = settings.instanceID;
        // Text displayed when countdown finishes
        this.expiredText = settings.expiredText;
        // UNIX timestamp in milliseconds of the date the countdown is set to expire
        this.end = settings.endDate;

        /* Local variables */

        // Internal time bases
        this._second = 1000;
        this._minute = this._second * 60;
        this._hour = this._minute * 60;
        this._day = this._hour * 24;

        // Draws the box be put the timer in and mounts it to this.$mountPoint
        this.drawTimer = function () {

            // ID strings for created HTML elements
            var timerID = this.instanceID + '-countdown';
            var daysID = this.instanceID + '-days';
            var hoursID = this.instanceID + '-hours';
            var minutesID = this.instanceID + '-minutes';
            var secondsID = this.instanceID + '-seconds';

            // Create and mount the container
            this.$countDownBox = $('<div/>', {
                id: timerID,
                class: 'dscw-countdown-timer-box-wrapper'
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

            // Assign jQuery objects representing each element holding a number to class properties
            this.$numberDays = $('#' + daysID);
            this.$numberHours = $('#' + hoursID);
            this.$numberMinutes = $('#' + minutesID);
            this.$numberSeconds = $('#' + secondsID);
        };

        // Recalculates time left in countdown, updating numbers as needed
        this.showRemainingTime = function () {

            // Time right now
            var now = new Date();
            // Time left until countdown expires
            var timeRemaining = this.end - now;

            // Check if there is still time left before the countdown expires
            if (timeRemaining > 0) {
                // There is still time left

                // Calculate time left until expiration
                var days = Math.floor(timeRemaining / this._day);
                var hours = Math.floor((timeRemaining % this._day) / this._hour);
                var minutes = Math.floor((timeRemaining % this._hour) / this._minute);
                var seconds = Math.floor((timeRemaining % this._minute) / this._second);

                // Update the displayed numbers
                this.$numberDays.text(days);
                this.$numberHours.text(hours);
                this.$numberMinutes.text(minutes);
                this.$numberSeconds.text(seconds);

            } else {
                // The countdown expired. Stop future execution of this countdown.
                clearInterval(this.timer);
                // Set the expiration text and exit
                this.$countDownBox.html('<h4>' + this.expiredText + '</h4>');
                // Finished
            }
        };

        // Draw the timer
        this.drawTimer();

        // Reference to calling class
        var self = this;
        this.timer = setInterval(function () {
            // Run the actual countdown until it expires
            self.showRemainingTime();
        }, 1000);

    };

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
            new CountDownTimer(settings);
        })
    });
})(jQuery);
