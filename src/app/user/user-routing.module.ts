import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { UserComponent } from "./user.component";
import { EditUserComponent } from "./edit-user/edit-user.component";

const routes: Routes = [
  { path: "", component: UserComponent },
  { path: "edit-user/:id", component: EditUserComponent },
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class UserRoutingModule {}
