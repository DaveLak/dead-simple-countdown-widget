(function ($) {

    'use strict';

    /* CountDownTimer class  */
    var CountDownTimer = function (settings) {
        console.log(settings);

        // jQuery reference to the DOM Node we add this timer to
        this.$mountPoint = settings.$mountPoint;

        // Unique ID of this widget instance
        this.instanceID = settings.instanceID;

        // Text displayed when countdown finishes
        this.expiredText = settings.expiredText;

        // UNIX timestamp in milliseconds of the date the countdown is set to expire
        this.end = settings.endDate;

        // Internal time bases
        this._second = 1000;
        this._minute = this._second * 60;
        this._hour = this._minute * 60;
        this._day = this._hour * 24;

        // Draws the box be put the timer in and mounts it to this.$mountPoint
        this.drawTimer = function () {
            this.$countDownBox = $('<div/>', {
                id: 'countdown-' + this.instanceID,
                class: 'dscw-countdown-timer-box-wrapper'
            }).appendTo(this.$mountPoint);
        };

        // Recalculates time left in countdown, updating numbers as needed
        this.showRemainingTime = function () {

            // Time right now
            var now = new Date();
            // Time left until countdown expires
            var distance = this.end - now;

            if (distance < 0) {
                // Countdown expired
                clearInterval(this.timer);
                // stop running this method and set text
                this.$countDownBox.html('<h4>' + this.expiredText + '</h4>');
                // Finished
                return;

            } else {
                // Calculate time left in countdown
                var days = Math.floor(distance / this._day);
                var hours = Math.floor((distance % this._day) / this._hour);
                var minutes = Math.floor((distance % this._hour) / this._minute);
                var seconds = Math.floor((distance % this._minute) / this._second);
            }

            // Output the timer
            this.$countDownBox.html('' +
                '<div class="dscw-countdown-timer-box">' +
                '    <p class="dscw-countdown-timer-box-items dscw-countdown-days">' + days + ' Days</p>' +
                '    <p class="dscw-countdown-timer-box-items dscw-countdown-hours">' + hours + ' Hours</p>' +
                '    <p class="dscw-countdown-timer-box-items dscw-countdown-minutes">' + minutes + ' Minutes</p>' +
                '    <p class="dscw-countdown-timer-box-items dscw-countdown-seconds">' + seconds + ' Seconds</p>' +
                '</div>'
            );
        };

        // Draw container and mount it to this.$mountPoint
        this.drawTimer();

        // Reference to calling class
        var self = this;
        this.timer = setInterval(function () {
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
