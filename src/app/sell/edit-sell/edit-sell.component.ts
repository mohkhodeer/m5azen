import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
} from "@angular/forms";
import { ItemEventData } from "@nativescript/core";

import { TablesService } from "../../shared/tables.service";
import { UserService } from "../../shared/user.service";
import { ProductService } from "../../shared/product.service";
import { SellService } from "../../shared/sell.service";
import { SandoqService } from "../../shared/sandoq.service";
import { Sell, SellDetails } from "../../sell.model";

@Component({
  selector: "editSell",
  templateUrl: "./edit-sell.component.html",
})
export class EditSellComponent implements OnInit {
  sellDetails: Sell = {
    id: 0,
    date: 0,
    customerId: 0,
    notes: "",
    totalPaidPrice: 0,
    totalPrice: 0,
    totalPurchasePrice: 0,
    details: [
      {
        id: 0,
        paidPrice: 0,
        price: 0,
        productId: 0,
        sellInvoiceId: 0,
        quantity: 0,
        purchasePrice: 0
      },
    ],
  };
  public sellForm: FormGroup;
  customers: Array<any>;
  products: Array<any>;
  selectedProductFormArrayIndex: number = 0;
  showCustomerList: boolean = false;
  showProductList: boolean = false;
  showModal: boolean = false;
  selectedCustomer: string = "اختر العميل...";
  selectedProduct: Array<string> = ["اختر المنتج..."];
  totalPaidPrice: Array<number> = [];

  constructor(
    private fb: FormBuilder,
    private tablesService: TablesService,
    private activatedRoute: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private userService: UserService,
    private sellService: SellService,
    private productService: ProductService,
    private sandoqService: SandoqService
  ) {
    this.sellForm = this.fb.group({
      id: [0],
      customerId: ["", [Validators.required]],
      notes: [""],
      productFormGroup: this.fb.array([
        this.fb.group({
          id: [0],
          productId: ["", [Validators.required]],
          quantity: ["", [Validators.required]],
          price: ["", [Validators.required]],
          paidPrice: ["", [Validators.required]],
          purchasePrice: [0],
          sellInvoiceId: [0],
        }),
      ]),
    });
  }

  ngOnInit() {
    const id = +this.activatedRoute.snapshot.params.id;
    console.log("id>>>", id);
    this.resetFormControls(this.sellForm);
    this.getAllCustomers();
    this.getAllProducts();
    if (id && id > 0) {
      this.getSellDetails(id);
      console.log("getSellDetails>>>>>", this.sellDetails);
      console.log("end..");
    }
  }

  showProductListFn(index) {
    this.showModal = true;
    this.showProductList = true;
    this.showCustomerList = false;
    this.selectedProductFormArrayIndex = index;
  }

  showCustomerListFn() {
    this.showModal = true;
    this.showCustomerList = true;
    this.showProductList = false;
  }

  showSellFormFn() {
    this.showModal = false;
    this.showCustomerList = false;
    this.showProductList = false;
  }

  onCustomerSelect(args: ItemEventData) {
    console.log("onCustomerSelect::");
    console.log(
      `Index: ${args.index}; View: ${args.view} ; Item: ${
        this.customers[args.index].id
      }, ${this.customers[args.index].name}`
    );
    this.selectedCustomer = this.customers[args.index].name;
    this.sellForm.get("customerId").setValue(this.customers[args.index].id);
    this.showSellFormFn();
  }

  onProductSelect(args: ItemEventData) {
    console.log("onProductSelect::", this.products[args.index]);
    this.selectedProduct[this.selectedProductFormArrayIndex] =
      this.products[args.index].name;
    this.productFormGroup
      .at(this.selectedProductFormArrayIndex)
      .get("productId")
      .setValue(this.products[args.index].id);
    this.productFormGroup
      .at(this.selectedProductFormArrayIndex)
      .get("price")
      .setValue(this.products[args.index].salePrice);
      this.productFormGroup
      .at(this.selectedProductFormArrayIndex)
      .get("purchasePrice")
      .setValue(this.products[args.index].purchasePrice);
    this.showSellFormFn();
  }

  getAllCustomers() {
    this.userService.getUsers(0).then((result: any) => {
      if (result.status && result.data && result.data.length > 0) {
        let customers = [];
        result.data.forEach((el) => {
          customers.push({
            id: el.id,
            name: el.name,
          });
        });
        this.customers = customers;
      }
      console.log("this.customers:", this.customers);
    });
  }

  getAllProducts() {
    this.productService.getProducts().then((result: any) => {
      if (result.status && result.data && result.data.length > 0) {
        let products = [];
        result.data.forEach((el) => {
          products.push({
            id: el.id,
            name: el.name,
            salePrice: Math.round(el.salePrice * 100) / 100,
            purchasePrice: Math.round(el.averagePrice * 100) / 100,
          });
        });
        this.products = products;
        console.log("products:", products);
        console.log("this.products:", this.products);
      }
    });
  }

  getSellDetails(id: number) {
    this.sellService.getSellInvoiceWithDetails(id).then(
      (result: any) => {
        console.log("result:", result);
        if (result.status) {
          this.sellDetails = result.data;
          this.sellForm.get("id").setValue(this.sellDetails.id);
          this.sellForm.get("customerId").setValue(this.sellDetails.customerId);
          let customerObj = this.getCustomerNameById(
            this.sellDetails.customerId
          );
          if (customerObj) {
            this.selectedCustomer = customerObj.name;
          }
          this.sellForm.get("notes").setValue(this.sellDetails.notes);

          // sell Details
          let i = 0;
          for (let el of result.data.details) {
            if (i > 0) {
              this.addProductToForm();
            }
            this.productFormGroup.at(i).get("id").setValue(el.id);
            this.productFormGroup
              .at(i)
              .get("sellInvoiceId")
              .setValue(el.sellInvoiceId);
            this.productFormGroup.at(i).get("productId").setValue(el.productId);
            this.productFormGroup.at(i).get("quantity").setValue(el.quantity);
            this.productFormGroup.at(i).get("price").setValue(el.price);
            this.productFormGroup.at(i).get("paidPrice").setValue(el.paidPrice);
            this.productFormGroup.at(i).get("purchasePrice").setValue(el.purchasePrice);
            let productObj = this.getProductNameById(el.productId);
            if (productObj) {
              this.selectedProduct[i] = productObj.name;
            }
            i++;
          }
        }
      },
      (err) => {
        console.log("err:", err);
      }
    );
    console.log("end..");
  }

  getCustomerNameById(id) {
    return this.customers.find((el) => el.id == id);
  }

  getProductNameById(id) {
    return this.products.find((el) => el.id == id);
  }

  save() {
    console.log("sellForm:");
    console.log(this.sellForm.value);
    let sellDetails: SellDetails;
    let sell: Sell = {
      id: this.sellForm.value.id,
      customerId: this.sellForm.value.customerId,
      date: (Date.now() / 1000) | 0,
      notes: this.sellForm.value.notes,
      totalPaidPrice: 0,
      totalPrice: 0,
      totalPurchasePrice: 0,
      details: [sellDetails],
    };

    if (
      this.sellForm.value.productFormGroup &&
      this.sellForm.value.productFormGroup.length > 0
    ) {
      for (let el of this.sellForm.value.productFormGroup) {
        sellDetails = {
          id: el.id,
          productId: el.productId,
          quantity: el.quantity,
          price: el.price,
          paidPrice: el.paidPrice,
          sellInvoiceId: el.sellInvoiceId,
          purchasePrice: el.purchasePrice,
        };
        sell.totalPaidPrice += Number(el.paidPrice);
        sell.totalPrice += Number(el.price) * Number(el.quantity);
        sell.totalPurchasePrice += Number(el.purchasePrice) * Number(el.quantity);
        sell.details.push(sellDetails);
      }
    }
    if (
      sell.details.length > 0 &&
      (sell.details[0] === null || sell.details[0] === undefined)
    ) {
      sell.details.splice(0, 1);
    }
    console.log(":::sell:::", sell);

    if (this.sellForm.valid) {
      if (sell.id && sell.id > 0) {
        // update current sell invoice
        this.sellService.updateSellInvoice(sell).then((res: any) => {
          if (res.id && res.id > 0) {
            for (let el of sell.details) {
              el.sellInvoiceId = res.id;
              this.sellService.updateSellInvoiceDetails(el).then((res) => {
                this.applySellInvoiceOnStock(el);
              });
            }
            this.sandoqService.UpdateOnSandoq(sell.totalPaidPrice);
            this.routerExtensions.navigate(["/sell"]);
            console.log("updateProduct success", res);
          }
          console.log("updateProduct success", res);
        });
      } else {
        // save new sell invoice
        console.log('sell>>>>>>>', sell);
        
        this.sellService.saveSellInvoice(sell).then((res: any) => {
          if (res.id && res.id > 0) {
            for (let el of sell.details) {
              el.sellInvoiceId = res.id;
              this.sellService.saveSellInvoiceDetails(el).then((res) => {
                this.applySellInvoiceOnStock(el);
              });
            }
            this.applyPurchaseInvoiceOnSandoq(sell.totalPaidPrice);
            this.routerExtensions.navigate(["/sell"]);
            console.log("saveProduct success", res);
          }
        });
      }
    }
  }

  applyPurchaseInvoiceOnSandoq(money: number) {
    this.sandoqService.UpdateOnSandoq(money).then((res) => {
      console.log("applyPurchaseInvoiceOnSandoq:", res);
    });
  }

  applySellInvoiceOnStock(sellDetails: SellDetails) {
    if (sellDetails) {
      this.sellService.sellUpdateStock(sellDetails).then((res) => {
        console.log("sellUpdateStock:", res);
      });
    }
  }

  get productFormGroup() {
    return this.sellForm.get("productFormGroup") as FormArray;
  }

  addProductToForm() {
    this.selectedProduct.push("اختر المنتج...");
    this.productFormGroup.push(
      this.fb.group({
        id: [0],
        productId: ["", [Validators.required]],
        quantity: ["", [Validators.required]],
        price: ["", [Validators.required]],
        paidPrice: ["", [Validators.required]],
        purchasePrice: [0],
        sellInvoiceId: [0],
      })
    );
  }

  removeProductFromForm(index) {
    console.log("removeProductFromForm:", index);

    this.selectedProduct.pop();
    if (this.productFormGroup.length > 1) {
      this.productFormGroup.removeAt(index);
    }
  }

  resetFormControls(form) {
    form.get("id").reset();
    form.get("customerId").reset();
    form.get("notes").reset();
    form.get("productFormGroup").reset();
  }

  calcPrice(index) {
    this.totalPaidPrice[index] =
      this.productFormGroup.at(index).get("quantity").value *
      this.productFormGroup.at(index).get("price").value;
    this.totalPaidPrice[index] = Math.round(this.totalPaidPrice[index] * 100) / 100
    this.productFormGroup
      .at(index)
      .get("paidPrice")
      .setValue(this.totalPaidPrice[index]);
  }

  cancel() {
    this.routerExtensions.back();
  }

  onBackTap(): void {
    this.routerExtensions.back();
  }

  ngOnDestroy() {
    this.tablesService.closeDBConnection();
  }
}
