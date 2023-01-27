import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

import { CategoryComponent } from './category.component'
import { EditCategoryComponent } from './edit-category/edit-category.component';

const routes: Routes = [
  { path: '', component: CategoryComponent },
  { path: 'edit-category/:id', component: EditCategoryComponent },
]

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class CategoryRoutingModule {}
