import { Injectable } from "@angular/core";
import Sqlite from "nativescript-sqlite";
import { Purchase, PurchaseDetails } from "../purchase.model";

@Injectable({
  providedIn: "root",
})
export class PurchaseService {
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

  // PurchaseInvoice crud operations
  savePurchaseInvoice(purchase: Purchase) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL(
          "INSERT INTO purchase_invoice (supplier_id, date, notes, total_price, total_paid_price) VALUES (?,?,?,?,?)",
          [
            purchase.supplierId,
            purchase.date,
            purchase.notes,
            purchase.totalPrice,
            purchase.totalPaidPrice,
          ]
        ).then(
          (id) => {
            console.log("savePurchaseInvoice id:", id);
            resolve({ status: true, id: id });
          },
          (err) => {
            console.log("savePurchaseInvoice err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  savePurchaseInvoiceDetails(purchaseDetails: PurchaseDetails) {
    console.log("<<purchaseDetails>>", purchaseDetails);

    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL(
          "INSERT INTO purchase_invoice_details (purchase_invoice_id, product_id, quantity, price, paid_price) VALUES (?,?,?,?,?)",
          [
            purchaseDetails.purchaseInvoiceId,
            purchaseDetails.productId,
            purchaseDetails.quantity,
            purchaseDetails.price,
            purchaseDetails.paidPrice,
          ]
        ).then(
          (id) => {
            console.log("savePurchaseInvoiceDetails id:", id);
            resolve({ status: true });
          },
          (err) => {
            console.log("savePurchaseInvoiceDetails err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  updatePurchaseInvoice(purchase: Purchase) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL(
          "UPDATE purchase_invoice SET supplier_id = ?, date = ?, notes = ?, total_price =?, total_paid_price=? WHERE id = ?",
          [
            purchase.supplierId,
            purchase.date,
            purchase.notes,
            purchase.totalPrice,
            purchase.totalPaidPrice,
            purchase.id,
          ]
        ).then(
          (id) => {
            console.log("updatePurchaseInvoice id:", id);
            resolve({ status: true, id: id });
          },
          (err) => {
            console.log("updatePurchaseInvoice err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  updatePurchaseInvoiceDetails(purchaseDetails: PurchaseDetails) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL(
          "UPDATE purchase_invoice_details SET purchase_invoice_id = ?, product_id = ?, quantity = ?, price = ?, paid_price = ? WHERE id = ?",
          [
            purchaseDetails.purchaseInvoiceId,
            purchaseDetails.productId,
            purchaseDetails.quantity,
            purchaseDetails.price,
            purchaseDetails.paidPrice,
          ]
        ).then(
          (id) => {
            console.log("updatePurchaseInvoiceDetails id:", id);
            resolve({ status: true });
          },
          (err) => {
            console.log("updatePurchaseInvoiceDetails err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  deletePurchaseInvoice(id: number) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL("DELETE FROM purchase_invoice WHERE id = ?", [id]).then(
          (id) => {
            console.log("deletePurchaseInvoice id:", id);
            this.deleteAllPurchaseInvoiceDetails(id);
            resolve({ status: true });
          },
          (err) => {
            console.log("deletePurchaseInvoice err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  deletePurchaseInvoiceDetails(id: number) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL("DELETE FROM purchase_invoice_details WHERE id = ?", [
          id,
        ]).then(
          (id) => {
            console.log("deletePurchaseInvoiceDetails id:", id);
            resolve({ status: true });
          },
          (err) => {
            console.log("deletePurchaseInvoiceDetails err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  deleteAllPurchaseInvoiceDetails(id: number) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL(
          "DELETE FROM purchase_invoice_details WHERE purchase_invoice_id = ?",
          [id]
        ).then(
          (id) => {
            console.log("deleteAllPurchaseInvoiceDetails id:", id);
            resolve({ status: true });
          },
          (err) => {
            console.log("deleteAllPurchaseInvoiceDetails err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  getPurchaseInvoiceWithDetails(id: number) {
    let purchaseObject: Purchase;
    let purchaseDetailsObject: PurchaseDetails;
    let purchaseDetailsObjectArray: Array<PurchaseDetails> = [];
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.all(
          "SELECT pi.*,pid.* from purchase_invoice as pi LEFT JOIN purchase_invoice_details as pid ON pi.id = pid.purchase_invoice_id WHERE pi.id = ?",
          [id]
        ).then(
          (data) => {
            console.log("getPurchaseInvoiceWithDetails:", data);
            if (data && data.length > 0) {
              // PurchaseInvoice master object
              purchaseObject = {
                id: data[0][0],
                supplierId: data[0][1],
                date: data[0][2],
                notes: data[0][3] ? data[0][3] : "",
                totalPrice: data[0][4] ? data[0][4] : 0,
                totalPaidPrice: data[0][5] ? data[0][5] : 0,
                details: null,
              };
              data.forEach((row, index) => {
                // purchaseDetailsObject details object
                console.log("row****", row);

                purchaseDetailsObject = {
                  id: row[6],
                  purchaseInvoiceId: row[7],
                  productId: row[8],
                  quantity: row[9],
                  price: row[10],
                  paidPrice: row[11],
                };
                purchaseDetailsObjectArray.push(purchaseDetailsObject);
              });
              purchaseObject.details = purchaseDetailsObjectArray;
              console.log("getPurchaseInvoiceWithDetails::", purchaseObject);
              resolve({ status: true, data: purchaseObject });
            }
          },
          (err) => {
            console.log("getPurchaseInvoiceWithDetails err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  getPurchaseInvoicesWithDetails() {
    let purchaseObject: Purchase;
    let purchaseDetailsObject: PurchaseDetails;
    let purchaseArray: Array<Purchase> = [];
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.all(
          "SELECT * from purchase_invoice as pi LEFT JOIN purchase_invoice_details as pid ON pi.id = pid.purchase_invoice_id"
        ).then(
          (data) => {
            if (data && data.length > 0) {
              data.forEach((row, index) => {
                // PurchaseInvoice master object
                purchaseObject = {
                  id: row[0][0],
                  supplierId: row[0][1],
                  date: row[0][2],
                  notes: row[0][3] ? row[0][3] : "",
                  totalPrice: data[0][4] ? data[0][4] : 0,
                  totalPaidPrice: data[0][5] ? data[0][5] : 0,
                };
                // purchaseDetailsObject details object
                purchaseDetailsObject = {
                  purchaseInvoiceId: row[7],
                  productId: row[8],
                  quantity: row[9],
                  price: row[10],
                  paidPrice: row[11],
                };
                purchaseObject.details?.push(purchaseDetailsObject);
              });
              console.log("getPurchaseInvoicesWithDetails:", purchaseObject);
              purchaseArray.push(purchaseObject);
              resolve({ status: true, data: purchaseArray });
            }
          },
          (err) => {
            console.log("getPurchaseInvoicesWithDetails err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  getPurchaseInvoices() {
    let purchaseObject: {};
    let purchaseArray: Array<{}> = [];
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.all(
          "SELECT pi.*, u.name from purchase_invoice as pi LEFT JOIN user as u ON pi.supplier_id = u.id ORDER BY pi.id DESC"
        ).then(
          (data) => {
            console.log("getPurchaseInvoices>>>", data);

            if (data && data.length > 0) {
              data.forEach((row, index) => {
                // PurchaseInvoice master object
                let dateFormat = new Date(row[2] * 1000);
                purchaseObject = {
                  id: row[0],
                  supplier: row[6],
                  date:
                    dateFormat.getDate() +
                    "/" +
                    (dateFormat.getMonth() + 1) +
                    "/" +
                    dateFormat.getFullYear(),
                  notes: row[3] ? row[3] : "",
                  totalPrice: row[4] ? row[4] : "",
                  totalPaidPrice: row[5] ? row[5] : "",
                };
                console.log("getPurchaseInvoices:", purchaseObject);
                purchaseArray.push(purchaseObject);
              });
            }
            resolve({ status: true, data: purchaseArray });
          },
          (err) => {
            console.log("getPurchaseInvoices err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  purchaseUpdateStock(purchaseDetails: PurchaseDetails) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL(
          "UPDATE product SET quantity = quantity+?, average_price = ?, sale_price = (sale_price*quantity + ?*?)/(quantity+?) WHERE id = ?",
          [
            purchaseDetails.quantity,
            purchaseDetails.price,
            purchaseDetails.price,
            purchaseDetails.quantity,
            purchaseDetails.quantity,
            purchaseDetails.productId,
          ]
        ).then(
          (id) => {
            console.log("purchaseUpdateStock id:", id);
            resolve({ status: true });
          },
          (err) => {
            console.log("purchaseUpdateStock err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }
}
