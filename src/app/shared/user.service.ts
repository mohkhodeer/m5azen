import { Injectable } from "@angular/core";
import Sqlite from "nativescript-sqlite";
import { User } from "../user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
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

  // user crud operations
  saveUser(user: User) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL(
          "INSERT INTO user (name, address, mobile, is_supplier) VALUES (?,?,?,?)",
          [
            user.name,
            user.address,
            user.mobile,
            user.isSupplier
          ]
        ).then(
          (id) => {
            console.log("saveUser id:", id);
            resolve({ status: true });
          },
          (err) => {
            console.log("saveUser err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  updateUser(user: User) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL(
          "UPDATE user SET name = ?, address = ?, mobile = ?, is_supplier = ? WHERE id = ?",
          [
            user.name,
            user.address,
            user.mobile,
            user.isSupplier,
            user.id,
          ]
        ).then(
          (id) => {
            console.log("updateUser id:", id);
            resolve({ status: true });
          },
          (err) => {
            console.log("updateUser err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  deleteUser(id: number) {
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL("DELETE FROM user WHERE id = ?", [id]).then(
          (id) => {
            console.log("deleteUser id:", id);
            resolve({ status: true });
          },
          (err) => {
            console.log("deleteUser err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  getUser(id: number) {
    let userObject: User;
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.get("SELECT * FROM user WHERE id = ?", [id]).then(
          (data) => {
            if (data && data.length > 0) {
              userObject = {
                id: data[0],
                name: data[1] ? data[1] : "",
                address: data[2] ? data[2] : "",
                mobile: data[3] ? data[3] : "",
                isSupplier: data[4] ? data[4] : ""
              };
            }
            console.log("getUser:", userObject);
            resolve({ status: true, data: userObject });
          },
          (err) => {
            console.log("getUser err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  getUsers(is_supplier = null) {
    let usersArray: Array<User> = [];
    let where = (is_supplier === 1) ? " WHERE is_supplier = 1" : (is_supplier === 0) ? " WHERE is_supplier != 1" : ""
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.all("SELECT * FROM user" + where).then(
          (data) => {
            if (data && data.length > 0) {
              usersArray = this.prepareUsers(data);
            }
            console.log("getUsers:", usersArray);
            resolve({ status: true, data: usersArray });
          },
          (err) => {
            console.log("getUsers err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  prepareUsers(users: Array<any>) {
    let usersArray: Array<User> = [];
    if (users && users.length > 0) {
      users.forEach((el, i) => {
        let userObject: User = {
          id: el[0],
          name: el[1],
          address: el[2] ? el[2] : "",
          mobile: el[3] ? el[3] : "",
          isSupplier: el[4] ? el[4] : ""
        };
        usersArray.push(userObject);
      });
    }

    return usersArray;
  }
}
