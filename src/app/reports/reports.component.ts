import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Application } from "@nativescript/core";
import { ReportsService } from "../shared/reports.service";

@Component({
  selector: "Reports",
  templateUrl: "./reports.component.html",
})
export class ReportsComponent implements OnInit {
  profit: number = 0;
  totalPrice: number = 0;
  totalPaidPrice: number = 0;
  totalPurchasePrice: number = 0;
  customersDebts: number = 0;
  fontColor: string = "black"
  startDate: string = "";
  endDate: string = "";

  constructor(private reportsService: ReportsService) {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
    // Init your component properties here.
    let dayEndDate = Date.now();
    let dayStartDate = Date.now() - 24 * 60 * 60 * 1000;
    console.log("dayStartDate:", dayStartDate, "dayEndDate:", dayEndDate);

    this.reportsService
      .getReports(dayStartDate / 1000, dayEndDate / 1000)
      .then((res: any) => {
        console.log("reports:", res);
        if (res && res.data) {
          for(let row of res.data){
            this.totalPrice += Number(row[0]);
            this.totalPaidPrice += Number(row[1]);
            this.totalPurchasePrice += Number(row[2]);
          }
          this.profit = Number(this.totalPaidPrice) - Number(this.totalPurchasePrice);
          this.customersDebts = Number(this.totalPrice) - Number(this.totalPaidPrice);
          let startDateFormat = new Date(dayStartDate);
          let endDateFormat = new Date(dayEndDate);
          this.startDate =
            startDateFormat.getDate() +
            "/" +
            (startDateFormat.getMonth() + 1) +
            "/" +
            startDateFormat.getFullYear();
          this.endDate =
            endDateFormat.getDate() +
            "/" +
            (endDateFormat.getMonth() + 1) +
            "/" +
            endDateFormat.getFullYear();
            this.fontColor = this.profit >= 0 ? 'green' : 'red';
        }
      });
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }
}
