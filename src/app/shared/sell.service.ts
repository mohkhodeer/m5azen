import { Injectable } from "@angular/core";
import Sqlite from "nativescript-sqlite";
import { Sell, SellDetails } from "../sell.model";

@Injectable({
  providedIn: "root",
})
export class SellService {
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

  // SellInvoice crud operations
  saveSellInvoice(sell: Sell) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL(
          "INSERT INTO sale_invoice (customer_id, date, notes, total_price, total_paid_price, total_purchase_price) VALUES (?,?,?,?,?,?)",
          [
            sell.customerId,
            sell.date,
            sell.notes,
            sell.totalPrice,
            sell.totalPaidPrice,
            sell.totalPurchasePrice,
          ]
        ).then(
          (id) => {
            console.log("saveSellInvoice id:", id);
            resolve({ status: true, id: id });
          },
          (err) => {
            console.log("saveSellInvoice err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  saveSellInvoiceDetails(sellDetails: SellDetails) {
    console.log("<<sellDetails>>", sellDetails);

    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL(
          "INSERT INTO sale_invoice_details (sale_invoice_id, product_id, quantity, price, paid_price, purchase_price) VALUES (?,?,?,?,?,?)",
          [
            sellDetails.sellInvoiceId,
            sellDetails.productId,
            sellDetails.quantity,
            sellDetails.price,
            sellDetails.paidPrice,
            sellDetails.purchasePrice,
          ]
        ).then(
          (id) => {
            console.log("saveSellInvoiceDetails id:", id);
            resolve({ status: true });
          },
          (err) => {
            console.log("saveSellInvoiceDetails err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  updateSellInvoice(sell: Sell) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL(
          "UPDATE sale_invoice SET customer_id = ?, date = ?, notes = ?, total_price = ?, total_paid_price = ?, total_purchase_price WHERE id = ?",
          [
            sell.customerId,
            sell.date,
            sell.notes,
            sell.totalPrice,
            sell.totalPaidPrice,
            sell.totalPurchasePrice,
            sell.id,
          ]
        ).then(
          (id) => {
            console.log("updateSellInvoice id:", id);
            resolve({ status: true, id: id });
          },
          (err) => {
            console.log("updateSellInvoice err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  updateSellInvoiceDetails(sellDetails: SellDetails) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL(
          "UPDATE sale_invoice_details SET sale_invoice_id = ?, product_id = ?, quantity = ?, price = ?, paid_price = ? , purchase_price = ? WHERE id = ?",
          [
            sellDetails.sellInvoiceId,
            sellDetails.productId,
            sellDetails.quantity,
            sellDetails.price,
            sellDetails.paidPrice,
            sellDetails.purchasePrice,
          ]
        ).then(
          (id) => {
            console.log("updateSellInvoiceDetails id:", id);
            resolve({ status: true });
          },
          (err) => {
            console.log("updateSellInvoiceDetails err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  deleteSellInvoice(id: number) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL("DELETE FROM sale_invoice WHERE id = ?", [id]).then(
          (id) => {
            console.log("deleteSellInvoice id:", id);
            this.deleteAllSellInvoiceDetails(id);
            resolve({ status: true });
          },
          (err) => {
            console.log("deleteSellInvoice err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  deleteSellInvoiceDetails(id: number) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL("DELETE FROM sale_invoice_details WHERE id = ?", [id]).then(
          (id) => {
            console.log("deleteSellInvoiceDetails id:", id);
            resolve({ status: true });
          },
          (err) => {
            console.log("deleteSellInvoiceDetails err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  deleteAllSellInvoiceDetails(id: number) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL(
          "DELETE FROM sale_invoice_details WHERE sale_invoice_id = ?",
          [id]
        ).then(
          (id) => {
            console.log("deleteAllSellInvoiceDetails id:", id);
            resolve({ status: true });
          },
          (err) => {
            console.log("deleteAllSellInvoiceDetails err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  getSellInvoiceWithDetails(id: number) {
    let sellObject: Sell;
    let sellDetailsObject: SellDetails;
    let sellDetailsObjectArray: Array<SellDetails> = [];
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.all(
          "SELECT pi.*,pid.* from sale_invoice as pi LEFT JOIN sale_invoice_details as pid ON pi.id = pid.sale_invoice_id WHERE pi.id = ?",
          [id]
        ).then(
          (data) => {
            console.log("getSellInvoiceWithDetails:", data);
            if (data && data.length > 0) {
              // SellInvoice master object
              sellObject = {
                id: data[0][0],
                customerId: data[0][1],
                date: data[0][2],
                notes: data[0][3] ? data[0][3] : "",
                totalPrice: data[0][4] ? data[0][4] : 0,
                totalPaidPrice: data[0][5] ? data[0][5] : 0,
                totalPurchasePrice: data[0][6] ? data[0][6] : 0,
                details: null,
              };
              data.forEach((row, index) => {
                // sellDetailsObject details object
                console.log("row****", row);

                sellDetailsObject = {
                  id: row[7],
                  sellInvoiceId: row[8],
                  productId: row[9],
                  quantity: row[10],
                  price: row[11],
                  paidPrice: row[12],
                  purchasePrice: row[13],
                };
                sellDetailsObjectArray.push(sellDetailsObject);
              });
              sellObject.details = sellDetailsObjectArray;
              console.log("getSellInvoiceWithDetails::", sellObject);
              resolve({ status: true, data: sellObject });
            }
          },
          (err) => {
            console.log("getSellInvoiceWithDetails err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  getSellInvoicesWithDetails() {
    let sellObject: Sell;
    let sellDetailsObject: SellDetails;
    let sellArray: Array<Sell> = [];
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.get(
          "SELECT * from sale_invoice as pi LEFT JOIN sale_invoice_details as pid ON pi.id = pid.sale_invoice_id"
        ).then(
          (data) => {
            if (data && data.length > 0) {
              data.forEach((row, index) => {
                // SellInvoice master object
                sellObject = {
                  id: row[0][0],
                  customerId: row[0][1],
                  date: row[0][2],
                  notes: row[0][3] ? row[0][3] : "",
                  totalPrice: data[0][4] ? data[0][4] : 0,
                  totalPaidPrice: data[0][5] ? data[0][5] : 0,
                  totalPurchasePrice: data[0][6] ? data[0][6] : 0,
                };
                // sellDetailsObject details object
                sellDetailsObject = {
                  sellInvoiceId: row[7],
                  productId: row[8],
                  quantity: row[9],
                  price: row[10],
                  paidPrice: row[11],
                  purchasePrice: row[12],
                };
                sellObject.details?.push(sellDetailsObject);
              });
              console.log("getSellInvoicesWithDetails:", sellObject);
              sellArray.push(sellObject);
              resolve({ status: true, data: sellArray });
            }
          },
          (err) => {
            console.log("getSellInvoicesWithDetails err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  getSellInvoices() {
    let sellObject: {};
    let sellArray: Array<{}> = [];
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.all(
          "SELECT si.*, u.name from sale_invoice as si LEFT JOIN user as u ON si.customer_id = u.id ORDER BY si.id DESC"
        ).then(
          (data) => {
            console.log("getSellInvoices>>>", data);

            if (data && data.length > 0) {
              data.forEach((row, index) => {
                // SellInvoice master object
                let dateFormat = new Date(row[2] * 1000);
                sellObject = {
                  id: row[0],
                  customer: row[7],
                  date:
                    dateFormat.getDate() +
                    "/" +
                    (dateFormat.getMonth() + 1) +
                    "/" +
                    dateFormat.getFullYear(),
                  notes: row[3] ? row[3] : "",
                  totalPrice: row[4] ? row[4] : 0,
                  totalPaidPrice: row[5] ? row[5] : 0,
                  totalPurchasePrice: row[6] ? row[6] : 0,
                };
                console.log("getSellInvoices:", sellObject);
                sellArray.push(sellObject);
              });
            }
            resolve({ status: true, data: sellArray });
          },
          (err) => {
            console.log("getSellInvoices err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  sellUpdateStock(sellDetails: SellDetails) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL(
          "UPDATE product SET quantity = CASE WHEN quantity-? > 0 THEN (quantity-?) ELSE 0 END WHERE id = ?",
          [sellDetails.quantity, sellDetails.quantity, sellDetails.productId]
        ).then(
          (id) => {
            console.log("sellUpdateStock id:", id);
            resolve({ status: true });
          },
          (err) => {
            console.log("sellUpdateStock err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

}
