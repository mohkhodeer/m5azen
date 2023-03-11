import { Injectable } from "@angular/core";
import Sqlite from "nativescript-sqlite";

@Injectable({
  providedIn: "root",
})
export class SandoqService {
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

  UpdateOnSandoq(money: number) {
    let date = (Date.now() / 1000) | 0;
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.get("SELECT * FROM sandoq").then(
          (data) => {
            console.log("sandoq>>>", data);

            if (data && data.length > 0) {
              db.execSQL("UPDATE sandoq SET money = money+?, date =?", [
                money,
                date,
              ]).then(
                (id) => {
                  console.log("UpdateSandoq id:", id);
                  resolve({ status: true });
                },
                (err) => {
                  console.log("UpdateSandoq err:", err);
                  reject({ status: false });
                }
              );
            } else {
              db.execSQL("INSERT INTO sandoq (money, date) VALUES (?,?)", [
                money,
                date,
              ]).then(
                (id) => {
                  console.log("insertSandoq id:", id);
                  resolve({ status: true });
                },
                (err) => {
                  console.log("insertSandoq err:", err);
                  reject({ status: false });
                }
              );
            }
          },
          (err) => {
            console.log("sandoq err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  saveSandoq(money: number) {
    let date = (Date.now() / 1000) | 0;
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.execSQL("DELETE FROM sandoq").then(
          (data) => {
            console.log("saveSandoq>>>", data);
            db.execSQL("INSERT INTO sandoq (money, date) VALUES (?,?)", [
              money,
              date,
            ]).then(
              (id) => {
                console.log("insertSandoq id:", id);
                resolve({ status: true });
              },
              (err) => {
                console.log("insertSandoq err:", err);
                reject({ status: false });
              }
            );
          },
          (err) => {
            console.log("sandoq err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }

  getSandoq() {
    let sandoqObject: object = {};
    return new Promise<Object>((resolve, reject) => {
      this.connectDB().then((db) => {
        db.get("SELECT * FROM sandoq").then(
          (data) => {
            console.log("get sandoq>>>", data);

            if (data && data.length > 0) {
              sandoqObject = data;
            }
            resolve({ status: true, data: sandoqObject });
          },
          (err) => {
            console.log("get sandoq err:", err);
            reject({ status: false });
          }
        );
      });
    });
  }
}
