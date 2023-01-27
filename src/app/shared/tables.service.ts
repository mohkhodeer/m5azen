import { Injectable } from "@angular/core";
import Sqlite from "nativescript-sqlite";

@Injectable({
  providedIn: "root",
})
export class TablesService {
  public con: any;

  connectDB(): Promise<any> {
    if (!Sqlite.exists("m5azen.db")) {
      Sqlite.copyDatabase("m5azen.db");
      console.log('DB copied now..');
    }else{
      console.log('DB exists..');
    }
    return new Sqlite("m5azen.db");
  }

  createDBTables() {
    this.connectDB().then((db) => {
      // user table
      db.execSQL(
        "CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, address TEXT, mobile TEXT, is_supplier INTEGER)"
      ).then(
        () => {
          console.log("CREATE TABLE user...");
        },
        (error) => {
          console.log("CREATE TABLE user ERROR", error);
        }
      );

      // cayegory table
      db.execSQL(
        "CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)"
      ).then(
        () => {
          console.log("CREATE TABLE category...");
        },
        (error) => {
          console.log("CREATE TABLE category ERROR", error);
        }
      );

      // product table
      db.execSQL(
        "CREATE TABLE IF NOT EXISTS product (id INTEGER PRIMARY KEY AUTOINCREMENT, category_id INTEGER, name TEXT, quantity INTEGER, unit TEXT, average_price REAL, sale_price REAL, notes TEXT)"
      ).then(
        () => {
          console.log("CREATE TABLE product...");
        },
        (error) => {
          console.log("CREATE TABLE product ERROR", error);
        }
      );

      // sale_invoice table
      db.execSQL(
        "CREATE TABLE IF NOT EXISTS sale_invoice (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INTEGER, date INTEGER, notes TEXT)"
      ).then(
        () => {
          console.log("CREATE TABLE sale_invoice...");
        },
        (error) => {
          console.log("CREATE TABLE sale_invoice ERROR", error);
        }
      );

      // sale_invoice_details table
      db.execSQL(
        "CREATE TABLE IF NOT EXISTS sale_invoice_details (id INTEGER PRIMARY KEY AUTOINCREMENT, sale_invoice_id INTEGER, product_id INTEGER, quantity INTEGER, price REAL, paid_price REAL)"
      ).then(
        () => {
          console.log("CREATE TABLE sale_invoice_details...");
        },
        (error) => {
          console.log("CREATE TABLE sale_invoice_details ERROR", error);
        }
      );

      // purchase_invoice table
      db.execSQL(
        "CREATE TABLE IF NOT EXISTS purchase_invoice (id INTEGER PRIMARY KEY AUTOINCREMENT, supplier_id INTEGER, date INTEGER, notes TEXT)"
      ).then(
        () => {
          console.log("CREATE TABLE purchase_invoice...");
        },
        (error) => {
          console.log("CREATE TABLE purchase_invoice ERROR", error);
        }
      );

      // purchase_invoice_details table
      db.execSQL(
        "CREATE TABLE IF NOT EXISTS purchase_invoice_details (id INTEGER PRIMARY KEY AUTOINCREMENT, purchase_invoice_id INTEGER, product_id INTEGER, quantity INTEGER, price REAL, paid_price REAL)"
      ).then(
        () => {
          console.log("CREATE TABLE purchase_invoice_details...");
        },
        (error) => {
          console.log("CREATE TABLE purchase_invoice_details ERROR", error);
        }
      );

      // expenses table
      db.execSQL(
        "CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, cost REAL, date INTEGER, notes TEXT)"
      ).then(
        () => {
          console.log("CREATE TABLE expenses...");
        },
        (error) => {
          console.log("CREATE TABLE expenses ERROR", error);
        }
      );

      // sandoq table
      db.execSQL(
        "CREATE TABLE IF NOT EXISTS sandoq (id INTEGER PRIMARY KEY AUTOINCREMENT, money REAL, date INTEGER, notes TEXT)"
      ).then(
        () => {
          console.log("CREATE TABLE box...");
        },
        (error) => {
          console.log("CREATE TABLE box ERROR", error);
        }
      );
    });
  }

  closeDBConnection() {
    new Sqlite("m5zn").then((db) => {
      db.close();
    });
  }
}
