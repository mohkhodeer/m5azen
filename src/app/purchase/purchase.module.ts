import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
  NativeScriptCommonModule,
  NativeScriptFormsModule,
} from "@nativescript/angular";
import { DropDownModule } from "nativescript-drop-down/angular";

import { PurchaseRoutingModule } from "./purchase-routing.module";
import { PurchaseComponent } from "./purchase.component";
import { EditPurchaseComponent } from "./edit-purchase/edit-purchase.component";

@NgModule({
  imports: [
    NativeScriptCommonModule,
    PurchaseRoutingModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    DropDownModule,
  ],
  declarations: [PurchaseComponent, EditPurchaseComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class PurchaseModule {}
