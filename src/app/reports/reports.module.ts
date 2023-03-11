import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
  NativeScriptCommonModule,
  NativeScriptFormsModule,
} from "@nativescript/angular";
import { DropDownModule } from "nativescript-drop-down/angular";

import { ReportsRoutingModule } from "./reports-routing.module";
import { ReportsComponent } from "./reports.component";

@NgModule({
  imports: [
    NativeScriptCommonModule,
    ReportsRoutingModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    DropDownModule,
  ],
  declarations: [ReportsComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ReportsModule {}
