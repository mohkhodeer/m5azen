import { Injectable } from "@angular/core";
import Sqlite from "nativescript-sqlite";
import { Product } from "../product.model";
import { Category } from "../category.model";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  public con: any;

  connectDB(): Promise<any> {
    if (!Sqlite.exists("m5azen.db")) {
      Sqlite.copyDatabase("m5azen.db");
      console.log('DB copied now.');
    }else{
      console.log('DB exists..');
    }
    return new Sqlite("m5azen.db");
  }


  // category crud operations
  saveCategory(category: Category) {
    console.log('saveCategory::', category);
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL("INSERT INTO category (name) VALUES (?)", [
          category.name,
        ]).then(
          (id) => {
            console.log("saveCategory id:", id);
            resolve({ status: true });
          },
          (err) => {
            console.log("saveCategory err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  updateCategory(category: Category) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL("UPDATE category SET name = ? WHERE id = ?", [
          category.name,
          category.id,
        ]).then(
          (id) => {
            console.log("updateCategory id:", id);
            resolve({ status: true });
          },
          (err) => {
            console.log("updateCategory err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  deleteCategory(id: number) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL("DELETE FROM category WHERE id = ?", [id]).then(
          (id) => {
            console.log("deleteCategory id:", id);
            resolve({ status: true });
          },
          (err) => {
            console.log("deleteCategory err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  getCategory(id: number) {
    let categoryObject: Category;
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.get("SELECT * FROM category WHERE id = ?", [id]).then(
          (data) => {
            if (data && data.length > 0) {
              categoryObject = {
                id: data[0],
                name: data[1] ? data[1] : "",
              };
            }
            console.log("getCategory:", categoryObject);
            resolve({ status: true, data: categoryObject });
          },
          (err) => {
            console.log("getCategory err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  getCategories() {
    let categoriesArray: Array<Category> = [];
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.all("SELECT * FROM category").then(
          (data) => {
            if (data && data.length > 0) {
              categoriesArray = this.prepareCategories(data);
            }
            resolve({ status: true, data: categoriesArray });
          },
          (err) => {
            console.log("getCategories err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  prepareCategories(categories: Array<any>) {
    let categoriesArray: Array<Category> = [];
    if (categories && categories.length > 0) {
      categories.forEach((el, i) => {
        let categoryObject: Category = {
          id: el[0],
          name: el[1] ? el[1] : "",
        };
        categoriesArray.push(categoryObject);
      });
    }

    return categoriesArray;
  }
}
