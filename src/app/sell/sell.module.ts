import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
  NativeScriptCommonModule,
  NativeScriptFormsModule,
} from "@nativescript/angular";
import { DropDownModule } from "nativescript-drop-down/angular";

import { SellRoutingModule } from "./sell-routing.module";
import { SellComponent } from "./sell.component";
import { EditSellComponent } from "./edit-sell/edit-sell.component";

@NgModule({
  imports: [
    NativeScriptCommonModule,
    SellRoutingModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    DropDownModule,
  ],
  declarations: [SellComponent, EditSellComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SellModule {}
