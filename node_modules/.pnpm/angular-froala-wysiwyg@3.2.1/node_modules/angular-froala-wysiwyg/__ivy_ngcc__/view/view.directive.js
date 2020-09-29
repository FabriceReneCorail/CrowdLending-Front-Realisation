import * as ɵngcc0 from '@angular/core';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, ElementRef, Renderer2, Input } from '@angular/core';
var FroalaViewDirective = /** @class */ (function () {
    function FroalaViewDirective(renderer, element) {
        this.renderer = renderer;
        this._element = element.nativeElement;
    }
    Object.defineProperty(FroalaViewDirective.prototype, "froalaView", {
        // update content model as it comes
        set: function (content) {
            this._element.innerHTML = content;
        },
        enumerable: true,
        configurable: true
    });
    FroalaViewDirective.prototype.ngAfterViewInit = function () {
        this.renderer.addClass(this._element, "fr-view");
    };
    __decorate([
        Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], FroalaViewDirective.prototype, "froalaView", null);
    FroalaViewDirective = __decorate([ __metadata("design:paramtypes", [Renderer2, ElementRef])
    ], FroalaViewDirective);
FroalaViewDirective.ɵfac = function FroalaViewDirective_Factory(t) { return new (t || FroalaViewDirective)(ɵngcc0.ɵɵdirectiveInject(ɵngcc0.Renderer2), ɵngcc0.ɵɵdirectiveInject(ɵngcc0.ElementRef)); };
FroalaViewDirective.ɵdir = ɵngcc0.ɵɵdefineDirective({ type: FroalaViewDirective, selectors: [["", "froalaView", ""]], inputs: { froalaView: "froalaView" } });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(FroalaViewDirective, [{
        type: Directive,
        args: [{
                selector: '[froalaView]'
            }]
    }], function () { return [{ type: ɵngcc0.Renderer2 }, { type: ɵngcc0.ElementRef }]; }, { froalaView: [{
            type: Input
        }] }); })();
    return FroalaViewDirective;
}());
export { FroalaViewDirective };

//# sourceMappingURL=view.directive.js.map