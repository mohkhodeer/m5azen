import { Injectable } from "@angular/core";
import Sqlite from "nativescript-sqlite";
import { Product } from "../product.model";

@Injectable({
  providedIn: "root",
})
export class ProductService {
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

  // product crud operations
  saveProduct(product: Product) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL(
          "INSERT INTO product (category_id, name, quantity, unit, sale_price, average_price, notes) VALUES (?,?,?,?,?,?,?)",
          [
            product.categoryId,
            product.name,
            product.quantity,
            product.unit,
            product.salePrice,
            product.salePrice,
            product.notes,
          ]
        ).then(
          (id) => {
            console.log("saveProduct id:", id);
            resolve({ status: true });
          },
          (err) => {
            console.log("saveProduct err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  updateProduct(product: Product) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL(
          "UPDATE product SET category_id = ?, name = ?, quantity = ?, unit = ?, sale_price = ?, average_price = ?, notes = ? WHERE id = ?",
          [
            product.categoryId,
            product.name,
            product.quantity,
            product.unit,
            product.salePrice,
            product.salePrice,
            product.notes,
            product.id,
          ]
        ).then(
          (id) => {
            console.log('updateProduct>>>>>', product);

            console.log("updateProduct id:", id);
            resolve({ status: true });
          },
          (err) => {
            console.log("updateProduct err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  deleteProduct(id: number) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL("DELETE product WHERE id = ?", [id]).then(
          (id) => {
            console.log("deleteProduct id:", id);
            resolve({ status: true });
          },
          (err) => {
            console.log("deleteProduct err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  getProduct(id: number) {
    let productObject: Product;
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.get("SELECT * FROM product WHERE id = ?", [id]).then(
          (data) => {
            if (data && data.length > 0) {
              productObject = {
                id: data[0],
                categoryId: data[1],
                name: data[2] ? data[2] : "",
                quantity: data[3] ? data[3] : "",
                unit: data[4] ? data[4] : "",
                averagePrice: data[5] ? data[5] : "",
                salePrice: data[6] ? data[6] : "",
                notes: data[7] ? data[7] : "",
              };
            }
            resolve({ status: true, data: productObject });
          },
          (err) => {
            console.log("getProduct err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  getProducts() {
    let productsArray: Array<Product> = [];
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.all("SELECT * FROM product").then(
          (data) => {
            if (data && data.length > 0) {
              productsArray = this.prepareProducts(data);
            }
            console.log("getProducts:", productsArray);
            resolve({ status: true, data: productsArray });
          },
          (err) => {
            console.log("getProducts err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  getProductAveragePrice(categoryId) {
    // if (categoryId && categoryId > 0) {
    //   this.connectDB().then((db) => {
    //     db.all(
    //       "SELECT quantity, sale_price FROM product WHERE category_id = ?",
    //       [categoryId]
    //     ).then(
    //       (data) => {
    //         if (data && data.length > 0) {
    //           let averagePrice = 0;
    //           console.log("getProductAveragePrice:", data);
    //           let totalQuantity: number = 0;
    //           let totalPrice: number = 0;
    //           data.forEach((el, i) => {
    //             totalQuantity += el[0];
    //             totalPrice += el[0] * el[1];
    //           });
    //           averagePrice = totalPrice / totalQuantity;
    //           averagePrice =
    //             Math.round(averagePrice * 100 + Number.EPSILON) / 100;

    //           return averagePrice;
    //         }
    //       },
    //       (err) => {
    //         console.log("getProductAveragePrice err:", err);
    //       }
    //     );
    //   });
    // }
  }

  prepareProducts(products: Array<any>) {
    let productsArray: Array<Product> = [];
    if (products && products.length > 0) {
      products.forEach((el, i) => {
        let productObject: Product = {
          id: el[0],
          categoryId: el[1],
          name: el[2] ? el[2] : "",
          quantity: el[3] ? el[3] : "",
          unit: el[4] ? el[4] : "",
          averagePrice: el[5] ? el[5] : "",
          salePrice: el[6] ? el[6] : "",
          notes: el[7] ? el[7] : "",
        };
        productsArray.push(productObject);
      });
    }

    return productsArray;
  }
}
