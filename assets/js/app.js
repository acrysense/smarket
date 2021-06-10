'use strict';

var div = document.createElement('div'),
    lastScroll = void 0;

div.style.overflowY = 'scroll';
div.style.width = '50px';
div.style.height = '50px';
$('body').append(div);
document.documentElement.style.setProperty('--scrollbarWidth', div.offsetWidth - div.clientWidth + 'px');
div.remove();

document.documentElement.style.setProperty('--subMenuHeight', '400px');
document.documentElement.style.setProperty('--currentScroll', '0px');

if (/naverstay\.me/.test(location.origin)) {
    var scr = {
        "scripts": [{
            "src": "//cdn.jsdelivr.net/npm/eruda",
            "async": false,
            "onload": function onload() {
                var c = document.createElement("script");
                c.innerHTML = 'eruda.init();';
                document.body.appendChild(c);
            }
        }]
    };
    !function (win, doc, scr) {
        "use strict";

        var add = function add(t) {
            if ("[object Array]" !== Object.prototype.toString.call(t)) return !1;
            for (var r = 0; r < t.length; r++) {
                var c = doc.createElement("script"),
                    e = t[r];
                c.src = e.src;
                c.async = e.async;
                doc.body.appendChild(c);

                if ('onload' in e) {
                    c.onload = e.onload;
                }
            }
            return !0;
        };
        win.addEventListener ? win.addEventListener("load", function () {
            add(scr.scripts);
        }, !1) : win.attachEvent ? win.attachEvent("onload", function () {
            add(scr.scripts);
        }) : win.onload = function () {
            add(scr.scripts);
        };
    }(window, document, scr);
}

function browserCheck() {
    var isDesktop = false;
    var ie,
        navUserAgent = navigator.userAgent.toLowerCase(),
        html = document.documentElement;

    if (navUserAgent.indexOf('msie') > -1) {
        ie = navUserAgent.indexOf('msie') > -1 ? parseInt(navUserAgent.split('msie')[1]) : false;
        html.className += ' ie';
        html.className += ' ie' + ie;
    } else if (!!navUserAgent.match(/trident.*rv\:11\./)) {
        ie = 11;
        html.className += ' ie' + ie;
    }

    if (navUserAgent.indexOf('safari') > -1) {
        if (navUserAgent.indexOf('chrome') > -1) {
            html.className += ' chrome';
        } else {
            html.className += ' safari';
        }
    }

    if (navUserAgent.indexOf('firefox') > -1) {
        html.className += ' firefox';
    }

    if (navUserAgent.indexOf('windows') > -1) {
        isDesktop = true;
        html.className += ' windows';
    }

    if (navigator.platform.toLowerCase().indexOf('mac') > -1) {
        isDesktop = true;
        html.className += ' macos';
    }

    if (!isDesktop && (/iphone|ipad|ipod/i.test(navUserAgent) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 && !window.MSStream)) {
        html.className += ' ios';
    }
}

browserCheck();

//BX.ready(function() {
    var scrollTimer;
    var scrollBusy = false;
    var resizeFunc = [];
    var smBars = [];
    var menuTimer;
    var menuLeaveTimer;
    var submenuOpenTimer;
    var noDelayTimer;
    var activeLetterTimer;
    var submenuOpenDelay = 200;
    var mouseClickTimer;
    var contentScrollerThrottle = 200;
    var menuDelay = 100;
    var $html = $('html');
    var $body = $('body');
    var smoothMode = $html.hasClass('smooth-scroll');
    var lastScroll = void 0;
    var $mainContant = $('.main-content');
    var $stickyAlph = $('.stickMe.fixAlph');
    var mainPaddingTop = 0;
    var currentVH = 0;
    var $header = $('.header'),
        $doc = $(document),
        $window = $(window);
    var fixMe = $('.fixMe');
    var lbrands = $('.lbrands');
    var lbrandsItem = $('.lbrands-item');
    var scrollDamping = window.scrollDamping || 0.5;
    var scrollSpeedMobile = window.scrollSpeedMobile || 1;

    fixWebkitStyle();


    function desktopMode(w) {
        w = parseInt(w) || 991;
        return $window.width() > w;
    }

    function htmlAnimate(pos, speed, cb) {
        scrollBusy = true;

        var scrollBars = smBars.filter(function (s) {
            return s.name === 'mainScroller';
        });

        var _loop = function _loop(i) {
            var scrollBar = scrollBars[i].sm;

            $({ count: lastScroll || 0 }).animate({ count: pos + (lastScroll || 0) }, {
                duration: speed,
                step: function step() {
                    scrollBar.scrollTop = this.count;
                },
                complete: function complete() {
                    scrollBusy = false;

                    if (typeof cb === 'function') {
                        cb();
                    }
                }
            });
        };

        for (var i = 0; i < scrollBars.length; i++) {
            _loop(i);
        }
    }

    // sticky seminar review panel
    function showTopBar(scrollTop) {
        if ($window.width() > 768) {
            if (scrollTop >= 100 && scrollTop < $('.main-content').outerHeight() - currentVH) {
                $('.getSeminar').addClass('sticky');
            } else {
                $('.getSeminar').removeClass('sticky');
            }
        } else {
            if (scrollTop + $window.outerHeight() >= $('#seminar').outerHeight() + $('.header_first_row ').height()) {
                $('.getSeminar').addClass('absolute');
                $('.getSeminar').removeClass('sticky');
            } else if (scrollTop >= 100 && scrollTop < $('.main-content').outerHeight() - currentVH) {
                $('.getSeminar').addClass('sticky');
                $('.getSeminar').removeClass('absolute');
            } else {
                $('.getSeminar').removeClass('sticky');
            }
        }
    }

    function letterScrollEnd(letter) {
        //if (!scrollBusy) {
        setTimeout(function () {
            letter.parent().addClass('active').siblings().removeClass('active');
        }, 20);
        //}
    }

    function letterScrollTo(letter) {
        var scrollPos = parseInt(letter.parent().position().left) - 50;

        if (smoothMode) {
            var scrollBars = smBars.filter(function (s) {
                return s.name === 'brandsAlphScroller';
            });

            var _loop2 = function _loop2(i) {
                var scrollBar = scrollBars[i].sm;

                $({ count: scrollBar.scrollLeft }).animate({ count: scrollBar.scrollLeft + scrollPos }, {
                    duration: 300,
                    step: function step() {
                        scrollBar.scrollLeft = this.count;
                    },
                    complete: function complete() {
                        scrollBar.scrollLeft = this.count;
                        //clearTimeout(activeLetterTimer);
                        letterScrollEnd(letter);
                    }
                });
            };

            for (var i = 0; i < scrollBars.length; i++) {
                _loop2(i);
            }
        } else {
            var alphScroller = $('.container[data-smname="brandsAlphScroller"]');
            var parentOffset = letter.closest('.brandsalph').position().left;

            if (!alphScroller.hasClass('busy')) {
                alphScroller.addClass('busy');

                alphScroller.stop(1, 1).animate({
                    scrollLeft: scrollPos - parentOffset
                }, 300, function () {
                    alphScroller.removeClass('busy');
                    //clearTimeout(activeLetterTimer);
                    letterScrollEnd(letter);
                });
            }
        }
    }

    function checkBrands() {
        var activeLetter;
        var h = $header.outerHeight();

        if (lbrands.length) {
            lbrandsItem.each(function () {
                var block = $(this);

                if (!activeLetter && lastScroll < block.offset().top + block.outerHeight() - h) {
                    if (block.attr('id')) {
                        activeLetter = block;
                    }
                }
            });

            if (activeLetter) {
                var letter = $('.brandsalph .link-scroll[href="#' + activeLetter.attr('id') + '"]');

                if (letter.length) {
                    letterScrollTo(letter);
                }
            }
        }
    }

    function checkScrollDirection(currentScroll) {
        var headerHeight = $header.outerHeight();
        var hideHeader = currentScroll > headerHeight;

        if (0 === currentScroll) {
            $body.removeClass('scroll-up');
            return;
        }

        if (currentScroll > headerHeight && currentScroll > lastScroll && !$body.hasClass('scroll-down')) {
            $body.removeClass('scroll-up').addClass('scroll-down');
        } else if (currentScroll < lastScroll && $body.hasClass('scroll-down')) {
            $body.removeClass('scroll-down').addClass('scroll-up');
        }

        $('.header-deskmbtn').toggleClass('sactive', hideHeader);

        $body.data('show-for-product', 0);

        //document.documentElement.style.setProperty('--currentScroll', currentScroll + 'px');

        fixWebkitStyle();
    }

    function checkFixedBlocks(currentScroll) {
        if (smoothMode) {
            $('.stickMe').each(function () {
                var $sticky = $(this);
                var $stickParent = $sticky.closest('.stickParent');
                var $innerTop = $stickParent.find('.fixNavMarker');
                var stickBottomEnd = ($sticky.attr('data-stick-bottom-end') || 0) * 1;
                var stickTop = ($sticky.attr('data-stick-top') || 0) * 1;

                var params = {
                    bottomEnd: stickBottomEnd + $innerTop.position().top
                };

                if ($innerTop.length) {
                    params.innerTop = $innerTop.position().top;
                }

                var mt = (params.innerTop || 0) + currentScroll;

                if ($sticky.hasClass('fixAlph') && !desktopMode()) {
                    var alphGap = currentVH - 80 - stickTop;
                    params.bottomEnd += alphGap;
                    mt += alphGap;
                }

                $sticky.css({
                    'margin-top': mt + 'px'
                });

                $sticky.hcSticky('update', params);
            });
        } else {
            var paramsAlph = {};

            if (!desktopMode() && $mainContant.length && $mainContant.offset().top + $mainContant.outerHeight() > currentVH + $html.scrollTop()) {
                paramsAlph.bottomEnd = currentVH - 80;
                $stickyAlph.hcSticky('update', paramsAlph);
            }
        }
    }

    function checkNav() {
        if (!scrollBusy) {
            $('.js-nav-target').each(function (i, el) {
                var _el = $(el);

                if (_el.isOnScreen({ part: 0.1, checkOut: true })) {
                    $('.pagecard-nav a[href="#' + _el.attr('id') + '"]').trigger('click');
                    return false;
                }
            });
        }
    }

    function contentScroller(currentScroll) {
        //clearTimeout(activeLetterTimer);

        checkScrollDirection(currentScroll);

        showTopBar(currentScroll);

        checkNav(currentScroll);

        checkFixedBlocks(currentScroll);

        activeLetterTimer = setTimeout(function () {
            checkBrands();
        }, 20);

        lastScroll = currentScroll;
    }

    if (smoothMode) {
        var Scrollbar = window.Scrollbar;

        var MobilePlugin = function MobilePlugin() {
            Scrollbar.ScrollbarPlugin.apply(this, arguments);
        };

        MobilePlugin.prototype = Object.create(Scrollbar.ScrollbarPlugin.prototype);

        MobilePlugin.prototype.transformDelta = function (delta, fromEvent) {
            if (this.scrollbar.containerEl.dataset.scrollbarMin && !desktopMode(this.scrollbar.containerEl.dataset.scrollbarMin)) {
                return {
                    x: 0,
                    y: 0
                };
            }

            if (this.scrollbar.containerEl.dataset.scrollbarMax && desktopMode(this.scrollbar.containerEl.dataset.scrollbarMax)) {
                return {
                    x: 0,
                    y: 0
                };
            }

            if (fromEvent.type !== 'touchend') {
                return delta;
            }

            return {
                x: delta.x * this.options.speed,
                y: delta.y * this.options.speed
            };
        };

        MobilePlugin.prototype.onUpdate = function () {
            if (this.scrollbar.limit.x) {
                this.scrollbar.containerEl.classList.add('has-overflow-x');
            } else {
                this.scrollbar.containerEl.classList.remove('has-overflow-x');
            }
        };

        MobilePlugin.pluginName = 'mobile';
        MobilePlugin.defaultOptions = {
            speed: 1
        };

        var DisableScrollPlugin = function DisableScrollPlugin() {
            Scrollbar.ScrollbarPlugin.apply(this, arguments);
        };

        DisableScrollPlugin.prototype = Object.create(Scrollbar.ScrollbarPlugin.prototype);

        DisableScrollPlugin.prototype.transformDelta = function (delta, fromEvent) {
            if (this.options.direction) {
                if (this.options.direction === 'auto') {
                    if ('scrollbarDisableY' in this.scrollbar.containerEl.dataset) {
                        this.options.direction = 'y';
                    }
                    if ('scrollbarDisableX' in this.scrollbar.containerEl.dataset) {
                        this.options.direction = 'x';
                    }
                }

                if (this.options.direction === 'y' && Math.abs(delta.y) > Math.abs(delta.x)) {
                    delta.x = 0;
                }

                delta[this.options.direction] = 0;
            }

            return delta;
        };

        DisableScrollPlugin.prototype.onInit = function () {
            if (this.options.direction === 'x') {
                this.scrollbar.track.xAxis.element.remove();
            }

            if (this.options.direction === 'y') {
                this.scrollbar.track.yAxis.element.remove();
            }
        };

        DisableScrollPlugin.pluginName = 'disableScroll';
        DisableScrollPlugin.defaultOptions = {
            direction: null
        };

        Scrollbar.use(MobilePlugin, DisableScrollPlugin);

        $('*[data-scrollbar]').each(function () {
            var smoothOptions = {
                damping: scrollDamping,
                alwaysShowTracks: true,
                plugins: {
                    mobile: {
                        speed: scrollSpeedMobile
                    },
                    disableScroll: {
                        direction: null
                    }
                    //continuousScrolling: false
                } };

            if ('scrollbarDisableY' in this.dataset) {
                smoothOptions.plugins.disableScroll.direction = 'y';
                smoothOptions.continuousScrolling = true;
            }
            if ('scrollbarDisableX' in this.dataset) {
                smoothOptions.plugins.disableScroll.direction = 'x';
            }

            smBars.push({
                name: this.dataset.smname || smBars.length + 1,
                sm: Scrollbar.init(this, smoothOptions)
            });
        });

        var scrollBars = smBars.filter(function (s) {
            return s.name === 'mainScroller';
        });

        if (scrollBars.length) {
            scrollBars[0].sm.addListener(function (status) {
                contentScroller(status.offset.y);
            });
        }
    } else {
        // header modification
        $(window).scroll(function () {
            contentScroller(this.pageYOffset);
        }).trigger('scroll');
    }

    $('.header-deskmbtn').on('mouseover click', function () {
        $('body').removeClass('scroll-down').removeClass('scroll-up');
    });
    $('.header').on('mouseleave', function () {
        if ($(window).scrollTop() > $('.header').height()) {
            $('body').removeClass('scroll-up').addClass('scroll-down');
        }
    });

    setTimeout(function () {
        scrollBreadcrumbs();
    }, 1000);

    // datepicker

    $('.datePicker').each(function (ind) {
        var dt = $(this);
        var parent = dt.parent();
        var datePickerInfo = parent.find('.datePickerInfo');

        function createLightPicker(dt) {
            var parent = dt.parent();

            var picker = new Lightpick({
                field: dt[0],
                singleDate: false,
                dropdowns: false,
                hoveringTooltip: false,
                hideOnBodyClick: false,
                footer: '<button class="cancelBtn btn btn-sm btn-default" type="button">Сбросить</button><button class="applyBtn btn btn-sm btn-primary" type="button">Применить</button>',
                inline: true,
                parentEl: parent[0],
                minDate: moment().subtract(57, 'day'),
                maxDate: moment().add(48, 'day'),
                startDate: moment().subtract(2, 'day'),
                endDate: moment().add(5, 'day'),
                disableDates: [],
                lang: 'ru',
                locale: {
                    buttons: {
                        prev: ' ',
                        next: ' ',
                        close: '×',
                        reset: 'Сбросить',
                        apply: 'Применить'
                    },
                    tooltip: {
                        one: 'день',
                        few: 'дня',
                        many: 'дней'
                    },
                    pluralize: function pluralize(i, locale) {
                        if ('one' in locale && i % 10 === 1 && !(i % 100 === 11)) return locale.one;
                        if ('few' in locale && i % 10 === Math.floor(i % 10) && i % 10 >= 2 && i % 10 <= 4 && !(i % 100 >= 12 && i % 100 <= 14)) return locale.few;
                        if ('many' in locale && (i % 10 === 0 || i % 10 === Math.floor(i % 10) && i % 10 >= 5 && i % 10 <= 9 || i % 100 === Math.floor(i % 100) && i % 100 >= 11 && i % 100 <= 14)) return locale.many;
                        if ('other' in locale) return locale.other;

                        return '';
                    }
                },
                onSelect: function onSelect(start, end) {
                    var txt = 'Диапазон дат: ';

                    if (start) {
                        txt += '<b>' + start.format('MM.DD') + '</b> - ';
                    }

                    if (start && end) {
                        setTimeout(function () {
                            if (parent.find('.is-in-range').length > 1) {
                                if (end) {
                                    txt += '<b>' + end.format('MM.DD') + '</b>';
                                } else {
                                    txt += '...';
                                }
                            }

                            if (!desktopMode()) {
                                var ret = rangeText(picker);
                                parent.closest('.mflcatalog-menu-item').find('.mflcatalog-menu-head').click().find('.filter-list-ihead-number').text('1').show();
                                parent.find('.datePickerValue').val(ret);
                            }

                            datePickerInfo.html(txt);
                        }, 200);
                    }
                }
            });

            parent.delegate('.cancelBtn', 'click', function () {
                picker.setDateRange('', '');
                parent.find('.datePickerValue').val('').trigger('change');
                dt.closest('.fcatalog').find('.filter-list-ihead').click().find('.filter-list-ihead-number').hide();
                dt.closest('.mflcatalog-menu-item').find('.mflcatalog-menu-head').click().find('.filter-list-ihead-number').hide();
            });

            parent.delegate('.applyBtn', 'click', function () {
                var txt = rangeText(picker);
                parent.closest('.fcatalog').find('.filter-list-ihead').click().find('.filter-list-ihead-number').text('1').show();
                parent.closest('.mflcatalog-menu-item').find('.mflcatalog-menu-head').click().find('.filter-list-ihead-number').text('1').show();
                parent.find('.datePickerValue').val(txt);
            });
        }

        createLightPicker(dt);
    });

    function rangeText(pkr) {
        var txt = '';
        var start = pkr.getStartDate();
        var end = pkr.getEndDate();

        if (start) {
            txt += start.format('MM/DD/YYYY') + ' - ';
        }
        if (end) {
            txt += end.format('MM/DD/YYYY');
        } else {
            txt += '...';
        }

        return txt;
    }

    // menu actions

    function getStyle(oElm, strCssRule) {
        if (!oElm || !strCssRule) return 0;

        var strValue = "";
        if (document.defaultView && document.defaultView.getComputedStyle) {
            strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
        } else if (oElm.currentStyle) {
            strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1) {
                return p1.toUpperCase();
            });
            strValue = oElm.currentStyle[strCssRule];
        }
        return strValue;
    }

    function menuClicker(path, root, step) {
        step++;

        if (step < path.length) {
            setTimeout(function () {
                var deep = root.find('> ul > .navbarSubmenu').eq(path[step]);

                deep.find('> .submenuLink').click();

                if (step < path.length) {
                    menuClicker(path, deep.find('> .megamenuHolder'), step);
                }
            }, 300);
        }
    }

    function menuMouseEnter(item) {
        var menu = item.find('.menuSub');
        var root = item.closest('.megamenuRoot');

        menuTimer = setTimeout(function () {
            var level = +item.closest('.menuLevel').addClass('__opened').attr('data-level');

            item.addClass('__hovered').siblings().removeClass('__hovered');

            root.find('.menuLevel').filter(function () {
                return +$(this).attr('data-level') > level + 1;
            }).addClass('__empty');

            var target = root.find('.menuLevel[data-level="' + (level + 1) + '"]').removeClass('__opened').removeClass('__empty');

            if (target.find('.scroll-content').length) {
                target = target.find('.scroll-content');
            }

            target.html('');

            setTimeout(function () {
                target.html(menu.clone().removeClass('mob-only').addClass('__cloned'));
            }, 5);
        }, menuDelay);
    }

    $body.delegate('.megamenuLink', 'mouseleave', function () {
        //var item = $(this).parent().removeClass('__hovered');
        //var level = +item.closest('.menuLevel').attr('data-level');

        menuTimer = setTimeout(function () {
            //$('.menuLevel[data-level="' + (level + 1) + '"]').addClass('__empty');
        }, menuDelay);
    }).delegate('.megamenuLink', 'mouseenter', function (e) {
        clearTimeout(menuTimer);

        if (desktopMode()) {
            var item = $(this).parent();

            if (!item.hasClass('__hovered')) {
                mouseClickTimer = setTimeout(function () {
                    menuMouseEnter(item);
                }, 10);
            }
        }
    }).delegate('.megamenuLink', 'click', function (e) {
        clearTimeout(mouseClickTimer);
        var btn = $(this);

        if (btn.attr('href') === '#') {
            if (!desktopMode()) {
                var item = btn.parent();
                var active = item.hasClass('active');

                //menuMouseEnter(item);

                if (item.hasClass('__sub')) {
                    var menuID = +btn.attr('data-menu');

                    item.toggleClass('active', !active).siblings().removeClass('active').parent().toggleClass('menu_active', !active).find('.menuSub').removeClass('translateIn').each(function (ind) {
                        var _this2 = this;

                        setTimeout(function () {
                            $(_this2).addClass('translateIn');
                        }, 50);
                    });

                    item.closest('.megamenuHolder').removeClass('translateIn').attr('data-level', menuID - (active ? 1 : 0)).each(function (ind) {
                        var _this3 = this;

                        setTimeout(function () {
                            $(_this3).addClass('translateIn');
                        }, 50);
                    });

                    item.find('.menuLevel').toggleClass('__opened', !active).toggleClass('__empty', !active);
                }

                return false;
            }
        }
    }).delegate('.menuLevel', 'mouseenter', function () {
        clearTimeout(menuLeaveTimer);
        if (desktopMode()) {
            var item = $(this);
            var level = +item.attr('data-level');

            menuLeaveTimer = setTimeout(function () {
                item.addClass('__opened');
                item.siblings('.menuLevel').filter(function () {
                    return +$(this).attr('data-level') < level;
                }).removeClass('__empty').addClass('__opened');
            }, 10);
        }
    }).delegate('.menuLevel', 'mouseleave', function () {
        if (desktopMode()) {
            var item = $(this);
            var level = +item.attr('data-level');

            menuLeaveTimer = setTimeout(function () {
                item.removeClass('__opened');
                item.siblings('.menuLevel').filter(function () {
                    return +$(this).attr('data-level') >= level;
                }).removeClass('__opened').addClass('__empty');
            }, 10);
        }
    }).delegate('.megamenuRoot, .header, .navbarSubmenu', 'mouseleave', function () {
        clearTimeout(submenuOpenTimer);
        if (desktopMode()) {
            var root = $(this);

            noDelayTimer = setTimeout(function () {
                $('.submenuList').removeClass('no_dropdown_delay');
            }, 150);

            menuLeaveTimer = setTimeout(function () {
                root.removeClass('hover_menu').find('.menuLevel').removeClass('__opened').filter(function () {
                    return +$(this).attr('data-level') > 1;
                }).addClass('__empty');
            }, 20);
        }
    });

    $('.submenuLink').on('click', function () {
        var link = $(this);

        if (link.attr('href') === '#' || !desktopMode()) {
            var menu = link.parent();
            var active = menu.hasClass('active');
            var goto = link.attr('data-goto');

            if (goto) {
                var menuPath = goto.split('-');
                menuClicker(menuPath, $('.navLink ').eq(menuPath[0]).click().next(), 0);
            } else {
                $('.navbarSubmenu').removeClass('active');

                menu.toggleClass('active', !active).siblings().removeClass('active', !active).parent().toggleClass('menu_active');

                menu.find('.megamenuHolder').removeClass('translateIn').attr('data-level', 0).each(function () {
                    var _this4 = this;

                    setTimeout(function () {
                        $(_this4).addClass('translateIn');
                    }, 10);
                });

                if (active) {
                    menu.find('.menuLevel').removeClass('__opened').removeClass('__empty').filter(function () {
                        return +$(this).attr('data-level') !== 1;
                    }).addClass('__empty');
                } else {}
            }

            return false;
        }
    });

    $('.showMoreContacts').on('click', function () {
        $(this).parent().hide().closest('.conatctScroller').find('.moreContactsBlock').slideDown();
        return false;
    });

    $('.navbarMegamenuItem').on('mouseenter', function () {
        if (desktopMode()) {
            var m = $(this);

            if (!m.hasClass('__hovered')) {
                var menu = $(this).closest('.menuLevel');

                setTimeout(function () {
                    menu.prevAll('.menuLevel').each(function () {
                        this.scrollTop = 0;

                        $(this).find('.menuSub, .scrollReset').each(function () {
                            this.scrollTop = 0;
                        });
                    });
                }, 1);
            }
        }
    });

    $('.navbarSubmenu').on('mouseenter', function () {
        var _this5 = this;

        if (desktopMode()) {
            clearTimeout(noDelayTimer);

            submenuOpenTimer = setTimeout(function () {
                var subMenu = $(_this5).addClass('hover_menu');

                subMenu.find('.scrollReset, .menuLevel').each(function () {
                    this.scrollTop = 0;
                });

                setTimeout(function () {
                    subMenu.parent().addClass('no_dropdown_delay');
                }, 150);

                var menuInner = subMenu.find('.navbar-megamenu_inner');
                var menuContent = menuInner.children('.container');
                var paddings = parseInt(getStyle(menuInner[0], 'padding-top')) + parseInt(getStyle(menuInner[0], 'padding-bottom'));

                document.documentElement.style.setProperty('--subMenuHeight', (menuContent.outerHeight() || 200) + paddings + 'px');
            }, submenuOpenDelay);
        }
    });

    $('.navLink').on('click', function () {
        if (desktopMode()) {} else {
            var link = $(this);
            var menu = link.parent();
            var active = menu.hasClass('active');

            //$('.headerLogo').html(link.children('span').clone()).closest('a').attr('href', link.attr('href'));

            $('.navbarSubmenu').removeClass('active');

            menu.toggleClass('active', !active).siblings().removeClass('active', !active).parent().toggleClass('menu_active');

            menu.find('.megamenuHolder').removeClass('translateIn').attr('data-level', 0).each(function (ind) {
                var _this6 = this;

                setTimeout(function () {
                    $(_this6).addClass('translateIn');
                }, 10);
            });

            if (active) {
                menu.find('.menuLevel').removeClass('__opened').removeClass('__empty').filter(function () {
                    return +$(this).attr('data-level') !== 1;
                }).addClass('__empty');
            } else {
                menu.find('.menu_active').removeClass('menu_active');
            }

            return false;
        }
    });

    // stick blocks

    $('.stickMe').each(function () {
        var $sticky = $(this);
        var $stickParent = $sticky.closest('.stickParent');
        var $innerTop = $stickParent.find('.fixNavMarker');
        var stickTop = ($sticky.attr('data-stick-top') || 0) * 1;
        var stickBottomEnd = ($sticky.attr('data-stick-bottom-end') || 0) * 1;

        var params = {
            //innerSticker: $stickTo[0],
            stickTo: $stickParent[0] || 'body',
            top: stickTop,
            bottom: stickBottomEnd,
            onStart: function onStart() {
                if (smoothMode) {
                    $(this).css('transform', 'translateY(none)').addClass('sticky-start').removeClass('sticky-end');
                }
            },
            onStop: function onStop(hc) {
                if (smoothMode) {
                    var block = $(this);

                    if (block.hasClass('sticky-start')) {
                        block.addClass('sticky-end').removeClass('sticky-start');
                        block.css('transform', -$stickParent.offset().top > hc.bottomEnd || lastScroll > $innerTop.offset().top ? 'translateY(' + hc.bottomEnd + 'px)' : 'none');
                    }
                }
            }
        };

        if ($innerTop.length) {
            params.innerTop = $innerTop.position().top;
        }

        $sticky.hcSticky(params);
    });

    // community slider

    $body.delegate('.videoMuted', 'click', function () {
        var btn = $(this);
        var muted = btn.hasClass('muted');
        var video = $(this).parent().find('video');

        if (muted) {
            btn.removeClass('muted');
            video[0].muted = false;
        } else {
            btn.addClass('muted');
            video[0].muted = true;
        }

        console.log('muted', video[0].muted, video[0]);

        return false;
    });

    function checkVideoSizes(video) {
        $(video).addClass('fit-' + (video.videoWidth > video.videoHeight ? 'height' : 'width'));
    }

    function swiperVideo(swp, cmd, init) {
        swp.slides.each(function () {
            var slide = $(this);
            var slideIndex = slide.attr('data-swiper-slide-index');

            //if (slide.hasClass('swiper-slide-duplicate')) {
            //    slide = swp.slides.filter(function () {
            //        return $(this).attr('data-swiper-slide-index') === slideIndex;
            //    });
            //}

            var video = slide.find('.playVideo');

            if (video.length) {
                if (init) {

                    video[0].addEventListener("canplay", function () {
                        slide.addClass('canplay');
                        checkVideoSizes(this);
                    });

                    video[0].addEventListener("canplaythrough", function () {
                        slide.addClass('canplay');
                        checkVideoSizes(this);
                    });

                    video[0].addEventListener("ended", function () {
                        setTimeout(function () {
                            slide.addClass('ended');
                        }, 50);
                    });

                    if (slide.is(':visible')) {
                        setTimeout(function () {
                            video[0].play();
                        }, 50);
                    }
                }

                if (cmd === 'pause') {
                    $('.playVideo').each(function (ind) {
                        this.pause();
                    });
                } else {
                    if (slide.hasClass('swiper-slide-active') && slide.hasClass('canplay')) {
                        if (video[0].readyState !== 4) {
                            video[0].load();
                        }

                        video[0].play();
                    } else {
                        video[0].pause();
                    }
                }
            }
        });
    }

    var swiperCommunityHero = $('.swiperCommunityHero');

    swiperCommunityHero.each(function (ind) {
        var $el = $(this);

        var swp = new Swiper(this, {
            spaceBetween: 0,
            slidesPerView: 1,
            speed: 700,
            pagination: false,
            navigation: {
                nextEl: $el.find('.swiperCommunityHeroNext')[0],
                prevEl: $el.find('.swiperCommunityHeroPrev')[0]
            },
            autoplay: false,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            setWrapperSize: true,
            loop: false,
            on: {
                init: function init() {
                    var _this7 = this;

                    setTimeout(function () {
                        swiperVideo(_this7, 'play', true);
                    }, 10);
                },
                slideChangeTransitionStart: function slideChangeTransitionStart() {
                    swiperVideo(this, 'pause');
                },
                slideChangeTransitionEnd: function slideChangeTransitionEnd() {
                    var _this8 = this;

                    setTimeout(function () {
                        swiperVideo(_this8, 'play');
                    }, 10);
                }
            }
        });
    });

    // hero slider

    var bulletLineDelay = 30;
    var tabSpeed = 1000;
    var heroSlideSpeed = 1000;
    var heroDelay = 10000;
    var swiperHero = $('#swiperHero');
    var swiperHeroMarket = $('#swiperHeroMarket');

    var swiperHeroThumbs = new Swiper(swiperHero[0], {
        spaceBetween: 0,
        slidesPerView: 3,
        centeredSlides: true,
        //slidesPerView: 2,
        //slidesPerView: 4,
        speed: heroSlideSpeed,
        pagination: {
            el: '#swiperHeroPagination',
            clickable: true,
            renderBullet: function renderBullet(index, className) {
                return '<span data-index="' + index + '" class="heroBullet ' + className + '"></span>';
            }
        },
        navigation: {
            nextEl: '#swiperHeroNext',
            prevEl: '#swiperHeroPrev'
        },
        autoplay: {
            delay: heroDelay,
            disableOnInteraction: false
        },
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        setWrapperSize: true,
        loop: true,
        on: {
            init: function init() {
                setTimeout(function () {
                    heroLine();
                }, 1);
            },
            slideChange: function slideChange() {
                heroLine();
            }
            //breakpoints: {
            //    768: {
            //        slidesPerView: 2,
            //        centeredSlides: false
            //    }
            //}
        } });

    var swiperHeroThumbsMarket = new Swiper(swiperHeroMarket[0], {
        spaceBetween: 0,
        slidesPerView: 1,
        centeredSlides: true,
        //slidesPerView: 2,
        //slidesPerView: 4,
        speed: heroSlideSpeed,
        pagination: {
            el: '#swiperHeroPagination',
            clickable: true,
            renderBullet: function renderBullet(index, className) {
                return '<span data-index="' + index + '" class="heroBullet ' + className + '"></span>';
            }
        },
        navigation: {
            nextEl: '#swiperHeroNext',
            prevEl: '#swiperHeroPrev'
        },
        autoplay: {
            delay: heroDelay,
            disableOnInteraction: false
        },
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        setWrapperSize: true,
        loop: true,
        on: {
            init: function init() {
                setTimeout(function () {
                    heroLine();
                }, 1);
            },
            slideChange: function slideChange() {
                heroLine();
            }
            //breakpoints: {
            //    768: {
            //        slidesPerView: 2,
            //        centeredSlides: false
            //    }
            //}
        } });

    var initSwiperSelection = false;
    var swiperSelection;
    var paginator = $('#swiperHeroPagination');

    if ($('#swiperSelection').length) {
        swiperSelection = new Swiper('#swiperSelection .swiper-container', {
            init: false,
            slidesPerView: 'auto',
            spaceBetween: 0,
            scrollbar: {
                el: '#swiperSelection .swiper-scrollbar',
                hide: false
            }
        });

        resizeFunc.push('updateSwiperSelection');
    }

    document.documentElement.style.setProperty('--tabSpeed', tabSpeed + 'ms');
    document.documentElement.style.setProperty('--heroSliderSpeed', heroSlideSpeed + 'ms');
    document.documentElement.style.setProperty('--heroSliderDelay', heroDelay + 'ms');
    document.documentElement.style.setProperty('--bulletLineDelay', heroSlideSpeed + heroDelay - bulletLineDelay + 'ms');

    function heroLine() {
        if (paginator && paginator.length) {
            var bullets = paginator.find('.swiper-pagination-bullet');

            if (bullets.length) {
                paginator.find('.heroBulletLine').remove();

                var activeBullet = bullets.filter(function () {
                    return $(this).hasClass('swiper-pagination-bullet-active');
                });

                if (!activeBullet.length) {
                    activeBullet = bullets[0];
                }

                activeBullet.append('<span class="heroBulletLine hero-bullet_line"></span>');

                setTimeout(function () {
                    paginator.find('.heroBulletLine').addClass('__run');
                }, bulletLineDelay);
            } else {
                setTimeout(function () {
                    heroLine();
                }, 10);
            }
        } else {
            setTimeout(function () {
                paginator = $('#swiperHeroPagination');
                heroLine();
            }, 10);
        }
    }

    // tabs

    $('.navbarAuthBtn').on('click', function () {
        var tab = $(this);
        var isActive = tab.parent().hasClass('active');
        var popup = $(tab.attr('href'));

        if (popup.length && desktopMode()) {
            popup.modal({ show: false });
            popup.modal('show');
        } else {
            //$('.navbarAuthBlock').html(isActive ? '' : popup.find('.modal-body').clone());
            tab.parent().toggleClass('active', !isActive).siblings().removeClass('active');
        }

        return false;
    });

    $('.tabBtn').on('click', function () {
        var tab = $(this);

        if (tab.parent().hasClass('active')) {
            return false;
        }

        var index = tab.attr('data-tab');
        var tabHolder = tab.closest('.tabHolder');

        if (!tabHolder.hasClass('busy')) {
            tabHolder.addClass('busy');
            var tabWrapper = tabHolder.find('.tabWrapper');
            tab.closest('li').addClass('active').siblings().removeClass('active');

            tabWrapper.css('height', tabWrapper.outerHeight()).find('.active').addClass('prev_active');

            var nextTab = tabHolder.find('.tabPanel').removeClass('active').filter(function () {
                return $(this).attr('data-tab') === index;
            }).addClass('next_active');

            setTimeout(function () {
                nextTab.addClass('active');

                tabWrapper.animate({ height: nextTab.outerHeight() }, tabSpeed, function () {
                    tabWrapper.removeAttr('style');
                });

                setTimeout(function () {
                    nextTab.removeClass('next_active');
                    tabHolder.removeClass('busy').find('.tabPanel').removeClass('prev_active');
                }, tabSpeed);
            }, 50);
        }

        return false;
    });

    function breadcrumbsFix() {
        if ($($('.breadcrumb').length)) {
            var _bread = $('.breadcrumb'),
                _bread_width = _bread.width(),
                _bread_li = _bread.find('li'),
                _bread_summ = 0;

            _bread_li.each(function () {
                _bread_summ = _bread_summ + $(this).outerWidth(true);
            });
            if (_bread_width < _bread_summ) {
                $('.breadcrumb').addClass('fixbread');
            } else {
                $('.breadcrumb').removeClass('fixbread');
            }
        }
    }

    breadcrumbsFix();

    // scrolls
    $('.link-scroll').on('click', function () {
        var link = $(this);
        var _target = $(link.attr('href'));

        if (_target.length) {
            scrollBusy = true;

            var _targetPadding = parseInt(getStyle(_target[0], 'padding-top'));
            var scrollTo = _target.offset().top - $header.outerHeight() - _targetPadding;

            if (smoothMode) {
                $({ count: lastScroll || 0 }).animate({ count: scrollTo + (lastScroll || 0) }, {
                    duration: 777,
                    step: function step() {
                        Scrollbar.getAll()[0].scrollTop = this.count;
                    },
                    complete: function complete() {
                        setTimeout(function () {
                            scrollBusy = false;
                            letterScrollTo(link);
                        }, 5);
                    }
                });
            } else {
                $html.stop().animate({
                    scrollTop: scrollTo
                }, 777, function () {
                    setTimeout(function () {
                        scrollBusy = false;
                        letterScrollTo(link);
                    }, 5);
                });
            }
        }
        return false;
    });

    // brands more
    $('.brands-more').on('click', function () {
        $(this).hide(0);
        $('.name-lastvisible').nextAll('.brands-name').addClass('active');
        return false;
    });
    $('.brands-name').hover(function () {
        var datavalue = $(this).data('brand');
        $('.brands-name').filter(function (elem) {
            return $(this).attr("data-brand") == datavalue;
        }).addClass('letterhover');
    }, function () {
        $('.brands-name').each(function () {
            $(this).removeClass('letterhover');
        });
    });

    // input number
    if ($('.quantity').length) {
        $('<button class="quantity-button quantity-up"></button><button class="quantity-button quantity-down" disabled="disabled"></button>').insertAfter('.quantity input');
        $('.quantity').each(function () {
            var spinner = $(this),
                input = spinner.find('input[type="number"]'),
                btnUp = spinner.find('.quantity-up'),
                btnDown = spinner.find('.quantity-down'),
                min = input.attr('min'),
                max = input.attr('max'),
                i = 1;

            $(this).append('<ul></ul>');

            while (i <= max) {
                $(this).find('ul').append('<li><span>' + i + ' шт.</span></li>');
                i++;
            }
            ;

            if (min === max) {
                btnUp.prop('disabled', true);
            }

            btnUp.click(function () {
                var oldValue = parseFloat(input.val()),
                    offsettop = parseInt(spinner.find('ul').css('top'));

                console.log(offsettop);

                if (btnUp.prop('disabled') === false) {
                    btnUp.addClass('rotate');
                    setTimeout(function () {
                        btnUp.removeClass('rotate');
                    }, 500);
                }
                if (oldValue >= max) {
                    var newVal = oldValue;
                    btnUp.prop('disabled', true);
                } else {
                    var newVal = oldValue + 1;
                    spinner.find('ul').stop(0, 1).animate({
                        top: -oldValue * 52
                    }, 500);
                }
                if (newVal >= max) {
                    btnUp.prop('disabled', true);
                } else {
                    btnUp.prop('disabled', false);
                }
                if (newVal <= min) {
                    btnDown.prop('disabled', true);
                } else {
                    btnDown.prop('disabled', false);
                }
                spinner.find("input").val(newVal);
                spinner.find("input").trigger("change");
            });

            btnDown.click(function () {
                var oldValue = parseFloat(input.val()),
                    offsettop = parseInt(spinner.find('ul').css('top'));

                if (btnDown.prop('disabled') === false) {
                    btnDown.addClass('rotateminus');
                    setTimeout(function () {
                        btnDown.removeClass('rotateminus');
                    }, 500);
                }

                if (oldValue <= min) {
                    var newVal = oldValue;
                } else {
                    var newVal = oldValue - 1;
                    spinner.find('ul').stop(0, 1).animate({
                        top: -(newVal - 1) * 52
                    }, 500);
                }
                if (newVal >= max) {
                    btnUp.prop('disabled', true);
                } else {
                    btnUp.prop('disabled', false);
                }
                if (newVal <= min) {
                    btnDown.prop('disabled', true);
                } else {
                    btnDown.prop('disabled', false);
                }
                spinner.find("input").val(newVal);
                spinner.find("input").trigger("change");
            });
        });
    }

    // input number cart
    if ($('.quantity-mini').length) {
        $('<button class="quantity-mini-button quantity-mini-up"></button><button class="quantity-mini-button quantity-mini-down" disabled="disabled"></button>').insertAfter('.quantity-mini input');

        $('.quantity-mini').each(function () {
            var spinner = $(this),
                input = spinner.find('input[type="number"]'),
                btnUp = spinner.find('.quantity-mini-up'),
                btnDown = spinner.find('.quantity-mini-down'),
                min = input.attr('min'),
                max = input.attr('max'),
                i = 1;

            $(this).append('<div class="quantity-mini-ul"><ul></ul></div>');

            while (i <= max) {
                $(this).find('ul').append('<li><span>' + i + ' шт.</span></li>');
                i++;
            }
            ;

            if (min === max) {
                btnUp.prop('disabled', true);
            }

            if (input.val() > 1) {
                spinner.find('ul').stop(0, 1).animate({
                    top: -(input.val() - 1) * 40
                }, 500);
                btnDown.prop('disabled', false);
                if (input.val() === max) {
                    btnUp.prop('disabled', true);
                } else {
                    btnUp.prop('disabled', false);
                }
            }

            btnUp.click(function () {
                var oldValue = parseFloat(input.val()),
                    offsettop = parseInt(spinner.find('ul').css('top'));

                if (btnUp.prop('disabled') === false) {
                    btnUp.addClass('rotate');
                    setTimeout(function () {
                        btnUp.removeClass('rotate');
                    }, 500);
                }
                if (oldValue >= max) {
                    var newVal = oldValue;
                    btnUp.prop('disabled', true);
                } else {
                    var newVal = oldValue + 1;
                    spinner.find('ul').stop(0, 1).animate({
                        top: -oldValue * 40
                    }, 500);
                }
                if (newVal >= max) {
                    btnUp.prop('disabled', true);
                } else {
                    btnUp.prop('disabled', false);
                }
                if (newVal <= min) {
                    btnDown.prop('disabled', true);
                } else {
                    btnDown.prop('disabled', false);
                }
                spinner.find("input").val(newVal);
                spinner.find("input").trigger("change");
            });

            btnDown.click(function () {
                var oldValue = parseFloat(input.val()),
                    offsettop = parseInt(spinner.find('ul').css('top'));

                if (btnDown.prop('disabled') === false) {
                    btnDown.addClass('rotateminus');
                    setTimeout(function () {
                        btnUp.removeClass('rotateminus');
                    }, 500);
                }
                if (oldValue <= min) {
                    var newVal = oldValue;
                } else {
                    var newVal = oldValue - 1;
                    spinner.find('ul').stop(0, 1).animate({
                        top: -(newVal - 1) * 40
                    }, 500);
                }
                if (newVal >= max) {
                    btnUp.prop('disabled', true);
                } else {
                    btnUp.prop('disabled', false);
                }
                if (newVal <= min) {
                    btnDown.prop('disabled', true);
                } else {
                    btnDown.prop('disabled', false);
                }
                spinner.find("input").val(newVal);
                spinner.find("input").trigger("change");
            });
        });
    }

    // link to upslide
    $('.link-upslide').on('click', function () {
        $(this).parents('.block-upslide').slideUp('fast');
        return false;
    });

    // search
    $(document).on('click', '.search-mobiletoggle, .header-btnsearch', function (event) {
        $('html').addClass('fixscroll');
        $('.layoutglobal').addClass('active');
        $body.addClass('menu-opened');
        $('.searchmobile').addClass('active');
        $('.searchmobile .search-field').focus();
        console.log('asdasdasd');
        return false;
    });

    $('.search-mobileclose').on('click', function () {
        $('html').removeClass('fixscroll');
        $('.layoutglobal').removeClass('active');
        $body.removeClass('menu-opened');
        $('.searchmobile').removeClass('active');
        return false;
    });

    $('.search-field').on('focus', function () {
        if ($(this).hasClass('fieldinside')) {
            $(this).parents('.search').addClass('searchanimate');
            $(this).parents('.search').addClass('active');
            $(this).nextAll('.search-popup').delay(500).slideDown('fast');
        } else {
            $(this).nextAll('.search-popup').slideDown('fast');
            $(this).parents('.search').addClass('active');
        }
    });

    $('.search .layoutwhite').on('click', function () {
        $(this).parents('.search').removeClass('searchanimate');
        $('.search-popup').slideUp('fast');
        $('.search').removeClass('active');
        $('.search-field').blur();
    });

    planesettings();
    planefly();
    if ($('.selections').length) {
        var swiperSelectionTab00 = new Swiper('#tabsl-00', {
            init: false,
            slidesPerView: 'auto',
            spaceBetween: 0,
            scrollbar: {
                el: '#tabc00 .swiper-scrollbar',
                hide: false
            }
        });

        var swiperSelectionTab01 = new Swiper('#tabsl-01', {
            init: false,
            slidesPerView: 'auto',
            spaceBetween: 0,
            scrollbar: {
                el: '#tabc01 .swiper-scrollbar',
                hide: false
            }
        });

        var swiperSelectionTab02 = new Swiper('#tabsl-02', {
            init: false,
            slidesPerView: 'auto',
            spaceBetween: 0,
            scrollbar: {
                el: '#tabc02 .swiper-scrollbar',
                hide: false
            }
        });
    }

    var init00 = false;
    var init01 = false;
    var init02 = false;

    $('.tabPanel').each(function () {
        var tab = $(this);
        var tabsAlone = tab.find('.swiper-container');

        if (tabsAlone.length) {
            var swiperSelectionTabAlone = new Swiper(tabsAlone[0], {
                init: false,
                slidesPerView: 'auto',
                spaceBetween: 0,
                scrollbar: {
                    el: tabsAlone.parent().find('.swiper-scrollbar')[0],
                    hide: false
                }
            });

            swiperSelectionTabAlone.init();
        }
    });

    function offsetsSwiperTabs() {
        swiperSelectionTab00.params.slidesOffsetBefore = parseInt($('.selections').offset().left);
        swiperSelectionTab00.params.slidesOffsetAfter = parseInt($('.selections').offset().left);
        swiperSelectionTab00.update(!0);
        0 === swiperSelectionTab00.activeIndex && swiperSelectionTab00.slideTo(0);

        swiperSelectionTab01.params.slidesOffsetBefore = parseInt($('.selections').offset().left);
        swiperSelectionTab01.params.slidesOffsetAfter = parseInt($('.selections').offset().left);
        swiperSelectionTab01.update(!0);
        0 === swiperSelectionTab01.activeIndex && swiperSelectionTab01.slideTo(0);

        swiperSelectionTab02.params.slidesOffsetBefore = parseInt($('.selections').offset().left);
        swiperSelectionTab02.params.slidesOffsetAfter = parseInt($('.selections').offset().left);
        swiperSelectionTab02.update(!0);
        0 === swiperSelectionTab02.activeIndex && swiperSelectionTab02.slideTo(0);
    };

    $('.selections-nav a').on('click', function () {
        $(this).parent('li').addClass('active').siblings('li').removeClass('active');
        $($(this).attr('href')).addClass('active').siblings('div').removeClass('active').find('.selections-blockdes, .selections-sl').css({ opacity: '0' });
        planesettings();
        planefly();
        return false;
    });

    function cnavScrollCallback(btnselect) {
        $(btnselect.attr('href')).addClass('active').siblings('div').removeClass('active');
        if ($('#tabsl-00').is(':visible') && !init00) {
            init00 = true;
            swiperSelectionTab00.init();
            offsetsSwiperTabs();
        } else if ($('#tabsl-01').is(':visible') && !init01) {
            init01 = true;
            swiperSelectionTab01.init();
            offsetsSwiperTabs();
        } else if ($('#tabsl-02').is(':visible') && !init02) {
            init02 = true;
            swiperSelectionTab02.init();
            offsetsSwiperTabs();
        } else {
            offsetsSwiperTabs();
        }
    }

    $('.selections-cnav').on('click', function () {
        var btnselect = $(this),
            selectSl = $(btnselect.attr('href')).find('.selections-sl')[0];
        var pos = $('.selections').offset().top - $('header').height() - 16;

        if (smoothMode) {
            htmlAnimate(pos, 500, function () {
                cnavScrollCallback(btnselect);
            });
        } else {
            $('html').stop(1, 1).animate({
                scrollTop: pos
            }, 500, function () {
                cnavScrollCallback(btnselect);
            });
        }

        return false;
    });

    $('.header-nav > li').hover(function () {
        $(this).find('.header-sub').fadeIn(300);
        $('.headerlayout').addClass('active');
        $('.header-menu-popup').fadeIn(0).stop(1, 1).animate({
            height: $(this).find('.header-sub').outerHeight(true)
        }, 300);

        $('.search.active .layoutwhite').trigger('click');
    }, function () {
        $(this).find('.header-sub').stop(1, 1).fadeOut(0);
    });
    $('.header-nav').mouseleave(function () {
        $('.headerlayout').removeClass('active');
        $('.header-menu-popup').stop(1, 1).fadeOut(0).css({ height: '0' });
    });

    $(document).on('click', '.header-btnmenu, .layoutglobal', function (event) {
        var active = $(this).hasClass('active');
        $('.header-btnmenu').toggleClass('active', !active);
        $('header').toggleClass('openmenu', !active);
        $('html').toggleClass('fixscroll', !active);
        $('.layoutglobal').toggleClass('active', !active);
        $body.toggleClass('menu-opened', !active);
        $('.globalmenu').toggleClass('active', !active);
        return false;
    });

    $(document).mouseup(function (e) {
        var div = $('.search'),
            div_popup = $('.search-popup'),
            _mobalmenu = $('.globalmenu'),
            _mobalmenu_content = _mobalmenu.find('.globalmenu-body'),
            _msearch = $('.searchmobile'),
            _msearch_content = _msearch.find('.searchmobile-body');

        if (!div.is(e.target) && div.has(e.target).length === 0) {
            div_popup.slideUp('fast');
            div.removeClass('active');
        }

        /*if (_mobalmenu.hasClass('active')) {
            if (!_mobalmenu_content.is(e.target) && _mobalmenu_content.has(e.target).length === 0) {
                $('.header-btnmenu').trigger('click');
            }
            if ($('.header-btnmenu').is(e.target)) {
                $('.header-btnmenu').trigger('click');
            }
        }
         if (_msearch.hasClass('active')) {
            if (!_msearch_content.is(e.target) && _msearch_content.has(e.target).length === 0 && $(window).width() < 992) {
                $('.search-mobileclose').trigger('click');
            }
        }*/
    });

    var height_mcatalog = $('.mcatalog').height();

    $('.mcatalog-tosubmenu').on('click', function () {
        var height_mcatalogsub = $(this).next('.mcatalog-sub').outerHeight(true);

        if ($(this).parent('li').hasClass('active')) {
            $('.mcatalog').animate({
                height: height_mcatalog
            }, 500);
        } else {
            $('.mcatalog').animate({
                height: height_mcatalogsub
            }, 500);
        }
        $(this).parent('li').toggleClass('active').siblings('li').toggleClass('noactive');
        return false;
    });

    function resizeFuncItarator() {
        for (var i = 0; i < resizeFunc.length; i++) {
            var fn = window[resizeFunc[i]];
            if (fn && typeof fn === 'function') fn();
        }
    }

    window.updateSwiperSelection = function () {
        if ($(window).width() > 991) {
            if (initSwiperSelection && swiperSelection) {
                swiperSelection.destroy(false);
                initSwiperSelection = false;
            }
        } else {
            if (!initSwiperSelection && swiperSelection) {
                initSwiperSelection = true;
                swiperSelection.init();
                offsetsSwiperTabs();
            }
        }
    };

    window.updateScrollOverflow = function () {
        if (!desktopMode()) {
            $('.brands-scroll[data-scrollbar]').each(function (ind) {
                var br = $(this);
                var brW = Math.floor(br.outerWidth() - parseInt(getStyle(br[0], 'padding-left')));
                var brCap = br.find('.brands-caption');
                var brCnt = br.find('.brands-counter');

                br.toggleClass('has-overflow-x', Math.floor(brCap.outerWidth() + brCnt.outerWidth() + parseInt(getStyle(brCnt[0], 'margin-left'))) > brW);
            });
        }
    };

    if ($('.brands-scroll[data-scrollbar]').length) {
        resizeFunc.push('updateScrollOverflow');
    }

    function seotextCalc() {
        $('.seotext-slide').each(function () {
            if ($(this).height() > 268 && $(window).width() > 991) {
                $(this).addClass('active slactive');
            }
            if ($(this).height() > 416 && $(window).width() < 992) {
                $(this).addClass('active slactive');
            }
        });
    }

    seotextCalc();


    function settSelections() {
        if ($(window).width() > 991) {
            if (init00) {
                swiperSelectionTab00.destroy(false);
                init00 = false;
            }
            if (init01) {
                swiperSelectionTab01.destroy(false);
                init01 = false;
            }
            if (init02) {
                swiperSelectionTab02.destroy(false);
                init02 = false;
            }
        } else {
            if (!init00 || !init01 || !init02) {
                if ($('#tabsl-00').is(':visible') && init00 == false) {
                    init00 = true;
                    swiperSelectionTab00.init();
                    offsetsSwiperTabs();
                }
                if ($('#tabsl-01').is(':visible') && init01 == false) {
                    init01 = true;
                    swiperSelectionTab01.init();
                    offsetsSwiperTabs();
                }
                if ($('#tabsl-02').is(':visible') && init02 == false) {
                    init02 = true;
                    swiperSelectionTab02.init();
                    offsetsSwiperTabs();
                }
            }
        }
    }

    if ($('.mainicatalog').length) {
        widthMainInviteCatalog();
    }
    if ($('.brandsalph').length) {
        widthAlphabet();
    }
    if ($('.filter-result').length) {
        widthFilterResult();
    }
    if ($('.selections').length) {
        settSelections();
    }

    $('.header-location-true').on('click', function () {
        $(this).parents('.header-location').addClass('hidden-btns');
        return false;
    });

    function scrollBreadcrumbs() {
        var breadcrumbScroller = $('.breadcrumbScroller');

        if (!desktopMode() && breadcrumbScroller.length) {
            if (smoothMode) {
                var scrollBars = smBars.filter(function (s) {
                    return s.name === 'breadcrumbScroller';
                });

                var _loop3 = function _loop3(i) {
                    var scrollBar = scrollBars[i].sm;

                    $({ count: scrollBar.scrollLeft }).animate({ count: scrollBar.limit.x }, {
                        duration: scrollBar.limit.x * 5,
                        step: function step() {
                            scrollBar.scrollLeft = this.count;
                        },
                        complete: function complete() {
                            var _this9 = this;

                            setTimeout(function () {
                                scrollBar.scrollLeft = _this9.count + 5;
                            }, 10);
                        }
                    });
                };

                for (var i = 0; i < scrollBars.length; i++) {
                    _loop3(i);
                }
            } else {
                var scrLeft = 0;
                breadcrumbScroller.find('li').each(function () {
                    scrLeft += $(this).outerWidth();
                });

                breadcrumbScroller.animate({
                    scrollLeft: scrLeft
                }, 1000);
            }
        }
    }

    function fixWebkitStyle() {
        currentVH = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        var cv = $('#custom_values'),
            css = '.viewport_height {height: ' + currentVH + 'px; min-height: ' + currentVH + 'px;}';

        mainPaddingTop = parseInt(getStyle($mainContant[0], 'padding-top'));

        document.documentElement.style.setProperty('--currentVH', currentVH + 'px');

        if (cv.length) {
            cv.text(css);
        } else {
            var head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

            style.id = 'custom_values';
            style.type = 'text/css';
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);
        }
    }

    $(window).on('resize', function () {
        if (isMobile() || $(window).width() <= 991) {
            $('.selections-item.active').find('.selections-body').slideDown(0);
            if ($('.selections').length) {
                offsetsSwiperTabs();
            }
        }
        breadcrumbsFix();
        if ($('.selections').length) {
            settSelections();
        }
        if ($('.mainicatalog').length) {
            widthMainInviteCatalog();
        }
        if ($('.brandsalph').length) {
            widthAlphabet();
        }
        if ($('.filter-result').length) {
            widthFilterResult();
        }
        planesettings();
        seotextCalc();

        resizeFuncItarator();
    }).trigger('resize');

    $(window).on('load', function () {
        setTimeout(function () {
            checkNav();
            planesettings();
        }, 100);
    }).on('resize scroll load', function () {
        clearTimeout(scrollTimer);

        scrollTimer = setTimeout(function () {
            fixWebkitStyle();
        }, 100);
    }).on('orientationchange', function () {
        if (isMobile() || $(window).width() <= 991) {
            $('.selections-item.active').find('.selections-body').slideDown(0);
            if ($('.selections').length) {
                offsetsSwiperTabs();
            }
        }
        breadcrumbsFix();
        if ($('.selections').length) {
            settSelections();
        }
        if ($('.mainicatalog').length) {
            widthMainInviteCatalog();
        }
        if ($('.brandsalph').length) {
            widthAlphabet();
        }
        if ($('.filter-result').length) {
            widthFilterResult();
        }
        planesettings();
        seotextCalc();
    });

    $('.link-slidedown').on('click', function () {
        var cookie_block = $(this).parents('.cookieapply');
        cookie_block.animate({
            bottom: '-100%'
        }, 1000);
        return false;
    });

    function showCookieapply() {
        $('.cookieapply').animate({
            bottom: '0'
        }, 1000);
    }

    setTimeout(showCookieapply, 3000);

    if ($('.filter').length) {
        var checkstatus = function checkstatus() {
            $('.filter-list-item').each(function () {
                if ($(this).hasClass('wprice')) {
                    if (min == _vmin && max == _vmax) {
                        $(this).find('.filter-list-ihead-status').hide(0);
                    } else {
                        $(this).find('.filter-list-ihead-status').show('fast');
                    }
                } else {
                    var num_checks_checked = $(this).find('input:checked').length,
                        _btns_status = 0;

                    $(this).find('input').each(function () {
                        if ($(this).data('status') !== true && !$(this).is(':checked')) {} else {
                            _btns_status++;
                        }
                    });

                    if (_btns_status === 0) {
                        $(this).find('.filter-btns').slideUp('fast');
                    } else {
                        $(this).find('.filter-btns').slideDown('fast');
                    }

                    if (num_checks_checked > 0) {
                        $(this).find('.filter-list-ihead-number').show('fast').html(num_checks_checked);
                        $(this).find('.filter-list-ihead-status').show('fast');
                    } else {
                        $(this).find('.filter-list-ihead-number').hide(0);
                        $(this).find('.filter-list-ihead-status').hide(0);
                    }
                }
            });
        };

        var checkstatusfmobile = function checkstatusfmobile() {
            $('.mflcatalog-menu-item').each(function () {
                if ($(this).hasClass('wprice')) {
                    if (minmobile == _vmin_value_mobile && maxmobile == _vmax_value_mobile) {
                        $(this).find('.filter-list-ihead-status').hide(0);
                    } else {
                        $(this).find('.filter-list-ihead-status').show('fast');
                    }
                } else {
                    if (!$(this).hasClass('active')) {
                        $(this).find('input').each(function () {
                            if ($(this).is(':checked') && $(this).data('status') === false) {
                                //$(this).prop("checked", false);
                            }
                        });
                    }
                    var num_checks_checked = $(this).find('input:checked').length;

                    if (num_checks_checked > 0) {
                        $(this).find('.filter-list-ihead-number').show('fast').html(num_checks_checked);
                        $(this).find('.filter-list-ihead-status').show('fast');
                    } else {
                        $(this).find('.filter-list-ihead-number').hide(0);
                        $(this).find('.filter-list-ihead-status').hide(0);
                    }
                }
            });
        };

        var checkLiSiblings = function checkLiSiblings() {
            $('.flmenu li.flmenu-wsub').each(function () {
                if (!$(this).hasClass('active')) {
                    $(this).find('input').prop('checked', false);
                }
            });
        };

        var numberCheckCatalog = function numberCheckCatalog() {
            var _num_inputs_checked = $('.mflcatalog input:checked').length;
            if (_num_inputs_checked > 0) {
                $('.tocmobile .filter-list-ihead-number').show('fast').html(_num_inputs_checked);
            } else {
                $('.tocmobile .filter-list-ihead-number').hide('fast').html('0');
            }
        };

        // ui slider desktop
        var _vmin = $('.js-range-min').data('vrange'),
            _vmax = $('.js-range-max').data('vrange'),
            _vmin_value = $('.js-range-min').data('realvalue'),
            _vmax_value = $('.js-range-max').data('realvalue');

        $('.js-range-slider').slider({
            range: true,
            values: [_vmin_value, _vmax_value],
            min: _vmin,
            max: _vmax,
            slide: function slide(event, ui) {
                var min = ui.values[0],
                    max = ui.values[1];
                $('.js-range-min').val(min + ' ₽');
                $('.js-range-max').val(max + ' ₽');
                $('.js-range-result').html(min + ' ₽ – ' + max + ' ₽');
            },
            change: function change(event, ui) {
                var min = ui.values[0],
                    max = ui.values[1];
                $('.js-range-min').val(min + ' ₽');
                $('.js-range-max').val(max + ' ₽');
                $('.js-range-result').html(min + ' ₽ – ' + max + ' ₽');

                if (min == _vmin_value && max == _vmax_value) {
                    $('.filter-fprice-info').show('fast');
                    $('.filter-fprice-text').slideUp(0);
                    $('.filter-list-item.wprice .filter-btns').slideDown('fast');
                } else {
                    $('.filter-fprice-info').hide(0);
                    $('.filter-fprice-text').slideDown('fast');
                    $('.filter-list-item.wprice .filter-btns').slideDown('fast');
                }
            }
        });
        var min = $('.js-range-slider').slider('values', 0),
            max = $('.js-range-slider').slider('values', 1);
        $('.js-range-min').val(min + ' ₽');
        $('.js-range-max').val(max + ' ₽');
        $('.js-range-result').html(min + ' ₽ – ' + max + ' ₽');

        // ui slider mobile
        var _vmin_mobile = $('.js-range-minmobile').data('vrange'),
            _vmax_mobile = $('.js-range-maxmobile').data('vrange'),
            _vmin_value_mobile = $('.js-range-minmobile').data('realvalue'),
            _vmax_value_mobile = $('.js-range-maxmobile').data('realvalue');

        $('.js-range-slidermobile').slider({
            range: true,
            values: [_vmin_value_mobile, _vmax_value_mobile],
            min: _vmin_mobile,
            max: _vmax_mobile,
            slide: function slide(event, ui) {
                var min = ui.values[0],
                    max = ui.values[1];
                $('.js-range-minmobile').val(min + ' ₽');
                $('.js-range-maxmobile').val(max + ' ₽');
                $('.js-range-resultmobile').html(min + ' ₽ – ' + max + ' ₽');
            },
            change: function change(event, ui) {
                var min = ui.values[0],
                    max = ui.values[1];
                $('.js-range-minmobile').val(min + ' ₽');
                $('.js-range-maxmobile').val(max + ' ₽');
                $('.js-range-resultmobile').html(min + ' ₽ – ' + max + ' ₽');

                if (min == _vmin_value_mobile && max == _vmax_value_mobile) {
                    $('.filter-fprice-infomobile').show('fast');
                    $('.filter-fprice-textmobile').slideUp(0);
                    $('.mfilter-btn button').prop('disabled', true);
                } else {
                    $('.filter-fprice-infomobile').hide(0);
                    $('.filter-fprice-textmobile').slideDown('fast');
                    $('.mfilter-clear').slideDown('fast');
                    $('.mfilter-btn button').prop('disabled', false);
                }
            }
        });

        var minmobile = $('.js-range-slidermobile').slider('values', 0),
            maxmobile = $('.js-range-slidermobile').slider('values', 1);
        $('.js-range-minmobile').val(minmobile + ' ₽');
        $('.js-range-maxmobile').val(maxmobile + ' ₽');
        $('.js-range-resultmobile').html(minmobile + ' ₽ – ' + maxmobile + ' ₽');

        $('.filter-btngrey').on('click', function () {
            $(this).parents('.filter-btns').removeClass('active');
        });

        $('.filter-list-ihead').on('click', function () {
            $(this).parent().toggleClass('active').siblings('li').removeClass('active').find('.filter-list-ipopup').slideUp(0);
            $(this).next('.filter-list-ipopup').stop(1, 1).slideToggle('fast');

            if (window.pageYOffset < $('.filter').offset().top || window.pageYOffset > $('.filter').offset().top) {
                $('html').stop(1, 1).animate({
                    scrollTop: $('.filter').offset().top - 100
                }, 777);
            }

            if ($('.filter-list-item.active').length > 0) {
                $('.filter .layoutwhite').addClass('active');
                $('main').addClass('mainfilter');
            } else {
                $('.filter .layoutwhite').removeClass('active');
                $('main').removeClass('mainfilter');
            }
        });

        $('.filter .layoutwhite').on('click', function () {
            $(this).removeClass('active');
            $('main').removeClass('mainfilter');
            $('.filter-list-item').each(function () {
                $(this).removeClass('active');
                $(this).find('.filter-list-ipopup').stop(1, 1).slideUp(0);
            });
        });

        checkstatus();

        checkstatusfmobile();

        $(document).on('click', '.flmenu-wsub > .flmenu-link_lv1', function () {
            $(this).parent('li').toggleClass('active');
            $(this).parents('li').siblings('li').removeClass('active');
            checkLiSiblings();
            return false;
        });

        $(document).on('click', '.mfilter-clear button', function () {
            console.log('clear filter');
            return false;
        });

        $(document).on('change', '.mflcatalog-menu-item input', function () {
            var _parent_block = $(this).parents('.mflcatalog-menu-item'),
                _btns_status = 0;

            checkstatusfmobile();
            _parent_block.find('input').each(function () {
                var inp = $(this);

                if (inp.hasClass('datePicker')) {
                    if (inp.val()) {
                        _btns_status++;
                    }
                } else {
                    if (inp.data('status') === true && inp.is(':checked') || inp.data('status') !== true && !inp.is(':checked')) {} else {
                        _btns_status++;
                    }
                }
            });

            if (_btns_status === 0) {
                $('.mfilter-clear').slideUp('fast');
                //$('.mfilter-btn button').prop('disabled', true);
            } else {
                $('.mfilter-clear').slideDown('fast');
                //$('.mfilter-btn button').prop('disabled', false);
            }
        });

        $(document).on('change', '.filter-list-item input', function () {
            checkstatus();
        });

        $(document).on('click', '.mflcatalog-menu-head', function (event) {
            $(this).parent().toggleClass('active').siblings('div').removeClass('active');
            checkstatusfmobile();
        });

        numberCheckCatalog();

        $(document).on('change', '.mflcatalog input', function () {
            $('.mflcatalog-btn button').prop('disabled', false);
            numberCheckCatalog();
        });

        /*$(document).mouseup(function (e) {
            var _mfilter = $(".mfilter"),
                _mfilter_content = _mfilter.find(".mfilter-body");
             var _mcatalog = $(".mflcatalog"),
                _mcatalog_content = _mfilter.find(".mflcatalog-body");
             if (_mfilter.hasClass('active')) {
                console.log('111asdasdasd');
                if (!_mfilter_content.is(e.target) && _mfilter_content.has(e.target).length === 0) {
                    $('.mfilter-mobileclose').trigger('click');
                }
            }
            if (_mcatalog.hasClass('active')) {
                console.log('222asdasdasd');
                if (!_mcatalog_content.is(e.target) && _mcatalog_content.has(e.target).length === 0) {
                    $('.mflcatalog-mobileclose').trigger('click');
                }
            }
        });*/
    }
    ;

    $body.delegate('.forminput-input', 'focus', function () {
        $(this).parents('.forminput').addClass('active');
    }).delegate('.forminput-input', 'input keyup', function () {
        if (!!$(this).val()) {
            $(this).parents('.cart-promo').find('button').prop('disabled', false);
        } else {
            $(this).parents('.cart-promo').find('button').prop('disabled', true);
        }
    }).delegate('.forminput-input', 'blur', function () {
        $(this).parents('.forminput').toggleClass('active', !!$(this).val());
        if (!!$(this).val()) {
            $(this).parents('.cart-promo').find('button').prop('disabled', false);
        } else {
            $(this).parents('.cart-promo').find('button').prop('disabled', true);
        }
    });

    $('.forminput-input').trigger('blur');

    $(document).on('click', '.tocmobile', function (event) {
        $('#mflcatalog').addClass('active');
        $('html').toggleClass('fixscroll');
        $('.layoutwhite').toggleClass('active');
        return false;
    });

    $(document).on('click', '.mflcatalog-mobileclose', function (event) {
        $('#mflcatalog').removeClass('active');
        $('html').removeClass('fixscroll');
        $('.layoutwhite').removeClass('active');
        return false;
    });

    $(document).on('click', '.tofmobile', function (event) {
        $('#mfilter').addClass('active');
        $('html').toggleClass('fixscroll');
        $('.layoutwhite').toggleClass('active');
        return false;
    });

    $(document).on('click', '.mfilter-mobileclose', function (event) {
        $('#mfilter').removeClass('active');
        $('html').removeClass('fixscroll');
        $('.layoutwhite').removeClass('active');
        return false;
    });

    function brandTextShow() {
        $('.brandtext-slide').each(function () {
            //console.log($(this).height());
            /*if ($(this).height() >= 80 && $(window).width() > 991) {
                $(this).addClass('active pslactive');
            }
            if ($(this).height() >= 416 && $(window).width() < 992) {
                $(this).addClass('active pslactive');
            }*/
            $(this).addClass('active pslactive');
        });
    }
    if (!$('.pagecard').length) {
        brandTextShow();
        $('.brandtext-more a').on('click', function () {
            var scrollPosition = [self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft, self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop];
            $(this).toggleClass('active');
            $(".brandtext").find('.brandtext-slide').toggleClass('pslactive');
            $(".brandtext").find('.brandtext-slide').toggle();
            if ($(this).hasClass('active')){
                window.scrollTo(scrollPosition[0], scrollPosition[1]);
            }
            return false;
        });
    } else {
        $('.brandtext-more a').on('click', function () {
            var scrollPosition = [self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft, self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop];
            $(this).toggleClass('active');
            $('.brandtext-slide').toggleClass('pslactive');
            window.scrollTo(scrollPosition[0], scrollPosition[1]);
            return false;
        });
    }




    function seotextCalc() {
        $('.seotext-slide').each(function () {
            if ($(this).height() > 268 && $(window).width() > 991) {
                $(this).addClass('active slactive');
            }
            if ($(this).height() > 416 && $(window).width() < 992) {
                $(this).addClass('active slactive');
            }
        });
    }
    seotextCalc();

    $('.seotext-more a').on('click', function () {
        //var actionBlock = $(this).parents(".pwside").find(".stickParent");
        var scrollPosition = [self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft, self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop];

        $(this).toggleClass('active').closest('.pwside').find('.stickParent').toggleClass('nofix');
        $(this).parent('.seotext-more').prev('.seotext-slide').toggleClass('slactive');

        if ($(this).hasClass('active')){
            window.scrollTo(scrollPosition[0], scrollPosition[1]);
        }
        checkFixedBlocks(scrollPosition[1]);
        return false;
    });

    $('.pagecard-delivery-list_more').off('click').on('click', function (e) {
        e.preventDefault();
        $(this).slideUp(0);
        $(this).parents('.pagecard-delivery-list_el').find('.pagecard-delivery-list_slide').slideToggle('fast');
        return false;
    });

    $('.pagecard-delivery-list_more.active').off('click').on('click', function (e) {
        e.preventDefault();
        $(this).slideUp(0);
        $(this).parents('.pagecard-delivery-list_el').find('.pagecard-delivery-list_slide').slideToggle(0);
    });

    // page card
    if ($('.pagecard').length) {
        var numberSLTabs = function numberSLTabs() {
            if ($('#swiperPCImagesTabs .pcimages-tabssl-el').length < 4) {
                $('#swiperPCImagesTabs').addClass('slmin');
            } else {
                $('#swiperPCImagesTabs').removeClass('slmin');
            }
        };

        var _pcard = $('.pagecard');
        calcHeightAsidePcard();

        if ($('#sl-pcardadditions').length) {
            var settPcardSl1 = function settPcardSl1() {
                swiperAddSl.params.slidesOffsetBefore = parseInt(_pcard.offset().left);
                swiperAddSl.params.slidesOffsetAfter = parseInt(_pcard.offset().left);
                swiperAddSl.update(!0);
                0 === swiperAddSl.activeIndex && swiperAddSl.slideTo(0);
            };

            var setPcardInit = function setPcardInit() {
                if ($(window).width() > 991) {
                    if (c_init) {
                        swiperAddSl.destroy(false, false);
                        c_init = false;
                    }
                } else {
                    if (!c_init) {
                        c_init = true;
                        swiperAddSl.init();
                        settPcardSl1();
                    } else {
                        settPcardSl1();
                    }
                }
            };

            var swiperAddSl = new Swiper('#sl-pcardadditions', {
                init: false,
                slidesPerView: 'auto',
                slidesOffsetBefore: parseInt(_pcard.offset().left),
                slidesOffsetAfter: parseInt(_pcard.offset().left),
                spaceBetween: 0,
                scrollbar: {
                    el: '#sl-pcardadditions-scroll',
                    hide: false
                }
            });

            var c_init = false;

            setPcardInit();

            $(window).resize(function () {
                setPcardInit();
            });

            $(window).on("orientationchange", function () {
                setPcardInit();
            });
        }

        if ($('#sl-pcardelse').length) {
            var settPcardSl2 = function settPcardSl2() {
                swiperElseSl.params.slidesOffsetBefore = parseInt(_pcard.offset().left);
                swiperElseSl.params.slidesOffsetAfter = parseInt(_pcard.offset().left);
                swiperElseSl.update(!0);
                0 === swiperElseSl.activeIndex && swiperElseSl.slideTo(0);
            };

            var setPcardInit2 = function setPcardInit2() {
                if ($(window).width() > 991) {
                    if (с_init2) {
                        swiperElseSl.destroy(false, false);
                        с_init2 = false;
                    }
                } else {
                    if (!с_init2) {
                        с_init2 = true;
                        swiperElseSl.init();
                        settPcardSl2();
                    } else {
                        settPcardSl2();
                    }
                }
            };

            var swiperElseSl = new Swiper('#sl-pcardelse', {
                init: !1,
                slidesPerView: 'auto',
                slidesOffsetBefore: parseInt(_pcard.offset().left),
                slidesOffsetAfter: parseInt(_pcard.offset().left),
                spaceBetween: 0,
                scrollbar: {
                    el: '#sl-pcardelse-scroll',
                    hide: false
                }
            });
            var с_init2 = false;

            ;

            setPcardInit2();

            $(window).resize(function () {
                setPcardInit2();
            });

            $(window).on("orientationchange", function () {
                setPcardInit2();
            });
        }

        var swiperPCImagesSliderThumbs = $('#swiperPCImagesTabs');
        var swiperPCImagesThumbs = new Swiper(swiperPCImagesSliderThumbs[0], {
            spaceBetween: 0,
            slidesPerView: 3,
            freeMode: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true
        });

        var swiperPCImagesSlider = $('#swiperPCImages');
        var swiperPCImages = new Swiper(swiperPCImagesSlider[0], {
            spaceBetween: 0,
            effect: 'fade',
            pagination: {
                el: '#swiperPCImages-pagination',
                type: 'bullets',
                dynamicBullets: true,
                clickable: true
            },
            navigation: {
                nextEl: '#swiperPCImages-next',
                prevEl: '#swiperPCImages-prev'
            },
            thumbs: {
                swiper: swiperPCImagesThumbs
            }
        });

        ;
        numberSLTabs();

        $(document).on('click', '.pagecard-sideimages-nav a', function (event) {
            var _activeSlide = $(this).data('hiddeslide');

            $('.pcimages-sliders').animate({
                opacity: '0'
            }, 300, function () {
                $('.pcimages-sl-el').each(function () {
                    if (!$(this).hasClass(_activeSlide)) {
                        $(this).removeClass('swiper-slide swiper-slide-active swiper-slide-next');
                    } else {
                        $(this).addClass('swiper-slide');
                    }
                });
                $('#swiperPCImagesTabs .swiper-wrapper').empty();
                $('.clone_tabs .pcimages-tabssl-el').each(function () {
                    if ($(this).hasClass(_activeSlide)) {
                        $(this).clone().appendTo('#swiperPCImagesTabs .swiper-wrapper');
                    }
                });
                numberSLTabs();
            });
            $(this).parent('li').addClass('active').siblings('li').removeClass('active');

            setTimeout(function () {
                swiperPCImagesThumbs.update();
                swiperPCImages.update();
                swiperPCImages.slideTo(0);

                numberSLTabs();

                $('.pcimages-sliders').animate({
                    opacity: '1'
                }, 300);
            }, 400);

            return false;
        });

        if ($(document).find('.pagecard-sideimages-nav').length) {
            var _activeSlide = $(document).find('.pagecard-sideimages-nav .active a').data('hiddeslide');

            $('.pcimages-tabssl .pcimages-tabssl-el').each(function () {
                $(this).appendTo('body .clone_tabs');
            });

            $('.clone_tabs .pcimages-tabssl-el').each(function () {
                if ($(this).hasClass(_activeSlide)) {
                    $(this).clone().appendTo('#swiperPCImagesTabs .swiper-wrapper');
                }
            });
            numberSLTabs();

            swiperPCImagesThumbs.update();
            swiperPCImages.update();
            swiperPCImages.slideTo(0);
        }

        $('.avails-more').on('click', function () {
            $(this).parent('div').slideUp('fast');
            $('.pagecard-avails-list-el:nth-child(n+1)').slideDown('fast');
            return false;
        });

        if (!smoothMode) {
            var CardSide = new hcSticky('.pagecard-aside', {
                stickTo: '.pagecard-body',
                top: 0,
                responsive: {
                    991: {
                        disable: true
                    }
                }
            });
            var CardNav = new hcSticky('.pagecard-nav', {
                stickTo: '.pagecard',
                top: 230,
                responsive: {
                    991: {
                        disable: true
                    }
                }
            });
        }

        _pcard.data('showed', false);
        $(window).on('scroll', function () {
            if (!smoothMode) {
                var rect = _pcard[0].getBoundingClientRect();
                var pagecardSide = $('.pagecard-side');

                _pcard.data('showed', rect.height + rect.top > window.innerHeight && rect.top < 0);

                if (_pcard.find('.pagecard-side').isOnScreen({
                    part: 0.01,
                    offset: 0
                }) + _pcard.isOnScreen({ part: 1 }) + !_pcard.data('showed') === 0) {
                    $('.pagecard-addfix').removeClass('hidden');
                } else {
                    $('.pagecard-addfix').addClass('hidden');
                }

                if (pagecardSide.length) {
                    if (this.pageYOffset > pagecardSide.offset().top) {
                        $('.pagecard-aside-img').fadeIn(500);
                    } else {
                        $('.pagecard-aside-img').fadeOut(500);
                    }
                }
            }
        }).trigger('scroll');

        // pcard nav
        $('.pagecard-nav').each(function (i, nav) {
            var _nav = $(nav),
                _a = _nav.find('a');

            _a.on('click', function (e) {
                var _this = $(this),
                    _li = _this.parent(),
                    _target = $(this.hash);

                if (!_li.hasClass('active')) {

                    _nav.find('a.active').removeClass('active').removeAttr('style');

                    _li.addClass('active').siblings().removeClass('active');

                    if (_target.length && e.originalEvent) {
                        var pos = _target.offset().top - $header.outerHeight(true) - 16;

                        if (smoothMode) {
                            htmlAnimate(pos, 1000, function () {
                                setTimeout(function () {
                                    _li.find('a').addClass('active').css('height', _li.find('a span').outerWidth() + 'px');
                                }, 500);
                            });
                        } else {
                            $('html, body').animate({
                                scrollTop: pos
                            }, 1000, function () {
                                setTimeout(function () {
                                    _li.find('a').addClass('active');
                                }, 500);
                            });
                        }
                    } else {
                        setTimeout(function () {
                            _li.find('a').addClass('active').css('height', _li.find('a span').outerWidth() + 'px');
                        }, 500);
                    }
                }

                e.preventDefault();
            }).eq(0);
        });

        if (!smoothMode) {
            $(window).on('scroll', function () {
                $('.js-nav-target').each(function (i, el) {
                    var _el = $(el);

                    if (_el.isOnScreen({ part: 0.1, checkOut: true })) {
                        $('.pagecard-nav a[href="#' + _el.attr('id') + '"]').trigger('click');
                        return false;
                    }
                });
            }).trigger('scroll');
        }

        // zoom
        $('.pcimages-sl-more').on('click', function () {
            var _sltop = $('.pcimages-sl-wrapper').offset().top,
                _titletop = $('.page-title').offset().top;

            $('.pcimages-sl-wrapper').animate({
                top: _titletop - _sltop
            }, 300, function () {
                $('.pcimages-sl-wrapper').addClass('active');
            });
            swiperPCImagesSlider.animate({
                opacity: '0'
            }, 300);
            setTimeout(function () {
                swiperPCImagesSlider.animate({
                    opacity: '1'
                }, 500);
                swiperPCImages.update();
                // swiperPCImages.slideTo(0);
            }, 700);
            return false;
        });
        $('.pcimages-sl-close').on('click', function () {
            $('.pcimages-sl-wrapper').animate({
                top: 0
            }, 300, function () {
                $('.pcimages-sl-wrapper').removeClass('active');
            });
            swiperPCImagesSlider.animate({
                opacity: '0'
            }, 300);
            setTimeout(function () {
                swiperPCImagesSlider.animate({
                    opacity: '1'
                }, 500);
                swiperPCImages.update();
            }, 700);
            return false;
        });

        // form qwestions
        $('.pagecard-slideqwestion').on('click', function () {
            $(this).fadeOut('500', function () {
                $('.pagecard-fqwestion').slideDown(500);
            });
            return false;
        });
    }

    // cart nogoods
    if ($('.cartnogoods').length) {
        var cartnogoods_check = function cartnogoods_check() {
            var _num_checks = $('.cartnogoods-sl input:checked').length;

            if (_num_checks === 0) {
                $('.cartnogoods-btns button').prop('disabled', true);
                if ($(window).width() < 768) {
                    $('.cartnogoods-btns button').html('выберите 1-й товар');
                } else {
                    $('.cartnogoods-btns button').html('выберите первый товар');
                }
                $('.cartnogoods-sl input').each(function () {
                    if ($(this).prop('checked') === false) {
                        $(this).prop('disabled', false);
                    }
                });
            }
            if (_num_checks === 1) {
                $('.cartnogoods-btns button').prop('disabled', true);
                if ($(window).width() < 768) {
                    $('.cartnogoods-btns button').html('выберите 2-й товар');
                } else {
                    $('.cartnogoods-btns button').html('выберите второй товар');
                }
                $('.cartnogoods-sl input').each(function () {
                    if ($(this).prop('checked') === false) {
                        $(this).prop('disabled', false);
                    }
                });
            }
            if (_num_checks == 2) {
                $('.cartnogoods-btns button').prop('disabled', false).html('Положить в корзину');
                $('.cartnogoods-sl input').each(function () {
                    if ($(this).prop('checked') === false) {
                        $(this).prop('disabled', true);
                    }
                });
            }
            widthCartGoods();
        };

        var cartBuildSlot = function cartBuildSlot(_cart) {
            var _copy = _cart.html(),
                _slider = _cart.next('.cartnogoods-slider');

            _slider.find('.cartnogoods-slider-el').css({ height: $('.cartnogoods-sl').height() }).html(_copy);
        };

        var AnimateCart = function AnimateCart() {
            var _heightscroll = $('.cartnogoods-sl').height() * 4;

            $('.cartnogoods-sl').addClass('active');
            $('.cartnogoods-slider-wrapper').each(function () {
                if (!$(this).hasClass('active')) {
                    $(this).addClass('active');
                    $(this).css('transform', 'translateY(-' + _heightscroll + 'px)');
                } else {
                    $(this).removeClass('active');
                    $(this).css('transform', 'translateY(0)');
                }
            });
            setTimeout(function () {
                $('.cartnogoods-sl').removeClass('active');
            }, 1301);
        };

        // $('.cartnogoods-source').each(function () {
        //     let _cart = $(this);
        //     cartBuildSlot(_cart);
        //     AnimateCart();
        // });

        // $(document).on('click', '.cartnogoods-refresh', function() {
        //     $('.cartnogoods-source').each(function () {
        //         let _cart = $(this);
        //
        //         $('.cartnogoods-sl input').each(function () {
        //             if ( $(this).prop('checked') === true ) {
        //                 $(this).prop('checked', false);
        //             }
        //             $(this).prop('disabled', false);
        //             if ( $(window).width() < 768 ) {
        //                 $('.cartnogoods-btns button')
        //                     .prop('disabled', true)
        //                     .html('выберите 1-й товар');
        //             } else {
        //                 $('.cartnogoods-btns button')
        //                     .prop('disabled', true)
        //                     .html('выберите первый товар');
        //             }
        //         });
        //
        //         AnimateCart();
        //         cartBuildSlot(_cart);
        //     });
        //     return false;
        // });


        cartnogoods_check();

        $('.cartnogoods-sl input').change(function () {
            cartnogoods_check();
        });

        $(window).on('resize', function () {
            cartnogoods_check();
        }).trigger('resize');

        $(window).on('orientationchange', function () {
            cartnogoods_check();
        });
    }

    // delivery page
    if ($('.pdelivery').length) {
        var DeliverySide = new hcSticky('.pdelivery-aside', {
            stickTo: '.pdelivery',
            top: 0,
            responsive: {
                991: {
                    disable: true
                }
            }
        });
    }

    // contacts page
    if ($('.pcontacts').length) {
        var ContactsSide = new hcSticky('.pcontacts-aside', {
            stickTo: '.pcontacts',
            top: 0,
            responsive: {
                991: {
                    disable: true
                }
            }
        });

        $('.pcontacts-menu_more a').on('click', function () {
            var contacts_form = $(this).parents('ul').next('.pcontacts-form');

            contacts_form.find('.subject').val($(this).html());

            $(this).parents('li').addClass('active').siblings('li').fadeOut('500');
            contacts_form.fadeIn('700', function () {
                $('html').stop().animate({
                    scrollTop: $(this).parents('.pcontacts-list-item').offset().top - $('header').height() - 15
                }, 700);
            });

            return false;
        });
        $('.pcontacts-menu_back a').on('click', function () {
            var contacts_content = $(this).parents('.pcontacts-list-content'),
                contacts_ul = contacts_content.find('.pcontacts-menu'),
                contacts_form = $(this).parents('.pcontacts-form');

            $('html').stop().animate({
                scrollTop: $(this).parents('.pcontacts-list-item').offset().top - $('header').height() - 15
            }, 500);

            contacts_content.find('.numberorder').slideDown(0);
            contacts_content.find('.nonumberorder').slideUp(0);
            contacts_form.fadeOut(700);
            contacts_ul.find('li.active').removeClass('active');
            contacts_ul.find('li').fadeIn(700);

            return false;
        });

        $('.show_noorder').on('click', function () {
            $(this).parents('.numberorder').slideUp(500);
            $(this).parents('.pcontacts-form').find('.nonumberorder').slideDown(500);
            return false;
        });
    }

    // order page
    if ($('.order').length) {
        heightAsideOrder();

        $(window).on('resize', function () {
            heightAsideOrder();
        });
        $(window).on('orientationchange', function () {
            heightAsideOrder();
        });

        var OrderSide = new hcSticky('.order-aside', {
            stickTo: '.order',
            top: 0,
            responsive: {
                991: {
                    disable: true
                }
            }
        });

        // if ( $('#order-ui').length ) {
        //     let _omax = $('.order-slw-ui-wrapper').data('omax');
        //
        //     $('#order-ui').slider({
        //         range: "max",
        //         min: 0,
        //         max: _omax,
        //         slide: function( event, ui ) {
        //             $('.ui-slider-handle').html('<span>' + ui.value +'</span>');
        //             $('.mbtn-value').html(ui.value);
        //             $('.order-pointsbtns-btn').each(function () {
        //                 $(this).removeClass('active');
        //             });
        //             $('.sbonusquantity').fadeOut('500');
        //         },
        //         change: function( event, ui ) {
        //             $('.ui-slider-handle').html('<span>' + ui.value +'</span>');
        //             $('.mbtn-value').html(ui.value);
        //         }
        //     });
        //     $('.ui-slider-handle').html('<span>' + $('#order-ui').slider('value') +'</span>');
        //     $('.mbtn-value').html($('#order-ui').slider('value'));
        //
        //     $('.sett_0').on('click', function () {
        //         $('#order-ui').slider( 'value', 0 );
        //         $(this).parents('.order-pointsbtns-btn').addClass('active').parent().siblings('div').find('.order-pointsbtns-btn').removeClass('active');
        //         return false;
        //     });
        //     $('.sett_half').on('click', function () {
        //         $('#order-ui').slider( 'value', _omax/2 );
        //         $(this).parents('.order-pointsbtns-btn').addClass('active').parent().siblings('div').find('.order-pointsbtns-btn').removeClass('active');
        //         return false;
        //     });
        //     $('.sett_max').on('click', function () {
        //         $('#order-ui').slider( 'value', _omax );
        //         $(this).parents('.order-pointsbtns-btn').addClass('active').parent().siblings('div').find('.order-pointsbtns-btn').removeClass('active');
        //         return false;
        //     });
        //     $('.sett_number').on('click', function () {
        //         $(this).parents('.order-pointsbtns-btn').addClass('active').parent().siblings('div').find('.order-pointsbtns-btn').removeClass('active');
        //         $('.sbonusquantity').fadeIn('500', function () {
        //             $('.sett_number_input').val('').focus();
        //         });
        //         return false;
        //     });
        //
        //     $('.sett_number_input').on('input keyup', function(e) {
        //         $('#order-ui').slider( 'value', $(this).val() );
        //     });
        // }

        $('.order-list-el').each(function () {
            if ($(this).hasClass('active') || $(this).hasClass('success')) {
                $(this).find('.order-list-slide').slideDown('500', function () {
                    if ($('.order-list-el.active').index() === 0) {
                        $('.order-list-el.active .phone').focus();
                    }
                    if ($('.order-list-el.active').index() > 0) {
                        $('html').stop().animate({
                            scrollTop: $('.order-list-el.active').offset().top - $('header').height() - 16
                        }, 700);
                    }
                });
            }
        });

        chinputs();
        $('.norradio-list input:radio').change(function () {
            chinputs();
        });
    }

    // page 404
    if ($('.page404').length) {
        var offsetsSwiper404 = function offsetsSwiper404() {
            swiper404.params.slidesOffsetBefore = parseInt($('.page404-content').offset().left);
            swiper404.params.slidesOffsetAfter = parseInt($('.page404-content').offset().left);
            swiper404.update(!0);
            0 === swiper404.activeIndex && swiper404.slideTo(0);
        };

        var settSl404 = function settSl404() {
            if ($(window).width() > 991) {
                if (init404) {
                    swiper404.destroy(false);
                    init404 = false;
                }
            } else {
                if (!init404) {
                    init404 = true;
                    swiper404.init();
                    offsetsSwiper404();
                }
            }
        };

        var swiper404 = new Swiper('.page404-sl', {
            init: false,
            slidesPerView: 'auto',
            spaceBetween: 0,
            scrollbar: {
                el: '.page404-sl-wrapper .swiper-scrollbar',
                hide: false
            }
        });

        var init404 = false;

        ;

        settSl404();
        $(window).on('resize', function () {
            settSl404();
        });
        $(window).on('orientationchange', function () {
            settSl404();
        });
    }

    $(document).on('click', '.msignup-wslide-title', function (event) {
        $(this).next('.msignup-wslide-slide').slideToggle('fast').parents('.msignup-wslide').toggleClass('active');
        return false;
    });

    $(document).on('click', '.mmenusignup', function (event) {
        $(this).toggleClass('activemsignup');
        $('.globalmenu').toggleClass('msignup');
        return false;
    });
//});

// plane selections
function planesettings() {
    var _plane = $('.selections-plane');
    var _planeactive = $('.selections-item.active');
    var _planewidth = _planeactive.find('.selections-sl-el:first-child').outerWidth(true) + 1;
    var _planeheight = _planeactive.find('.selections-sl-el:first-child').outerHeight(true) + 96;

    _plane.css({
        width: _planewidth,
        height: _planeheight
    });
    _planeactive.find('.selections-sl').css({ opacity: '1' });
};

function planefly() {
    var _plane = $('.selections-plane');
    var _planeactive = $('.selections-item.active');
    var _planeleft = _planeactive.find('.selections-blockdes').css('left');

    _plane.animate({
        left: _planeleft
    }, 300);
    _planeactive.find('.selections-blockdes').animate({
        opacity: 1
    }, 600);
    _planeactive.find('.selections-sl').animate({
        opacity: 1
    }, 400);
};

// for padding on mobile
function widthMainInviteCatalog() {
    if ($(window).width() <= 991) {
        $('.mainicatalog-body li:first-child').css({
            paddingLeft: $('.mainicatalog').offset().left
        });
        $('.mainicatalog-body li:last-child').css({
            paddingRight: $('.mainicatalog').offset().left
        });
    } else {
        $('.mainicatalog-body li:first-child').css({
            paddingLeft: '8px'
        });
        $('.mainicatalog-body li:last-child').css({
            paddingRight: '8px'
        });
    }
};

function widthAlphabet() {
    if ($(window).width() <= 991) {
        $('.brandsalph li:first-child').css({
            paddingLeft: $('.page-title').offset().left
        });
        $('.brandsalph li:last-child').css({
            paddingRight: $('.page-title').offset().left
        });
    } else {
        $('.brandsalph li:first-child').css({
            paddingLeft: '2px'
        });
        $('.brandsalph li:last-child').css({
            paddingRight: '2px'
        });
    }
};

function widthFilterResult() {
    if ($(window).width() <= 991) {
        if ($('.breadcrumb').length) {
            $('.filter-result li:first-child').css({
                paddingLeft: $('.breadcrumb').offset().left
            });
            $('.filter-result li:last-child').css({
                paddingRight: $('.breadcrumb').offset().left
            });
        }
    } else {
        $('.filter-result li:first-child').css({
            paddingLeft: '8px'
        });
        $('.filter-result li:last-child').css({
            paddingRight: '8px'
        });
    }
};

function widthCartGoods() {
    if ($(window).width() <= 768) {
        var _offset = $('.page-title').offset().left;

        $('.cartnogoods-sl-el:first-child').css({
            paddingLeft: _offset
        });
        $('.cartnogoods-sl-el:last-child').css({
            paddingRight: _offset
        });
        $('.cartnogoods-sl-el:first-child .cartnogoods-slider').css({
            left: _offset
        });
        $('.cartnogoods-sl-el:last-child .cartnogoods-slider').css({
            right: _offset
        });
    } else {
        $('.cartnogoods-sl-el:first-child').css({
            paddingLeft: '16px'
        });
        $('.cartnogoods-sl-el:last-child').css({
            paddingRight: '16px'
        });
    }
};

function calcHeightAsidePcard() {
    if ($('.pagecard-aside').outerHeight(true) > $(window).height()) {
        $('.pagecard-aside-img').hide(0);
    }
}

function heightAsideOrder() {
    if ($(window).width() > 991) {
        var height_side = $(window).height() - $('.order-side-foot').outerHeight(true) - 24;
        $('.order-aside .blockscroll-fix').css({ maxHeight: height_side });
    }
}

function chinputs() {
    $('.norradio-list input:radio').each(function () {
        var _parent = $(this).parents('.order-chlist-el');
        if ($(this).prop('checked')) {
            _parent.addClass('active');
        } else {
            _parent.removeClass('active');
        }
    });
}

//# sourceMappingURL=app.js.map
//# sourceMappingURL=app.js.map
