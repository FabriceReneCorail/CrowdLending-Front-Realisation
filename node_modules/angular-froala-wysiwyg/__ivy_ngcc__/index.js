import * as ɵngcc0 from '@angular/core';
import * as ɵngcc1 from './editor/editor.module';
import * as ɵngcc2 from './view/view.module';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { FroalaEditorModule } from './editor';
import { FroalaViewModule } from './view';
export { FroalaEditorDirective, FroalaEditorModule } from './editor';
export { FroalaViewDirective, FroalaViewModule } from './view';
var MODULES = [
    FroalaEditorModule,
    FroalaViewModule
];
var FERootModule = /** @class */ (function () {
    function FERootModule() {
    }
FERootModule.ɵmod = ɵngcc0.ɵɵdefineNgModule({ type: FERootModule });
FERootModule.ɵinj = ɵngcc0.ɵɵdefineInjector({ factory: function FERootModule_Factory(t) { return new (t || FERootModule)(); }, imports: [[
            FroalaEditorModule.forRoot(),
            FroalaViewModule.forRoot()
        ],
        FroalaEditorModule,
        FroalaViewModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵngcc0.ɵɵsetNgModuleScope(FERootModule, { imports: [ɵngcc1.FroalaEditorModule, ɵngcc2.FroalaViewModule], exports: [FroalaEditorModule,
        FroalaViewModule] }); })();
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(FERootModule, [{
        type: NgModule,
        args: [{
                imports: [
                    FroalaEditorModule.forRoot(),
                    FroalaViewModule.forRoot()
                ],
                exports: MODULES
            }]
    }], function () { return []; }, null); })();
    return FERootModule;
}());
export { FERootModule };

//# sourceMappingURL=index.js.map