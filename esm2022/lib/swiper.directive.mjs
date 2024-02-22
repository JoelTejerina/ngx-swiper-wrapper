import Swiper from 'swiper/bundle';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, Optional, Directive, Input, Output, EventEmitter } from '@angular/core';
import { SWIPER_CONFIG, SwiperConfig, SwiperEventNames } from './swiper.interfaces';
import * as i0 from "@angular/core";
export class SwiperDirective {
    set index(index) {
        if (index != null) {
            this.setIndex(index);
        }
    }
    constructor(platformId, zone, elementRef, differs, defaults) {
        this.platformId = platformId;
        this.zone = zone;
        this.elementRef = elementRef;
        this.differs = differs;
        this.defaults = defaults;
        this.initialIndex = null;
        this.configDiff = null;
        this.disabled = false;
        this.performance = false;
        this.indexChange = new EventEmitter();
        this.S_INIT = new EventEmitter();
        this.S_BEFOREDESTROY = new EventEmitter();
        this.S_SCROLL = new EventEmitter();
        this.S_PROGRESS = new EventEmitter();
        this.S_KEYPRESS = new EventEmitter();
        this.S_RESIZE = new EventEmitter();
        this.S_BREAKPOINT = new EventEmitter();
        this.S_ZOOMCHANGE = new EventEmitter();
        this.S_AFTERRESIZE = new EventEmitter();
        this.S_BEFORERESIZE = new EventEmitter();
        this.S_LOOPFIX = new EventEmitter();
        this.S_BEFORELOOPFIX = new EventEmitter();
        this.S_SLIDERMOVE = new EventEmitter();
        this.S_SLIDECHANGE = new EventEmitter();
        this.S_SETTRANSLATE = new EventEmitter();
        this.S_SETTRANSITION = new EventEmitter();
        this.S_FROMEDGE = new EventEmitter();
        this.S_TOEDGE = new EventEmitter();
        this.S_REACHEND = new EventEmitter();
        this.S_REACHBEGINNING = new EventEmitter();
        this.S_AUTOPLAY = new EventEmitter();
        this.S_AUTOPLAYSTART = new EventEmitter();
        this.S_AUTOPLAYSTOP = new EventEmitter();
        this.S_IMAGESREADY = new EventEmitter();
        this.S_LAZYIMAGELOAD = new EventEmitter();
        this.S_LAZYIMAGEREADY = new EventEmitter();
        this.S_SCROLLDRAGEND = new EventEmitter();
        this.S_SCROLLDRAGMOVE = new EventEmitter();
        this.S_SCROLLDRAGSTART = new EventEmitter();
        this.S_NAVIGATIONHIDE = new EventEmitter();
        this.S_NAVIGATIONSHOW = new EventEmitter();
        this.S_PAGINATIONRENDER = new EventEmitter();
        this.S_PAGINATIONUPDATE = new EventEmitter();
        this.S_PAGINATIONHIDE = new EventEmitter();
        this.S_PAGINATIONSHOW = new EventEmitter();
        this.S_TAP = new EventEmitter();
        this.S_CLICK = new EventEmitter();
        this.S_DOUBLETAP = new EventEmitter();
        this.S_TOUCHEND = new EventEmitter();
        this.S_TOUCHMOVE = new EventEmitter();
        this.S_TOUCHSTART = new EventEmitter();
        this.S_TOUCHMOVEOPPOSITE = new EventEmitter();
        this.S_TRANSITIONEND = new EventEmitter();
        this.S_TRANSITIONSTART = new EventEmitter();
        this.S_SLIDEPREVTRANSITIONEND = new EventEmitter();
        this.S_SLIDEPREVTRANSITIONSTART = new EventEmitter();
        this.S_SLIDENEXTTRANSITIONEND = new EventEmitter();
        this.S_SLIDENEXTTRANSITIONSTART = new EventEmitter();
        this.S_SLIDECHANGETRANSITIONEND = new EventEmitter();
        this.S_SLIDECHANGETRANSITIONSTART = new EventEmitter();
        this.S_OBSERVERUPDATE = new EventEmitter();
    }
    ngAfterViewInit() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        const params = new SwiperConfig(this.defaults);
        params.assign(this.config); // Custom configuration
        if (params.scrollbar === true) {
            params.scrollbar = {
                el: '.swiper-scrollbar'
            };
        }
        if (params.pagination === true) {
            params.pagination = {
                el: '.swiper-pagination'
            };
        }
        if (params.navigation === true) {
            params.navigation = {
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next'
            };
        }
        if (this.disabled) {
            params.allowSlidePrev = false;
            params.allowSlideNext = false;
        }
        if (this.initialIndex != null) {
            params.initialSlide = this.initialIndex;
            this.initialIndex = null;
        }
        params.on = {
            slideChange: () => {
                if (this.instance && this.indexChange.observers.length) {
                    this.emit(this.indexChange, this.instance.realIndex);
                }
            }
        };
        this.zone.runOutsideAngular(() => {
            this.instance = new Swiper(this.elementRef.nativeElement, params);
        });
        if (params.init !== false && this.S_INIT.observers.length) {
            this.emit(this.S_INIT, this.instance);
        }
        // Add native Swiper event handling
        SwiperEventNames.forEach((eventName) => {
            let swiperEvent = eventName.replace('swiper', '');
            swiperEvent = swiperEvent.charAt(0).toLowerCase() + swiperEvent.slice(1);
            this.instance.on(swiperEvent, (...args) => {
                if (args.length === 1) {
                    args = args[0];
                }
                const output = `S_${swiperEvent.toUpperCase()}`;
                const emitter = this[output];
                if (emitter.observers.length) {
                    this.emit(emitter, args);
                }
            });
        });
        if (!this.configDiff) {
            this.configDiff = this.differs.find(this.config || {}).create();
            this.configDiff.diff(this.config || {});
        }
    }
    ngOnDestroy() {
        if (this.instance) {
            this.zone.runOutsideAngular(() => {
                this.instance.destroy(true, this.instance.initialized || false);
            });
            this.instance = null;
        }
    }
    ngDoCheck() {
        if (this.configDiff) {
            const changes = this.configDiff.diff(this.config || {});
            if (changes) {
                this.initialIndex = this.getIndex(true);
                this.ngOnDestroy();
                this.ngAfterViewInit();
                this.update();
            }
        }
    }
    ngOnChanges(changes) {
        if (this.instance && changes['disabled']) {
            if (changes['disabled'].currentValue !== changes['disabled'].previousValue) {
                if (changes['disabled'].currentValue === true) {
                    this.zone.runOutsideAngular(() => {
                        this.ngOnDestroy();
                        this.ngAfterViewInit();
                    });
                }
                else if (changes['disabled'].currentValue === false) {
                    this.zone.runOutsideAngular(() => {
                        this.ngOnDestroy();
                        this.ngAfterViewInit();
                    });
                }
            }
        }
    }
    emit(emitter, value) {
        if (this.performance) {
            emitter.emit(value);
        }
        else {
            this.zone.run(() => emitter.emit(value));
        }
    }
    swiper() {
        return this.instance;
    }
    init() {
        if (this.instance) {
            this.zone.runOutsideAngular(() => {
                this.instance.init();
            });
        }
    }
    update() {
        setTimeout(() => {
            if (this.instance) {
                this.zone.runOutsideAngular(() => {
                    this.instance.update();
                });
            }
        }, 0);
    }
    getIndex(real) {
        if (!this.instance) {
            return this.initialIndex || 0;
        }
        else {
            return real ? this.instance.realIndex : this.instance.activeIndex;
        }
    }
    setIndex(index, speed, silent) {
        if (!this.instance) {
            this.initialIndex = index;
        }
        else {
            let realIndex = index * this.instance.params.slidesPerGroup;
            if (this.instance.params.loop) {
                realIndex += this.instance.loopedSlides;
            }
            this.zone.runOutsideAngular(() => {
                this.instance.slideTo(realIndex, speed, !silent);
            });
        }
    }
    prevSlide(speed, silent) {
        if (this.instance) {
            this.zone.runOutsideAngular(() => {
                this.instance.slidePrev(speed, !silent);
            });
        }
    }
    nextSlide(speed, silent) {
        if (this.instance) {
            this.zone.runOutsideAngular(() => {
                this.instance.slideNext(speed, !silent);
            });
        }
    }
    stopAutoplay(reset) {
        if (reset) {
            this.setIndex(0);
        }
        if (this.instance && this.instance.autoplay) {
            this.zone.runOutsideAngular(() => {
                this.instance.autoplay.stop();
            });
        }
    }
    startAutoplay(reset) {
        if (reset) {
            this.setIndex(0);
        }
        if (this.instance && this.instance.autoplay) {
            this.zone.runOutsideAngular(() => {
                this.instance.autoplay.start();
            });
        }
    }
    static { this.ɵfac = function SwiperDirective_Factory(t) { return new (t || SwiperDirective)(i0.ɵɵdirectiveInject(PLATFORM_ID), i0.ɵɵdirectiveInject(i0.NgZone), i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.KeyValueDiffers), i0.ɵɵdirectiveInject(SWIPER_CONFIG, 8)); }; }
    static { this.ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: SwiperDirective, selectors: [["", "swiper", ""]], inputs: { index: "index", disabled: "disabled", performance: "performance", config: [i0.ɵɵInputFlags.None, "swiper", "config"] }, outputs: { indexChange: "indexChange", S_INIT: "init", S_BEFOREDESTROY: "beforeDestroy", S_SCROLL: "scroll", S_PROGRESS: "progress", S_KEYPRESS: "keyPress", S_RESIZE: "resize", S_BREAKPOINT: "breakpoint", S_ZOOMCHANGE: "zoomChange", S_AFTERRESIZE: "afterResize", S_BEFORERESIZE: "beforeResize", S_LOOPFIX: "loopFix", S_BEFORELOOPFIX: "beforeLoopFix", S_SLIDERMOVE: "sliderMove", S_SLIDECHANGE: "slideChange", S_SETTRANSLATE: "setTranslate", S_SETTRANSITION: "setTransition", S_FROMEDGE: "fromEdge", S_TOEDGE: "toEdge", S_REACHEND: "reachEnd", S_REACHBEGINNING: "reachBeginning", S_AUTOPLAY: "autoplay", S_AUTOPLAYSTART: "autoplayStart", S_AUTOPLAYSTOP: "autoplayStop", S_IMAGESREADY: "imagesReady", S_LAZYIMAGELOAD: "lazyImageLoad", S_LAZYIMAGEREADY: "lazyImageReady", S_SCROLLDRAGEND: "scrollDragEnd", S_SCROLLDRAGMOVE: "scrollDragMove", S_SCROLLDRAGSTART: "scrollDragStart", S_NAVIGATIONHIDE: "navigationHide", S_NAVIGATIONSHOW: "navigationShow", S_PAGINATIONRENDER: "paginationRender", S_PAGINATIONUPDATE: "paginationUpdate", S_PAGINATIONHIDE: "paginationHide", S_PAGINATIONSHOW: "paginationShow", S_TAP: "swiperTap", S_CLICK: "swiperClick", S_DOUBLETAP: "swiperDoubleTap", S_TOUCHEND: "swiperTouchEnd", S_TOUCHMOVE: "swiperTouchMove", S_TOUCHSTART: "swiperTouchStart", S_TOUCHMOVEOPPOSITE: "swiperTouchMoveOpposite", S_TRANSITIONEND: "swiperTransitionEnd", S_TRANSITIONSTART: "swiperTransitionStart", S_SLIDEPREVTRANSITIONEND: "slidePrevTransitionEnd", S_SLIDEPREVTRANSITIONSTART: "slidePrevTransitionStart", S_SLIDENEXTTRANSITIONEND: "slideNextTransitionEnd", S_SLIDENEXTTRANSITIONSTART: "slideNextTransitionStart", S_SLIDECHANGETRANSITIONEND: "slideChangeTransitionEnd", S_SLIDECHANGETRANSITIONSTART: "slideChangeTransitionStart", S_OBSERVERUPDATE: "observerUpdate" }, exportAs: ["ngxSwiper"], features: [i0.ɵɵNgOnChangesFeature] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SwiperDirective, [{
        type: Directive,
        args: [{
                selector: '[swiper]',
                exportAs: 'ngxSwiper'
            }]
    }], () => [{ type: Object, decorators: [{
                type: Inject,
                args: [PLATFORM_ID]
            }] }, { type: i0.NgZone }, { type: i0.ElementRef }, { type: i0.KeyValueDiffers }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [SWIPER_CONFIG]
            }] }], { index: [{
            type: Input
        }], disabled: [{
            type: Input
        }], performance: [{
            type: Input
        }], config: [{
            type: Input,
            args: ['swiper']
        }], indexChange: [{
            type: Output
        }], S_INIT: [{
            type: Output,
            args: ['init']
        }], S_BEFOREDESTROY: [{
            type: Output,
            args: ['beforeDestroy']
        }], S_SCROLL: [{
            type: Output,
            args: ['scroll']
        }], S_PROGRESS: [{
            type: Output,
            args: ['progress']
        }], S_KEYPRESS: [{
            type: Output,
            args: ['keyPress']
        }], S_RESIZE: [{
            type: Output,
            args: ['resize']
        }], S_BREAKPOINT: [{
            type: Output,
            args: ['breakpoint']
        }], S_ZOOMCHANGE: [{
            type: Output,
            args: ['zoomChange']
        }], S_AFTERRESIZE: [{
            type: Output,
            args: ['afterResize']
        }], S_BEFORERESIZE: [{
            type: Output,
            args: ['beforeResize']
        }], S_LOOPFIX: [{
            type: Output,
            args: ['loopFix']
        }], S_BEFORELOOPFIX: [{
            type: Output,
            args: ['beforeLoopFix']
        }], S_SLIDERMOVE: [{
            type: Output,
            args: ['sliderMove']
        }], S_SLIDECHANGE: [{
            type: Output,
            args: ['slideChange']
        }], S_SETTRANSLATE: [{
            type: Output,
            args: ['setTranslate']
        }], S_SETTRANSITION: [{
            type: Output,
            args: ['setTransition']
        }], S_FROMEDGE: [{
            type: Output,
            args: ['fromEdge']
        }], S_TOEDGE: [{
            type: Output,
            args: ['toEdge']
        }], S_REACHEND: [{
            type: Output,
            args: ['reachEnd']
        }], S_REACHBEGINNING: [{
            type: Output,
            args: ['reachBeginning']
        }], S_AUTOPLAY: [{
            type: Output,
            args: ['autoplay']
        }], S_AUTOPLAYSTART: [{
            type: Output,
            args: ['autoplayStart']
        }], S_AUTOPLAYSTOP: [{
            type: Output,
            args: ['autoplayStop']
        }], S_IMAGESREADY: [{
            type: Output,
            args: ['imagesReady']
        }], S_LAZYIMAGELOAD: [{
            type: Output,
            args: ['lazyImageLoad']
        }], S_LAZYIMAGEREADY: [{
            type: Output,
            args: ['lazyImageReady']
        }], S_SCROLLDRAGEND: [{
            type: Output,
            args: ['scrollDragEnd']
        }], S_SCROLLDRAGMOVE: [{
            type: Output,
            args: ['scrollDragMove']
        }], S_SCROLLDRAGSTART: [{
            type: Output,
            args: ['scrollDragStart']
        }], S_NAVIGATIONHIDE: [{
            type: Output,
            args: ['navigationHide']
        }], S_NAVIGATIONSHOW: [{
            type: Output,
            args: ['navigationShow']
        }], S_PAGINATIONRENDER: [{
            type: Output,
            args: ['paginationRender']
        }], S_PAGINATIONUPDATE: [{
            type: Output,
            args: ['paginationUpdate']
        }], S_PAGINATIONHIDE: [{
            type: Output,
            args: ['paginationHide']
        }], S_PAGINATIONSHOW: [{
            type: Output,
            args: ['paginationShow']
        }], S_TAP: [{
            type: Output,
            args: ['swiperTap']
        }], S_CLICK: [{
            type: Output,
            args: ['swiperClick']
        }], S_DOUBLETAP: [{
            type: Output,
            args: ['swiperDoubleTap']
        }], S_TOUCHEND: [{
            type: Output,
            args: ['swiperTouchEnd']
        }], S_TOUCHMOVE: [{
            type: Output,
            args: ['swiperTouchMove']
        }], S_TOUCHSTART: [{
            type: Output,
            args: ['swiperTouchStart']
        }], S_TOUCHMOVEOPPOSITE: [{
            type: Output,
            args: ['swiperTouchMoveOpposite']
        }], S_TRANSITIONEND: [{
            type: Output,
            args: ['swiperTransitionEnd']
        }], S_TRANSITIONSTART: [{
            type: Output,
            args: ['swiperTransitionStart']
        }], S_SLIDEPREVTRANSITIONEND: [{
            type: Output,
            args: ['slidePrevTransitionEnd']
        }], S_SLIDEPREVTRANSITIONSTART: [{
            type: Output,
            args: ['slidePrevTransitionStart']
        }], S_SLIDENEXTTRANSITIONEND: [{
            type: Output,
            args: ['slideNextTransitionEnd']
        }], S_SLIDENEXTTRANSITIONSTART: [{
            type: Output,
            args: ['slideNextTransitionStart']
        }], S_SLIDECHANGETRANSITIONEND: [{
            type: Output,
            args: ['slideChangeTransitionEnd']
        }], S_SLIDECHANGETRANSITIONSTART: [{
            type: Output,
            args: ['slideChangeTransitionStart']
        }], S_OBSERVERUPDATE: [{
            type: Output,
            args: ['observerUpdate']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpcGVyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYi9zcmMvbGliL3N3aXBlci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxNQUFNLE1BQU0sZUFBZSxDQUFDO0FBR25DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDcEQsT0FBTyxFQUFVLE1BQU0sRUFBRSxRQUFRLEVBQWMsU0FBUyxFQUNSLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUN6QixNQUFNLGVBQWUsQ0FBQztBQUN4RSxPQUFPLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBZSxnQkFBZ0IsRUFBRSxNQUFNLHFCQUFxQixDQUFDOztBQU1qRyxNQUFNLE9BQU8sZUFBZTtJQU8xQixJQUNJLEtBQUssQ0FBQyxLQUFhO1FBQ3JCLElBQUksS0FBSyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkIsQ0FBQztJQUNILENBQUM7SUEyRUQsWUFBeUMsVUFBa0IsRUFBVSxJQUFZLEVBQ3ZFLFVBQXNCLEVBQVUsT0FBd0IsRUFDckIsUUFBdUI7UUFGM0IsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUFVLFNBQUksR0FBSixJQUFJLENBQVE7UUFDdkUsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQWlCO1FBQ3JCLGFBQVEsR0FBUixRQUFRLENBQWU7UUF0RjVELGlCQUFZLEdBQWtCLElBQUksQ0FBQztRQUVuQyxlQUFVLEdBQXVDLElBQUksQ0FBQztRQVNyRCxhQUFRLEdBQVksS0FBSyxDQUFDO1FBRTFCLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBSTVCLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQVUs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QUFDLHdCQUF3QjtZQUNPLDBCQUEwQjtrQkFBaEUsTUFBTTttQkFBQywwQkFBMEI7WUFDSywwQkFBMEI7a0JBQWhFLE1BQU07bUJBQUMsMEJBQTBCO1lBQ0ssNEJBQTRCO2tCQUFsRSxNQUFNO21CQUFDLDRCQUE0QjtZQUNHLGdCQUFnQjtrQkFBdEQsTUFBTTttQkFBQyxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3dpcGVyIGZyb20gJ3N3aXBlci9idW5kbGUnO1xuaW1wb3J0IHsgU3dpcGVyT3B0aW9ucyB9IGZyb20gJ3N3aXBlcic7XG5cbmltcG9ydCB7IFBMQVRGT1JNX0lEIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ1pvbmUsIEluamVjdCwgT3B0aW9uYWwsIEVsZW1lbnRSZWYsIERpcmVjdGl2ZSxcbiAgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBEb0NoZWNrLCBPbkNoYW5nZXMsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlcixcbiAgU2ltcGxlQ2hhbmdlcywgS2V5VmFsdWVEaWZmZXIsIEtleVZhbHVlRGlmZmVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU1dJUEVSX0NPTkZJRywgU3dpcGVyQ29uZmlnLCBTd2lwZXJFdmVudCwgU3dpcGVyRXZlbnROYW1lcyB9IGZyb20gJy4vc3dpcGVyLmludGVyZmFjZXMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbc3dpcGVyXScsXG4gIGV4cG9ydEFzOiAnbmd4U3dpcGVyJ1xufSlcbmV4cG9ydCBjbGFzcyBTd2lwZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIERvQ2hlY2ssIE9uQ2hhbmdlcyB7XG4gIHByaXZhdGUgaW5zdGFuY2U6IGFueTtcblxuICBwcml2YXRlIGluaXRpYWxJbmRleDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgcHJpdmF0ZSBjb25maWdEaWZmOiBLZXlWYWx1ZURpZmZlcjxzdHJpbmcsIGFueT4gfCBudWxsID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBzZXQgaW5kZXgoaW5kZXg6IG51bWJlcikge1xuICAgIGlmIChpbmRleCAhPSBudWxsKSB7XG4gICAgICB0aGlzLnNldEluZGV4KGluZGV4KTtcbiAgICB9XG4gIH1cblxuICBASW5wdXQoKSBkaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpIHBlcmZvcm1hbmNlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQElucHV0KCdzd2lwZXInKSBjb25maWc/OiBTd2lwZXJPcHRpb25zO1xuXG4gIEBPdXRwdXQoKSBpbmRleENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gIEBPdXRwdXQoJ2luaXQnICAgICAgICAgICAgICAgICAgICAgICApIFNfSU5JVCAgICAgICAgICAgICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ2JlZm9yZURlc3Ryb3knICAgICAgICAgICAgICApIFNfQkVGT1JFREVTVFJPWSAgICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgnc2Nyb2xsJyAgICAgICAgICAgICAgICAgICAgICkgU19TQ1JPTEwgICAgICAgICAgICAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgncHJvZ3Jlc3MnICAgICAgICAgICAgICAgICAgICkgU19QUk9HUkVTUyAgICAgICAgICAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgna2V5UHJlc3MnICAgICAgICAgICAgICAgICAgICkgU19LRVlQUkVTUyAgICAgICAgICAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCdyZXNpemUnICAgICAgICAgICAgICAgICAgICAgKSBTX1JFU0laRSAgICAgICAgICAgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdicmVha3BvaW50JyAgICAgICAgICAgICAgICAgKSBTX0JSRUFLUE9JTlQgICAgICAgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCd6b29tQ2hhbmdlJyAgICAgICAgICAgICAgICAgKSBTX1pPT01DSEFOR0UgICAgICAgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdhZnRlclJlc2l6ZScgICAgICAgICAgICAgICAgKSBTX0FGVEVSUkVTSVpFICAgICAgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdiZWZvcmVSZXNpemUnICAgICAgICAgICAgICAgKSBTX0JFRk9SRVJFU0laRSAgICAgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoJ2xvb3BGaXgnICAgICAgICAgICAgICAgICAgICApIFNfTE9PUEZJWCAgICAgICAgICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ2JlZm9yZUxvb3BGaXgnICAgICAgICAgICAgICApIFNfQkVGT1JFTE9PUEZJWCAgICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgnc2xpZGVyTW92ZScgICAgICAgICAgICAgICAgICkgU19TTElERVJNT1ZFICAgICAgICAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnc2xpZGVDaGFuZ2UnICAgICAgICAgICAgICAgICkgU19TTElERUNIQU5HRSAgICAgICAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCdzZXRUcmFuc2xhdGUnICAgICAgICAgICAgICAgKSBTX1NFVFRSQU5TTEFURSAgICAgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdzZXRUcmFuc2l0aW9uJyAgICAgICAgICAgICAgKSBTX1NFVFRSQU5TSVRJT04gICAgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoJ2Zyb21FZGdlJyAgICAgICAgICAgICAgICAgICApIFNfRlJPTUVER0UgICAgICAgICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3RvRWRnZScgICAgICAgICAgICAgICAgICAgICApIFNfVE9FREdFICAgICAgICAgICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3JlYWNoRW5kJyAgICAgICAgICAgICAgICAgICApIFNfUkVBQ0hFTkQgICAgICAgICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3JlYWNoQmVnaW5uaW5nJyAgICAgICAgICAgICApIFNfUkVBQ0hCRUdJTk5JTkcgICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgnYXV0b3BsYXknICAgICAgICAgICAgICAgICAgICkgU19BVVRPUExBWSAgICAgICAgICAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnYXV0b3BsYXlTdGFydCcgICAgICAgICAgICAgICkgU19BVVRPUExBWVNUQVJUICAgICAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnYXV0b3BsYXlTdG9wJyAgICAgICAgICAgICAgICkgU19BVVRPUExBWVNUT1AgICAgICAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCdpbWFnZXNSZWFkeScgICAgICAgICAgICAgICAgKSBTX0lNQUdFU1JFQURZICAgICAgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdsYXp5SW1hZ2VMb2FkJyAgICAgICAgICAgICAgKSBTX0xBWllJTUFHRUxPQUQgICAgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdsYXp5SW1hZ2VSZWFkeScgICAgICAgICAgICAgKSBTX0xBWllJTUFHRVJFQURZICAgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoJ3Njcm9sbERyYWdFbmQnICAgICAgICAgICAgICApIFNfU0NST0xMRFJBR0VORCAgICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3Njcm9sbERyYWdNb3ZlJyAgICAgICAgICAgICApIFNfU0NST0xMRFJBR01PVkUgICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3Njcm9sbERyYWdTdGFydCcgICAgICAgICAgICApIFNfU0NST0xMRFJBR1NUQVJUICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgnbmF2aWdhdGlvbkhpZGUnICAgICAgICAgICAgICkgU19OQVZJR0FUSU9OSElERSAgICAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnbmF2aWdhdGlvblNob3cnICAgICAgICAgICAgICkgU19OQVZJR0FUSU9OU0hPVyAgICAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCdwYWdpbmF0aW9uUmVuZGVyJyAgICAgICAgICAgKSBTX1BBR0lOQVRJT05SRU5ERVIgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdwYWdpbmF0aW9uVXBkYXRlJyAgICAgICAgICAgKSBTX1BBR0lOQVRJT05VUERBVEUgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdwYWdpbmF0aW9uSGlkZScgICAgICAgICAgICAgKSBTX1BBR0lOQVRJT05ISURFICAgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdwYWdpbmF0aW9uU2hvdycgICAgICAgICAgICAgKSBTX1BBR0lOQVRJT05TSE9XICAgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoJ3N3aXBlclRhcCcgICAgICAgICAgICAgICAgICApIFNfVEFQICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3N3aXBlckNsaWNrJyAgICAgICAgICAgICAgICApIFNfQ0xJQ0sgICAgICAgICAgICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3N3aXBlckRvdWJsZVRhcCcgICAgICAgICAgICApIFNfRE9VQkxFVEFQICAgICAgICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3N3aXBlclRvdWNoRW5kJyAgICAgICAgICAgICApIFNfVE9VQ0hFTkQgICAgICAgICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3N3aXBlclRvdWNoTW92ZScgICAgICAgICAgICApIFNfVE9VQ0hNT1ZFICAgICAgICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3N3aXBlclRvdWNoU3RhcnQnICAgICAgICAgICApIFNfVE9VQ0hTVEFSVCAgICAgICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3N3aXBlclRvdWNoTW92ZU9wcG9zaXRlJyAgICApIFNfVE9VQ0hNT1ZFT1BQT1NJVEUgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3N3aXBlclRyYW5zaXRpb25FbmQnICAgICAgICApIFNfVFJBTlNJVElPTkVORCAgICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3N3aXBlclRyYW5zaXRpb25TdGFydCcgICAgICApIFNfVFJBTlNJVElPTlNUQVJUICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgnc2xpZGVQcmV2VHJhbnNpdGlvbkVuZCcgICAgICkgU19TTElERVBSRVZUUkFOU0lUSU9ORU5EICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnc2xpZGVQcmV2VHJhbnNpdGlvblN0YXJ0JyAgICkgU19TTElERVBSRVZUUkFOU0lUSU9OU1RBUlQgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnc2xpZGVOZXh0VHJhbnNpdGlvbkVuZCcgICAgICkgU19TTElERU5FWFRUUkFOU0lUSU9ORU5EICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnc2xpZGVOZXh0VHJhbnNpdGlvblN0YXJ0JyAgICkgU19TTElERU5FWFRUUkFOU0lUSU9OU1RBUlQgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnc2xpZGVDaGFuZ2VUcmFuc2l0aW9uRW5kJyAgICkgU19TTElERUNIQU5HRVRSQU5TSVRJT05FTkQgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnc2xpZGVDaGFuZ2VUcmFuc2l0aW9uU3RhcnQnICkgU19TTElERUNIQU5HRVRSQU5TSVRJT05TVEFSVCAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnb2JzZXJ2ZXJVcGRhdGUnICAgICAgICAgICAgICkgU19PQlNFUlZFUlVQREFURSAgICAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IE9iamVjdCwgcHJpdmF0ZSB6b25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwcml2YXRlIGRpZmZlcnM6IEtleVZhbHVlRGlmZmVycyxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KFNXSVBFUl9DT05GSUcpIHByaXZhdGUgZGVmYXVsdHM6IFN3aXBlck9wdGlvbnMpIHt9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIGlmICghaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBTd2lwZXJDb25maWcodGhpcy5kZWZhdWx0cyk7XG5cbiAgICBwYXJhbXMuYXNzaWduKHRoaXMuY29uZmlnKTsgLy8gQ3VzdG9tIGNvbmZpZ3VyYXRpb25cblxuICAgIGlmIChwYXJhbXMuc2Nyb2xsYmFyID09PSB0cnVlKSB7XG4gICAgICBwYXJhbXMuc2Nyb2xsYmFyID0ge1xuICAgICAgICBlbDogJy5zd2lwZXItc2Nyb2xsYmFyJ1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAocGFyYW1zLnBhZ2luYXRpb24gPT09IHRydWUpIHtcbiAgICAgIHBhcmFtcy5wYWdpbmF0aW9uID0ge1xuICAgICAgICBlbDogJy5zd2lwZXItcGFnaW5hdGlvbidcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcy5uYXZpZ2F0aW9uID09PSB0cnVlKSB7XG4gICAgICBwYXJhbXMubmF2aWdhdGlvbiA9IHtcbiAgICAgICAgcHJldkVsOiAnLnN3aXBlci1idXR0b24tcHJldicsXG4gICAgICAgIG5leHRFbDogJy5zd2lwZXItYnV0dG9uLW5leHQnXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICBwYXJhbXMuYWxsb3dTbGlkZVByZXYgPSBmYWxzZTtcbiAgICAgIHBhcmFtcy5hbGxvd1NsaWRlTmV4dCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmluaXRpYWxJbmRleCAhPSBudWxsKSB7XG4gICAgICBwYXJhbXMuaW5pdGlhbFNsaWRlID0gdGhpcy5pbml0aWFsSW5kZXg7XG5cbiAgICAgIHRoaXMuaW5pdGlhbEluZGV4ID0gbnVsbDtcbiAgICB9XG5cbiAgICBwYXJhbXMub24gPSB7XG4gICAgICBzbGlkZUNoYW5nZTogKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pbnN0YW5jZSAmJiB0aGlzLmluZGV4Q2hhbmdlLm9ic2VydmVycy5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLmVtaXQodGhpcy5pbmRleENoYW5nZSwgdGhpcy5pbnN0YW5jZS5yZWFsSW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLmluc3RhbmNlID0gbmV3IFN3aXBlcih0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgcGFyYW1zKTtcbiAgICB9KTtcblxuICAgIGlmIChwYXJhbXMuaW5pdCAhPT0gZmFsc2UgJiYgdGhpcy5TX0lOSVQub2JzZXJ2ZXJzLmxlbmd0aCkge1xuICAgICAgdGhpcy5lbWl0KHRoaXMuU19JTklULCB0aGlzLmluc3RhbmNlKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgbmF0aXZlIFN3aXBlciBldmVudCBoYW5kbGluZ1xuICAgIFN3aXBlckV2ZW50TmFtZXMuZm9yRWFjaCgoZXZlbnROYW1lOiBTd2lwZXJFdmVudCkgPT4ge1xuICAgICAgbGV0IHN3aXBlckV2ZW50ID0gZXZlbnROYW1lLnJlcGxhY2UoJ3N3aXBlcicsICcnKTtcblxuICAgICAgc3dpcGVyRXZlbnQgPSBzd2lwZXJFdmVudC5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIHN3aXBlckV2ZW50LnNsaWNlKDEpO1xuXG4gICAgICB0aGlzLmluc3RhbmNlLm9uKHN3aXBlckV2ZW50LCAoLi4uYXJnczogYW55W10pID0+IHtcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgYXJncyA9IGFyZ3NbMF07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvdXRwdXQgPSBgU18ke3N3aXBlckV2ZW50LnRvVXBwZXJDYXNlKCl9YDtcblxuICAgICAgICBjb25zdCBlbWl0dGVyID0gdGhpc1tvdXRwdXQgYXMga2V5b2YgU3dpcGVyRGlyZWN0aXZlXSBhcyBFdmVudEVtaXR0ZXI8YW55PjtcblxuICAgICAgICBpZiAoZW1pdHRlci5vYnNlcnZlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KGVtaXR0ZXIsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGlmICghdGhpcy5jb25maWdEaWZmKSB7XG4gICAgICB0aGlzLmNvbmZpZ0RpZmYgPSB0aGlzLmRpZmZlcnMuZmluZCh0aGlzLmNvbmZpZyB8fCB7fSkuY3JlYXRlKCk7XG5cbiAgICAgIHRoaXMuY29uZmlnRGlmZi5kaWZmKHRoaXMuY29uZmlnIHx8IHt9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZSkge1xuICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZS5kZXN0cm95KHRydWUsIHRoaXMuaW5zdGFuY2UuaW5pdGlhbGl6ZWQgfHzCoGZhbHNlKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmluc3RhbmNlID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBuZ0RvQ2hlY2soKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29uZmlnRGlmZikge1xuICAgICAgY29uc3QgY2hhbmdlcyA9IHRoaXMuY29uZmlnRGlmZi5kaWZmKHRoaXMuY29uZmlnIHx8IHt9KTtcblxuICAgICAgaWYgKGNoYW5nZXMpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsSW5kZXggPSB0aGlzLmdldEluZGV4KHRydWUpO1xuXG4gICAgICAgIHRoaXMubmdPbkRlc3Ryb3koKTtcblxuICAgICAgICB0aGlzLm5nQWZ0ZXJWaWV3SW5pdCgpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmluc3RhbmNlICYmIGNoYW5nZXNbJ2Rpc2FibGVkJ10pIHtcbiAgICAgIGlmIChjaGFuZ2VzWydkaXNhYmxlZCddLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1snZGlzYWJsZWQnXS5wcmV2aW91c1ZhbHVlKSB7XG4gICAgICAgIGlmIChjaGFuZ2VzWydkaXNhYmxlZCddLmN1cnJlbnRWYWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm5nT25EZXN0cm95KCk7XG5cbiAgICAgICAgICAgIHRoaXMubmdBZnRlclZpZXdJbml0KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hhbmdlc1snZGlzYWJsZWQnXS5jdXJyZW50VmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubmdPbkRlc3Ryb3koKTtcblxuICAgICAgICAgICAgdGhpcy5uZ0FmdGVyVmlld0luaXQoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZW1pdChlbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiwgdmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBlcmZvcm1hbmNlKSB7XG4gICAgICBlbWl0dGVyLmVtaXQodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnpvbmUucnVuKCgpID0+IGVtaXR0ZXIuZW1pdCh2YWx1ZSkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzd2lwZXIoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmluc3RhbmNlKSB7XG4gICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICB0aGlzLmluc3RhbmNlLmluaXQoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5pbnN0YW5jZSkge1xuICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaW5zdGFuY2UudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sIDApO1xuICB9XG5cbiAgcHVibGljIGdldEluZGV4KHJlYWw/OiBib29sZWFuKTogbnVtYmVyIHtcbiAgICBpZiAoIXRoaXMuaW5zdGFuY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLmluaXRpYWxJbmRleCB8fMKgMDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlYWwgPyB0aGlzLmluc3RhbmNlLnJlYWxJbmRleCA6IHRoaXMuaW5zdGFuY2UuYWN0aXZlSW5kZXg7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNldEluZGV4KGluZGV4OiBudW1iZXIsIHNwZWVkPzogbnVtYmVyLCBzaWxlbnQ/OiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmluc3RhbmNlKSB7XG4gICAgICB0aGlzLmluaXRpYWxJbmRleCA9IGluZGV4O1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgcmVhbEluZGV4ID0gaW5kZXggKiB0aGlzLmluc3RhbmNlLnBhcmFtcy5zbGlkZXNQZXJHcm91cDtcblxuICAgICAgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxvb3ApIHtcbiAgICAgICAgcmVhbEluZGV4ICs9IHRoaXMuaW5zdGFuY2UubG9vcGVkU2xpZGVzO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICB0aGlzLmluc3RhbmNlLnNsaWRlVG8ocmVhbEluZGV4LCBzcGVlZCwgIXNpbGVudCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcHJldlNsaWRlKHNwZWVkPzogbnVtYmVyLCBzaWxlbnQ/OiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMuaW5zdGFuY2Uuc2xpZGVQcmV2KHNwZWVkLCAhc2lsZW50KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZXh0U2xpZGUoc3BlZWQ/OiBudW1iZXIsIHNpbGVudD86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZSkge1xuICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZS5zbGlkZU5leHQoc3BlZWQsICFzaWxlbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHN0b3BBdXRvcGxheShyZXNldD86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAocmVzZXQpIHtcbiAgICAgIHRoaXMuc2V0SW5kZXgoMCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaW5zdGFuY2UgJiYgdGhpcy5pbnN0YW5jZS5hdXRvcGxheSkge1xuICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZS5hdXRvcGxheS5zdG9wKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc3RhcnRBdXRvcGxheShyZXNldD86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAocmVzZXQpIHtcbiAgICAgIHRoaXMuc2V0SW5kZXgoMCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaW5zdGFuY2UgJiYgdGhpcy5pbnN0YW5jZS5hdXRvcGxheSkge1xuICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZS5hdXRvcGxheS5zdGFydCgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iXX0=