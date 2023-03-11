import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { SellComponent } from "./sell.component";
import { EditSellComponent } from "./edit-sell/edit-sell.component";

const routes: Routes = [
  { path: "", component: SellComponent },
  { path: "edit-sell/:id", component: EditSellComponent },
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class SellRoutingModule {}
