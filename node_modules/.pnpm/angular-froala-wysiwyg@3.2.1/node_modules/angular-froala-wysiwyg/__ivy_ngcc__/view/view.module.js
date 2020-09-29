import * as ɵngcc0 from '@angular/core';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { FroalaViewDirective } from './view.directive';
var FroalaViewModule = /** @class */ (function () {
    function FroalaViewModule() {
    }
    FroalaViewModule_1 = FroalaViewModule;
    FroalaViewModule.forRoot = function () {
        return { ngModule: FroalaViewModule_1, providers: [] };
    };
    var FroalaViewModule_1;
FroalaViewModule.ɵmod = ɵngcc0.ɵɵdefineNgModule({ type: FroalaViewModule });
FroalaViewModule.ɵinj = ɵngcc0.ɵɵdefineInjector({ factory: function FroalaViewModule_Factory(t) { return new (t || FroalaViewModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵngcc0.ɵɵsetNgModuleScope(FroalaViewModule, { declarations: function () { return [FroalaViewDirective]; }, exports: function () { return [FroalaViewDirective]; } }); })();
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(FroalaViewModule, [{
        type: NgModule,
        args: [{
                declarations: [FroalaViewDirective],
                exports: [FroalaViewDirective]
            }]
    }], function () { return []; }, null); })();
    return FroalaViewModule;
}());
export { FroalaViewModule };

//# sourceMappingURL=view.module.js.map