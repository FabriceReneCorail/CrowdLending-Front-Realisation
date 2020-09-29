import * as ɵngcc0 from '@angular/core';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { FroalaEditorDirective } from './editor.directive';
var FroalaEditorModule = /** @class */ (function () {
    function FroalaEditorModule() {
    }
    FroalaEditorModule_1 = FroalaEditorModule;
    FroalaEditorModule.forRoot = function () {
        return { ngModule: FroalaEditorModule_1, providers: [] };
    };
    var FroalaEditorModule_1;
FroalaEditorModule.ɵmod = ɵngcc0.ɵɵdefineNgModule({ type: FroalaEditorModule });
FroalaEditorModule.ɵinj = ɵngcc0.ɵɵdefineInjector({ factory: function FroalaEditorModule_Factory(t) { return new (t || FroalaEditorModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵngcc0.ɵɵsetNgModuleScope(FroalaEditorModule, { declarations: function () { return [FroalaEditorDirective]; }, exports: function () { return [FroalaEditorDirective]; } }); })();
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(FroalaEditorModule, [{
        type: NgModule,
        args: [{
                declarations: [FroalaEditorDirective],
                exports: [FroalaEditorDirective]
            }]
    }], function () { return []; }, null); })();
    return FroalaEditorModule;
}());
export { FroalaEditorModule };

//# sourceMappingURL=editor.module.js.map