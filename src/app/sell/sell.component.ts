import { Component, OnInit } from "@angular/core";
import { Application, Dialogs } from "@nativescript/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { TablesService } from "../shared/tables.service";
import { SellService } from "../shared/sell.service";
import { Sell } from "../sell.model";

@Component({
  selector: "Sell",
  templateUrl: "./sell.component.html",
})
export class SellComponent implements OnInit {
  items: Array<Sell> = [
    {
      id: 0,
      customerId: 0,
      date: 0,
      notes: "",
      totalPaidPrice: 0,
      totalPrice: 0,
      totalPurchasePrice: 0,
    },
  ];

  constructor(
    private sellService: SellService,
    private tablesService: TablesService
  ) {}

  ngOnInit(): void {
    console.log("sell....");
    this.getAllSells();
  }

  delete(id) {
    console.log("del id:", id);
    if (id && id > 0) {
      Dialogs.confirm({
        title: "حذف",
        message: "هل تريد فعلا حذف هذه الفاتورة؟",
        okButtonText: "موافق",
        cancelButtonText: "إلغاء",
      }).then((yes) => {
        console.log("Dialog closed!");
        if (yes) {
          this.sellService.deleteSellInvoice(id).then(
            (result: any) => {
              console.log("deleteSell:::", result);
              // TODO: update stock
              // TODO: update sandoq
              this.getAllSells();
            },
            (err) => {
              console.log("deleteSell err:::", err);
            }
          );
        }
      });
    }
  }

  getAllSells() {
    this.sellService.getSellInvoices().then(
      (result: any) => {
        if (result.status) {
          console.log("getAllSells::", result);

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
