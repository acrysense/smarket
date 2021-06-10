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

$(function () {
    var scrollTimer;
    var resizeFunc = [];
    var menuTimer;
    var menuLeaveTimer;
    var mouseClickTimer;
    var menuDelay = 100;
    var smoothMode = $('html').hasClass('smooth-scroll');
    var $body = $('body'),
        lastScroll = void 0;
    var $header = $('.header'),
        $doc = $(document),
        $window = $(window);

    function desktopMode(w) {
        w = parseInt(w) || 991;
        return $window.width() > w;
    }

    function contentScroller(currentScroll) {
        var startHidding = $header.outerHeight();
        var hideHeader = currentScroll > startHidding;

        $('.header-deskmbtn').toggleClass('sactive', hideHeader);

        if (0 === currentScroll) {
            $body.removeClass('scroll-up');
            return;
        }

        $body.data('show-for-product', 0);

        if (currentScroll > startHidding && currentScroll > lastScroll && !$body.hasClass('scroll-down')) {
            $body.removeClass('scroll-up').addClass('scroll-down');
        } else if (currentScroll < lastScroll && $body.hasClass('scroll-down')) {
            $body.removeClass('scroll-down').addClass('scroll-up');
        }
        lastScroll = currentScroll;
    }

    if (smoothMode) {
        var Scrollbar = window.Scrollbar;

        var MobilePlugin = function MobilePlugin() {
            Scrollbar.ScrollbarPlugin.apply(this, arguments);
        };

        MobilePlugin.prototype = Object.create(Scrollbar.ScrollbarPlugin.prototype);

        MobilePlugin.prototype.transformDelta = function (delta, fromEvent) {
            if (this.scrollbar.containerEl.dataset.scrollbarMobile && !desktopMode(this.scrollbar.containerEl.dataset.scrollbarMobile)) {
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
            speed: 0.5
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

        $('*[data-scrollbar]').each(function (ind) {
            var smoothOptions = {
                alwaysShowTracks: true,
                plugins: {
                    mobile: {
                        speed: 0.5
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

            Scrollbar.init(this, smoothOptions);
        });

        Scrollbar.getAll()[0].addListener(function (status) {
            //console.log(status, status.offset.y, $header.outerHeight());

            contentScroller(status.offset.y);
        });
    } else {
        // header modification
        $(window).scroll(function () {
            contentScroller(this.pageYOffset);
        }).trigger('scroll');
    }

    $('.header-deskmbtn').on('mouseover click', function () {
        $('body').removeClass('scroll-down').removeClass('scroll-up');
    });

    $header.on('mouseleave', function () {
        if ($window.scrollTop() > $header.height()) {
            $body.removeClass('scroll-up').addClass('scroll-down');
        }
    });

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

            target.html(menu.clone().removeClass('mob-only').addClass('__cloned'));
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

            mouseClickTimer = setTimeout(function () {
                menuMouseEnter(item);
            }, 10);
        } else {}
    }).delegate('.megamenuLink', 'click', function (e) {
        clearTimeout(mouseClickTimer);

        if (!desktopMode()) {
            var btn = $(this);
            var item = btn.parent();
            var active = item.hasClass('active');

            //menuMouseEnter(item);

            if (item.hasClass('__sub')) {
                var menuID = +btn.attr('data-menu');

                item.toggleClass('active', !active).siblings().removeClass('active').parent().toggleClass('menu_active', !active).find('.menuSub').removeClass('translateIn').each(function (ind) {
                    var _this = this;

                    setTimeout(function () {
                        $(_this).addClass('translateIn');
                    }, 50);
                });

                item.closest('.megamenuHolder').removeClass('translateIn').attr('data-level', menuID - (active ? 1 : 0)).each(function (ind) {
                    var _this2 = this;

                    setTimeout(function () {
                        $(_this2).addClass('translateIn');
                    }, 50);
                });

                item.find('.menuLevel').toggleClass('__opened', !active).toggleClass('__empty', !active);
            }

            return false;
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
        if (desktopMode()) {
            var root = $(this);

            menuLeaveTimer = setTimeout(function () {
                root.find('.menuLevel').removeClass('__opened').filter(function () {
                    return +$(this).attr('data-level') > 1;
                }).addClass('__empty');
            }, 10);
        }
    });

    $('.submenuLink').on('click', function () {
        var link = $(this);
        var menu = link.parent();
        var active = menu.hasClass('active');
        var goto = link.attr('data-goto');

        if (goto) {
            var menuPath = goto.split('-');
            menuClicker(menuPath, $('.navLink ').eq(menuPath[0]).click().next(), 0);
        } else {
            $('.navbarSubmenu').removeClass('active');

            menu.toggleClass('active', !active).siblings().removeClass('active', !active).parent().toggleClass('menu_active');

            menu.find('.megamenuHolder').removeClass('translateIn').attr('data-level', 0).each(function (ind) {
                var _this3 = this;

                setTimeout(function () {
                    $(_this3).addClass('translateIn');
                }, 10);
            });

            if (active) {
                menu.find('.menuLevel').removeClass('__opened').removeClass('__empty').filter(function () {
                    return +$(this).attr('data-level') !== 1;
                }).addClass('__empty');
            } else {}
        }

        return false;
    });

    $('.navbarSubmenu').on('mouseenter', function () {
        if (desktopMode()) {
            var subMneu = $(this);
            subMneu.find('.scrollReset').each(function () {
                this.scrollTop = 0;
            });

            var menuInner = subMneu.find('.navbar-megamenu_inner');
            var menuContent = menuInner.children('.container');
            var paddings = parseInt(getStyle(menuInner[0], 'padding-top')) + parseInt(getStyle(menuInner[0], 'padding-bottom'));

            document.documentElement.style.setProperty('--subMenuHeight', (menuContent.outerHeight() || 200) + paddings + 'px');
        }
    });

    $('.navLink').on('click', function () {
        if (desktopMode()) {} else {
            var link = $(this);
            var menu = link.parent();
            var active = menu.hasClass('active');

            $('.headerLogo').html(link.children('span').clone()).closest('a').attr('href', link.attr('href'));

            $('.navbarSubmenu').removeClass('active');

            menu.toggleClass('active', !active).siblings().removeClass('active', !active).parent().toggleClass('menu_active');

            menu.find('.megamenuHolder').removeClass('translateIn').attr('data-level', 0).each(function (ind) {
                var _this4 = this;

                setTimeout(function () {
                    $(_this4).addClass('translateIn');
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

    // hero slider

    var bulletLineDelay = 30;
    var tabSpeed = 1000;
    var heroSlideSpeed = 1000;
    var heroDelay = 10000;
    var swiperHero = $('#swiperHero');
    var swiperHeroThumbs = new Swiper(swiperHero, {
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

    var initSwiperSelection = false;
    var swiperSelection;

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

    var paginator = $('#swiperHeroPagination');

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
            $('.navbarAuthBlock').html(isActive ? '' : popup.find('.modal-body').clone());
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

    $('.search-mobiletoggle, .header-btnsearch, .search-mobileclose, .header-btnmenu, .layoutglobal').off();

    // search
    $(document).on('click', '.search-mobiletoggle, .header-btnsearch', function (event) {
        $('html').addClass('fixscroll');
        $('.layoutglobal').addClass('active');
        $body.addClass('menu-opened');
        $('.searchmobile').addClass('active');
        $('.searchmobile .search-field').focus();
        return false;
    });

    $('.search-mobileclose').on('click', function () {
        $('html').removeClass('fixscroll');
        $('.layoutglobal').removeClass('active');
        $body.removeClass('menu-opened');
        $('.searchmobile').removeClass('active');
        return false;
    });

    $(document).on('click', '.header-btnmenu, .layoutglobal', function (event) {
        $('.header-btnmenu').toggleClass('active');
        $header.toggleClass('openmenu');
        $('html').toggleClass('fixscroll');
        $('.layoutglobal').toggleClass('active');
        $body.toggleClass('menu-opened');
        $('.globalmenu').toggleClass('active');
        return false;
    });

    function resizeFuncItarator() {
        for (var i = 0; i < resizeFunc.length; i++) {
            var fn = window[resizeFunc[i]];
            console.log('resizeFuncItarator', fn);
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

    function fixWebkitStyle() {
        var cv = $('#custom_values'),
            vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
            css = '.viewport_height {height: ' + vh + 'px; min-height: ' + vh + 'px;}';

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
        resizeFuncItarator();
    }).trigger('resize');

    $(window).on('resize scroll load', function () {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function () {
            fixWebkitStyle();
        }, 100);
    });

    $(document).on('click', '.msignup-wslide-title', function (event) {
        $(this).next('.msignup-wslide-slide').slideToggle('fast').parents('.msignup-wslide').toggleClass('active');
        return false;
    });

    $(document).on('click', '.mmenusignup', function (event) {
        $(this).toggleClass('activemsignup');
        $('.globalmenu').toggleClass('msignup');
        return false;
    });
});
//# sourceMappingURL=navi.js.map
