import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

const routes: Routes = [
  { path: '', redirectTo: '/sell', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('~/app/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'purchase',
    loadChildren: () => import('~/app/purchase/purchase.module').then((m) => m.PurchaseModule),
  },
  {
    path: 'sell',
    loadChildren: () => import('~/app/sell/sell.module').then((m) => m.SellModule),
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
    path: 'sandoq',
    loadChildren: () => import('~/app/sandoq/sandoq.module').then((m) => m.SandoqModule),
  },
  {
    path: 'reports',
    loadChildren: () => import('~/app/reports/reports.module').then((m) => m.ReportsModule),
  }
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
