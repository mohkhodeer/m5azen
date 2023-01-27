import { Component, OnInit } from "@angular/core";
import { Application, Dialogs } from "@nativescript/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { TablesService } from "../shared/tables.service";
import { PurchaseService } from "../shared/purchase.service";
import { Purchase } from "../purchase.model";

@Component({
  selector: "Purchase",
  templateUrl: "./purchase.component.html",
})
export class PurchaseComponent implements OnInit {
  items: Array<Purchase> = [
    {
      id: 0,
      supplierId: 0,
      date: 0,
      notes: "",
      details: [{
        id: 0,
        purchaseInvoiceId: 0,
        productId: 0,
        quantity: 0,
        price: 0,
        paidPrice: 0,
      }],
    },
  ];

  constructor(private purchaseService: PurchaseService, private tablesService: TablesService) {}

  ngOnInit(): void {
    console.log("purchase....");
    this.getAllPurchases();
  }

  delete(id) {
    console.log("del id:", id);
    if (id && id > 0) {
      Dialogs.confirm({
        title: "حذف",
        message: "هل تريد فعلا حذف هذه الفاتورة؟",
        okButtonText: "موافق",
        cancelButtonText: "إلغاء",
      }).then(() => {
        console.log("Dialog closed!");
        this.purchaseService.deletePurchaseInvoice(id).then(
          (result: any) => {
            console.log("deletePurchase:::", result);
            this.getAllPurchases();
          },
          (err) => {
            console.log("deletePurchase err:::", err);
          }
        );
      });
    }
  }

  getAllPurchases() {
    this.purchaseService.getPurchaseInvoices().then(
      (result: any) => {
        if (result.status) {
          this.items = result.data;
        }
      },
      (err) => {
        console.log("err:::", err);
      }
    );
    console.log("end..");
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }

  ngOnDestroy() {
    this.tablesService.closeDBConnection();
  }
}
