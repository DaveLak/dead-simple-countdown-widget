/*eslint  space-in-parens: 0, array-bracket-spacing: 0, yoda: 0 */
var expect = chai.expect;

describe('CountDownTimer', function() {
	describe('constructor', function() {
		var settings;

		beforeEach(function() {
			jQuery('<div/>', {
				id: 'timerMountNode'
			}).appendTo('body');

			settings = {
				instanceID: 'dscw-countdown-instance-widget-1',
				targetDate: '2624602000000', // Time stamp for 2053-03-03T08:06:40.
				expiredText: 'Expired!',
				$mountNode: jQuery('#timerMountNode')
			};
		});

		afterEach(function() {
			jQuery('#timerMountNode').remove();
		});

		describe('$mountNode', function() {
			it('Should be set to jQuery object', function() {
				expect((new CountDownTimer(settings)).$mountNode).to.be.an.instanceof(jQuery);
			});

			it('should throw if not passed jQuery object.', function() {
				settings.$mountNode = document.getElementById('timerMountNode');
				expect(function() {
					new CountDownTimer(settings);
				}).to.throw('[CountDownTimer] settings.$mountNode must be a jQuery object wrapping a single element!');
			});
		});
		describe('instanceID', function() {
			it('Should get assigned the passed string value', function() {
				expect((new CountDownTimer(settings)).instanceID).to.be.a('string');
			});
			it('Should throw if not passed string value', function() {
				settings.instanceID = 10210;
				expect(function() {
					new CountDownTimer(settings);
				}).to.throw('instanceID must be a string');
			});
			it('Should throw if not passed string with a length greater than 0', function() {
				settings.instanceID = '';
				expect(function() {
					new CountDownTimer(settings);
				}).to.throw('[CountDownTimer] settings.instanceID must be a string with a length greater than 0!');
			});
		});
		describe('expiredText', function() {
			it('Should get assigned to the value passed in the settings object', function() {
				expect((new CountDownTimer(settings)).expiredText).to.equal('Expired!');
			});
			it('Should default to empty string', function() {
				delete settings.expiredText;
				expect((new CountDownTimer(settings)).expiredText).to.equal('');
			});
		});
		describe('targetDate', function() {
			it('Should get assigned to the String value passed in the settings object', function() {
				expect((new CountDownTimer(settings)).targetDate).to.equal('2624602000000');
			});
			it('Should get assigned to the Number value passed in the settings object', function() {
				settings.targetDate = 2624602000000;
				expect((new CountDownTimer(settings)).targetDate).to.equal(2624602000000);
			});
			it('Should default to empty 0', function() {
				delete settings.targetDate;
				expect((new CountDownTimer(settings)).targetDate).to.equal(0);
			});
		});
		describe('$countDownBox', function() {
			it('Should initialize to null', function() {
				expect((new CountDownTimer(settings)).$countDownBox).to.be.null;
			});
		});
		describe('$numberDays', function() {
			it('Should initialize to null', function() {
				expect((new CountDownTimer(settings)).$numberDays).to.be.null;
			});
		});
		describe('$numberHours', function() {
			it('Should initialize to null', function() {
				expect((new CountDownTimer(settings)).$numberHours).to.be.null;
			});
		});
		describe('$numberMinutes', function() {
			it('Should initialize to null', function() {
				expect((new CountDownTimer(settings)).$numberMinutes).to.be.null;
			});
		});
		describe('$numberMinutes', function() {
			it('Should initialize to null', function() {
				expect((new CountDownTimer(settings)).$numberMinutes).to.be.null;
			});
		});
		describe('$numberSeconds', function() {
			it('Should initialize to null', function() {
				expect((new CountDownTimer(settings)).$numberSeconds).to.be.null;
			});
		});
	});

	describe('prototype', function() {
		var settings, countdown;

		beforeEach(function() {

			jQuery('<div/>', {
				id: 'timerMountNode'
			}).appendTo('body');

			settings = {
				instanceID: 'dscw-countdown-instance-widget-1',
				targetDate: '2624602000000', // Time stamp for 2053-03-03T08:06:40.
				expiredText: 'Expired!',
				$mountNode: jQuery('#timerMountNode')
			};
			countdown = new CountDownTimer(settings);
		});

		afterEach(function() {
			jQuery('#timerMountNode').remove();
		});

		describe('remaining', function() {
			it('Should be an object', function() {
				expect(countdown.remaining).to.be.an.instanceof(Object);
			});
			describe('days', function() {
				it('Should initialize days to zero', function() {
					expect(countdown.remaining.days).to.equal(0);
				});
			});
			describe('hours', function() {
				it('should initialize hours to zero', function() {
					expect(countdown.remaining.hours).to.equal(0);
				});
			});
			describe('minutes', function() {
				it('should initialize minutes to zero', function() {
					expect(countdown.remaining.minutes).to.equal(0);
				});
			});
			describe('seconds', function() {
				it('should initialize seconds to zero', function() {
					expect(countdown.remaining.seconds).to.equal(0);
				});
			});
		});
		describe('#validateMountNode', function() {
			it('Should throw if passed jQuery object wrapping more than one element', function() {
				expect(function() {
					countdown.validateMountNode(jQuery('div'));
				}).to.throw('[CountDownTimer] settings.$mountNode must be a jQuery object wrapping a single element!');
			});
			it('Should throw if not passed jQuery object', function() {
				expect(function() {
					countdown.validateMountNode(document.getElementById('timerMountNode'));
				}).to.throw('[CountDownTimer] settings.$mountNode must be a jQuery object wrapping a single element!');
			});
			it('Should return the jQuery object passed to it if valid', function() {
				expect(countdown.validateMountNode(settings.$mountNode)).to.equal(settings.$mountNode);
			});
		});
		describe('#validateInstanceID', function() {
			it('Should throw if not passed a string', function() {
				expect(function() {
					countdown.validateInstanceID({});
				}).to.throw('[CountDownTimer] settings.instanceID must be a string with a length greater than 0!');
			});
			it('Should throw if not passed string with a length greater than 0', function() {
				expect(function() {
					countdown.validateInstanceID('');
				}).to.throw('[CountDownTimer] settings.instanceID must be a string with a length greater than 0!');
			});
			it('Should return valid strings', function() {
				var validString = 'Valid id String';
				expect(countdown.validateInstanceID(validString)).to.equal(validString);
			});
		});
		describe('#start', function() {
			var renderStub,
				calculateRemainingStub,
				expireTimerStub,
				numberTransitionStub,
				setIntervalStub,
				showRemainingTimeStub;

			before(function() {
				this.clock = sinon.useFakeTimers();
				renderStub = sinon.stub(countdown, 'render');
				calculateRemainingStub = sinon.stub(countdown, 'calculateRemaining');
				expireTimerStub = sinon.stub(countdown, 'expireTimer');
				numberTransitionStub = sinon.stub(countdown, 'numberTransition');
				setIntervalStub = sinon.stub(countdown, 'setInterval');
				showRemainingTimeStub = sinon.stub(countdown, 'showRemainingTime');
				countdown.start();

				// showRemainingTimeStub = sinon.stub(countdown, 'showRemaining');
			});

			after(function() {
				this.clock.restore();
				renderStub.restore();
				calculateRemainingStub.restore();
				expireTimerStub.restore();
				numberTransitionStub.restore();
				setIntervalStub.restore();
				showRemainingTimeStub.restore();
			});
			it('Should call CountDownTimer#render once', function() {
				expect(renderStub).to.have.been.calledOnce;
			});
			/* @TODO: Test expired time */
			it('Should call CountDownTimer#calculateRemaining once', function() {
				expect(calculateRemainingStub).to.have.been.calledOnce;
			});
			/* @TODO: Test passed arguments */
			it('Should call CountDownTimer#numberTransition four times', function() {
				expect(numberTransitionStub).to.have.callCount(4);
			});
			/* @TODO: Test returned intvalID */
			it('Should call CountDownTimer#showRemainingTime to be called every second', function() {
				this.clock.tick(1001);
				this.clock.tick(1001);
				this.clock.tick(1001);
				this.clock.tick(1001);
				expect(numberTransitionStub).to.have.callCount(4);
			});
		});
	});
});
