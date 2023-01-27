import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { HomeComponent } from "./home.component";
import { EditProductComponent } from './edit-product/edit-product.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: 'edit-product/:id', component: EditProductComponent },
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class HomeRoutingModule {}
