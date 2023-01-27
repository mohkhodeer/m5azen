import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
  NativeScriptCommonModule,
  NativeScriptFormsModule,
} from "@nativescript/angular";

import { CategoryRoutingModule } from "./category-routing.module";
import { CategoryComponent } from "./category.component";
import { EditCategoryComponent } from "./edit-category/edit-category.component";

@NgModule({
  declarations: [CategoryComponent, EditCategoryComponent],
  imports: [
    NativeScriptCommonModule,
    CategoryRoutingModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class CategoryModule {}
