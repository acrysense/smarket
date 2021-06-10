'use strict';

$(function ($) {
    var $window = $(window);
    var $body = $('body');
    var $seminarScroller = $('.seminar-scroller');

    if ($seminarScroller.length > 0) {
        var scroller = new Scroller({
            el: $seminarScroller[0],
            anchors: 'hidden'
        });

        $.each($('.seminar-scroller__item'), function (index, el) {
            $(this).addClass('shown');
            $(this).css('transition-delay', index * 300 + 'ms');
        });

        setTimeout(function () {
            $seminarScroller.next().addClass('shown');
        }, 1200);

        setTimeout(function () {
            $seminarScroller.find('.ab_scroller-scrollwrap').addClass('shown');
        }, 1500);
    }

    $("input.phoneMask").mask("+7 (999) 999-99-99");

    // seminar play video
    $('.video-block__icon-wrap').each(function () {
        $(this).on('touchstart click', function (event) {
            var videoHash = $(this).attr('data-video');

            if ($window.width() > 767) {
                var video = '<iframe src="https://www.youtube.com/embed/' + videoHash + '?autoplay=1"></iframe>';
                $(this).closest('.video-block').replaceWith(video);
            } else {
                $.magnificPopup.open({
                    items: {
                        src: 'https://www.youtube.com/watch?v=' + videoHash
                    },
                    type: 'iframe',
                    mainClass: 'mfp-fade',
                    removalDelay: 300,
                    preloader: false,
                    fixedBgPos: true,
                    fixedContentPos: true,
                    disableOn: 0
                }, 0);
            }
        });
    });

    $('.seminar_panel__collapse').on('shown.bs.collapse', function (e) {
        var $panel = $(this).closest('.seminar_panel');
        $('html,body').animate({
            scrollTop: $panel.offset().top - 100
        }, 500);
    });

    // seminar modal window
    $('.seminar_booking__open').magnificPopup({
        removalDelay: 300,
        prependTo: '.page .fixed-content',
        mainClass: 'mfp-seminar',
        showCloseBtn: false,
        fixedContentPos: true,
        fixedBgPos: true,
        callbacks: {
            open: function open() {
                $body.addClass('hide-header');
                var _this = this.container[0];

                if ($('html').hasClass('smooth-scroll')) {
                    var smoothOptions = {
                        alwaysShowTracks: true,
                        plugins: {
                            mobile: {
                                speed: 1
                            },
                            disableScroll: {
                                direction: null
                            }
                            //continuousScrolling: false
                        } };

                    smoothOptions.plugins.disableScroll.direction = 'x';

                    var scrollBar = Scrollbar.init(_this, smoothOptions);
                }

                $('.dismissSeminar').addClass('sticky');
                //$('.getSeminar').css('overflow-y', 'scroll');
            },
            beforeClose: function beforeClose() {
                $('.dismissSeminar').removeClass('sticky');
            },
            close: function close() {
                $body.removeClass('hide-header');

                //$('.getSeminar').css('overflow-y', 'auto');
            }
        }
    });

    $('.seminar_booking__close').click(function (event) {
        event.preventDefault();
        $.magnificPopup.close();
    });

    // seminar form validation
    $('.seminar_form_validate').each(function () {
        $(this).validate({
            focusInvalid: false,
            messages: {
                seminar_name: {
                    required: "Введите имя"
                },
                seminar_surname: {
                    required: "Введите фамилию"
                },
                seminar_phone: {
                    required: "Введите телефон"
                },
                seminar_email: {
                    required: "Введите e-mail",
                    email: "Введите верный e-mail"
                },
                seminar_radio: {
                    required: false
                },
                seminar_agreement_policy: {
                    required: false
                }
            }
        });
    });

    var contactInfoIsValid, dateIsValid, agreementPolicyIsValid, form, promotionForm, currentForm, progress, btntext, agreementMessage, seminarSubmit, seminarPromotionSubmit, lastMessage;

    form = $('.seminar_form_validate:not(.-promotion)');
    promotionForm = $('.seminar_form_validate.-promotion');
    currentForm = form;
    progress = $('.seminar_bar__progress:not(.-promotion)');
    seminarSubmit = $('.seminar_bar__submit:not(.-promotion)');
    seminarPromotionSubmit = $('.seminar_bar__submit.-promotion');
    agreementMessage = 'Согласитесь с условиями участия';
    lastMessage = 'Записаться';

    progress = $('.seminar_bar__progress:not(.-promotion)');
    btntext = $('.seminar_bar__submit-text:not(.-promotion)');

    function showProgress() {
        contactInfoIsValid = currentForm.find("input[name=seminar_name]").valid() && currentForm.find("input[name=seminar_surname]").valid() && currentForm.find("input[name=seminar_phone]").valid() && $("input[name=seminar_email]").valid();
        agreementPolicyIsValid = currentForm.find("input[name=seminar_agreement_policy]").valid();
        dateIsValid = $("input[name=seminar_radio]").is(":checked");

        if (dateIsValid && contactInfoIsValid && agreementPolicyIsValid) {
            progress.css({
                'width': '100%',
                'height': '100%'
            });
        } else if ((dateIsValid || contactInfoIsValid) && (dateIsValid || agreementPolicyIsValid) && (contactInfoIsValid || agreementPolicyIsValid)) {
            progress.css({
                'width': '66.6%'
            });
        } else if (dateIsValid || contactInfoIsValid || agreementPolicyIsValid) {
            progress.css({
                'width': '33.3%',
                'opacity': '1'
            });
        } else {
            progress.css({
                'width': '1%',
                'opacity': '0'
            });
        }

        if (dateIsValid && contactInfoIsValid && agreementPolicyIsValid) {
            btntext.html(lastMessage);
        } else if (dateIsValid && contactInfoIsValid) {
            btntext.text(agreementMessage);
        } else if (dateIsValid && agreementPolicyIsValid) {
            btntext.text('Представьтесь и заполните контактную информацию');
        } else if (contactInfoIsValid && agreementPolicyIsValid) {
            btntext.text('Выберите подходящую дату и опции');
        } else if (dateIsValid) {
            btntext.text('Представьтесь и заполните контактную информацию');
        } else if (contactInfoIsValid) {
            btntext.text(agreementMessage);
        } else if (agreementPolicyIsValid) {
            btntext.text('Выберите подходящую дату и опции');
        }
    }

    $('input[name=seminar_radio]').on("change keyup paste", function () {

        if ($(this).data('title') === 'promotion-price') {
            $('input[type=radio]').parent().find('.radio_group__text-sm').slideUp();
            $(this).parent().find('.radio_group__text-sm').slideDown();
            currentForm = promotionForm;
            progress = $('.seminar_bar__progress.-promotion');
            btntext = $('.seminar_bar__submit-text.-promotion');
            form.hide();
            promotionForm.show();
            seminarSubmit.addClass('-hidden');
            seminarPromotionSubmit.addClass('-visible');
            showProgress();
            agreementMessage = 'Согласитесь с офертой сайта';
            lastMessage = 'Свяжитесь со мной';
            currentForm.find("input").on("change keyup paste", function () {
                showProgress();
            });
        } else {
            $('input[data-title=promotion-price]').parent().find('.radio_group__text-sm').slideUp();
            currentForm = form;
            progress = $('.seminar_bar__progress:not(.-promotion)');
            btntext = $('.seminar_bar__submit-text:not(.-promotion)');
            form.show();
            promotionForm.hide();
            seminarSubmit.removeClass('-hidden');
            seminarPromotionSubmit.removeClass('-visible');
            showProgress();
            agreementMessage = 'Согласитесь с условиями участия';
            lastMessage = 'Записаться';
            currentForm.find("input").on("change keyup paste", function () {
                showProgress();
            });
        }
    });

    currentForm.find("input").on("change keyup paste", function () {
        showProgress();
    });

    $('.seminar_bar__submit:not(.-promotion)').click(function (event) {
        $('.seminar_form_validate:not(.-promotion)').valid();

        if ($('.seminar_form_validate:not(.-promotion)').valid() === true) {
            //alert('Done');
        }
    });

    $('.seminar_bar__submit.-promotion').click(function (event) {
        var successMessage = $(this).parent().find('.form-success-message');

        $('.seminar_form_validate.-promotion').valid();

        if ($('.seminar_form_validate.-promotion').valid() === true) {
            $('.seminar_booking__close').addClass('-hidden');
            $('.seminar_bar__submit-wrap').addClass('-success-message-shown');
        }
    });

    $('.form-success-message__btn').click(function (event) {
        event.preventDefault();
        $.magnificPopup.close();
        $('.seminar_booking__close').removeClass('-hidden');
        $('.seminar_bar__submit-wrap').removeClass('-success-message-shown');
    });
});
//# sourceMappingURL=education.js.map
