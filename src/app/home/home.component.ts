import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Application, Dialogs } from "@nativescript/core";

import { TablesService } from "../shared/tables.service";
import { Product } from "../product.model";
import { ProductService } from "../shared/product.service";

@Component({
  selector: "Home",
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {
  items: Array<Product> = [
    {
      id: 0,
      categoryId: 0,
      name: "",
      quantity: 0,
      unit: "",
      averagePrice: 0,
      salePrice: 0,
      notes: "",
    },
  ];
  units: Array<string> = ["كيلو", "طن"];

  constructor(
    private tablesService: TablesService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    console.log("init..");
    // let product1: Product = {
    //   categoryId: 1,
    //   name: "ذرة صفراء",
    //   quantity: 300,
    //   unit: "كيلو",
    //   salePrice: 15,
    //   notes: "لا يوجد",
    // };
    // let product2: Product = {
    //   categoryId: 1,
    //   name: "ذرة عويجة",
    //   quantity: 300,
    //   unit: "كيلو",
    //   salePrice: 16,
    //   notes: "لا يوجد",
    // };
    // let product3: Product = {
    //   categoryId: 2,
    //   name: "أرز رفيع",
    //   quantity: 600,
    //   unit: "كيلو",
    //   salePrice: 18,
    //   notes: "لا يوجد",
    // };
    // let product4: Product = {
    //   categoryId: 2,
    //   name: "أرز عريض",
    //   quantity: 600,
    //   unit: "كيلو",
    //   salePrice: 20,
    //   notes: "لا يوجد",
    // };
    // let product5: Product = {
    //   categoryId: 3,
    //   name: "غلة",
    //   quantity: 200,
    //   unit: "كيلو",
    //   salePrice: 10,
    //   notes: "",
    // };
    // let product6: Product = {
    //   categoryId: 4,
    //   name: "خلطة حمام",
    //   quantity: 100,
    //   unit: "كيلو",
    //   salePrice: 14,
    //   notes: "خلطة مخصوص خلطة مخصوص خلطة مخصوص خلطة مخصوص خلطة مخصوص ",
    // };

    // this.tablesService.createDBTables();
    // this.productService.saveProduct(product1);
    // this.productService.saveProduct(product2);
    // this.productService.saveProduct(product3);
    // this.productService.saveProduct(product4);
    // this.productService.saveProduct(product5);
    // this.productService.saveProduct(product6);
    this.getAllProducts();
    console.log("end..");
  }

  delete(id) {
    console.log("del id:", id);
    if (id && id > 0) {
      Dialogs.confirm({
        title: "حذف",
        message: "هل تريد فعلا حذف هذا المنتج؟",
        okButtonText: "موافق",
        cancelButtonText: "إلغاء",
      }).then(() => {
        console.log("Dialog closed!");
        this.productService.deleteProduct(id).then(
          (result: any) => {
            console.log("deleteProduct:::", result);
            this.getAllProducts();
          },
          (err) => {
            console.log("deleteProduct err:::", err);
          }
        );
      });
    }
  }

  getAllProducts() {
    this.productService.getProducts().then(
      (result: any) => {
        if (result.status) {
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
