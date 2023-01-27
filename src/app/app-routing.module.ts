import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

const routes: Routes = [
  { path: '', redirectTo: '/purchase', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('~/app/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'purchase',
    loadChildren: () => import('~/app/purchase/purchase.module').then((m) => m.PurchaseModule),
  },
  {
    path: 'category',
    loadChildren: () => import('~/app/category/category.module').then((m) => m.CategoryModule),
  },
  {
    path: 'user',
    loadChildren: () => import('~/app/user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('~/app/settings/settings.module').then((m) => m.SettingsModule),
  },
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
