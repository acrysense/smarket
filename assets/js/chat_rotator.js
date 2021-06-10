'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var animateOnce = function animateOnce(el, addClass, removeClass, cb) {
    el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        if (typeof cb === 'function') {
            cb();
        }
    }).addClass(addClass + ' animated').removeClass(removeClass);
};

var chatRotator = function () {
    function chatRotator() {
        _classCallCheck(this, chatRotator);

        this.params = {
            interval: null,
            step: 0,
            classes: ['bg-1', 'bg-2', 'bg-3'],
            speed: 3000,
            el: $('#bitrix_custom_widget'),
            classIn: 'animate__rotateIn',
            classOut: 'animate__rotateOut',
            rotating: false
        };
    }

    _createClass(chatRotator, [{
        key: 'start',
        value: function start() {
            var _this = this;

            this.params.interval = setInterval(function () {
                animateOnce(_this.params.el, _this.params.classOut, _this.params.classIn, function () {
                    _this.nextStep();

                    setTimeout(function () {
                        animateOnce(_this.params.el, _this.params.classIn, _this.params.classOut);
                    }, 0);
                });
            }, this.params.speed);
        }
    }, {
        key: 'stop',
        value: function stop() {
            clearInterval(this.params.interval);
        }
    }, {
        key: 'nextStep',
        value: function nextStep() {
            this.params.el.removeClass(this.params.classes[this.params.step]);

            if (this.params.step < this.params.classes.length - 1) {
                this.params.step++;
            } else {
                this.params.step = 0;
            }

            this.params.el.addClass(this.params.classes[this.params.step]);
        }
    }]);

    return chatRotator;
}();

$(function ($) {
    var chat = new chatRotator();

    chat.start();

    //chat.stop();
});
//# sourceMappingURL=chat_rotator.js.map
