import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {
  NativeScriptCommonModule,
  NativeScriptFormsModule,
} from "@nativescript/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { DropDownModule } from "nativescript-drop-down/angular";

import { UserRoutingModule } from "./user-routing.module";
import { UserComponent } from "./user.component";
import { EditUserComponent } from "./edit-user/edit-user.component";

@NgModule({
  imports: [
    NativeScriptCommonModule,
    UserRoutingModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    DropDownModule,
  ],
  declarations: [UserComponent, EditUserComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class UserModule {}
