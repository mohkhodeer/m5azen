import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
  NativeScriptCommonModule,
  NativeScriptFormsModule,
} from "@nativescript/angular";
import { DropDownModule } from "nativescript-drop-down/angular";

import { SandoqRoutingModule } from "./sandoq-routing.module";
import { SandoqComponent } from "./sandoq.component";

@NgModule({
  imports: [
    NativeScriptCommonModule,
    SandoqRoutingModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    DropDownModule,
  ],
  declarations: [SandoqComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SandoqModule {}
