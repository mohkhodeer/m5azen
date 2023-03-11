import { Injectable } from "@angular/core";
import Sqlite from "nativescript-sqlite";
// import {  } from "../reports";

@Injectable({
  providedIn: "root",
})
export class ReportsService {
  public con: any;

  connectDB(): Promise<any> {
    if (!Sqlite.exists("m5azen.db")) {
      Sqlite.copyDatabase("m5azen.db");
      console.log("DB copied now.");
    } else {
      console.log("DB exists..");
    }
    return new Sqlite("m5azen.db");
  }

  // Reports crud operations

  getReports(startDate: number, endDate: number) {
    if (startDate > 0 && endDate > 0) {
      return new Promise<Object>((resolve, reject) => {
        this.connectDB().then((db) => {
          db.all(
            `SELECT si.total_price, si.total_paid_price, si.total_purchase_price
            FROM sale_invoice si            
            WHERE si.date >= ${startDate} and si.date <= ${endDate}`
          ).then(
            (saleData: any) => {
              if (saleData && saleData.length > 0) {
                console.log("getReports sale data:", saleData);
                if (saleData && saleData.length > 0) {
                  console.log("getReports purchase data:", saleData);
                }
                resolve({ status: true, data: saleData });
              }
            },
            (err) => {
              console.log("getReports err:", err);
              reject({ status: false });
            }
          );
        });
      });
    }
  }
}
