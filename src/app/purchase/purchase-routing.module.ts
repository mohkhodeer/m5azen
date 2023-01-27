import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

import { PurchaseComponent } from './purchase.component'
import { EditPurchaseComponent } from './edit-purchase/edit-purchase.component'

const routes: Routes = [
  { path: '', component: PurchaseComponent },
  { path: 'edit-purchase/:id', component: EditPurchaseComponent }
]

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class PurchaseRoutingModule {}
