import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
} from "@angular/forms";
import { ItemEventData } from "@nativescript/core";

import { TablesService } from "../../shared/tables.service";
import { UserService } from "../../shared/user.service";
import { ProductService } from "../../shared/product.service";
import { PurchaseService } from "../../shared/purchase.service";
import { SandoqService } from "../../shared/sandoq.service";
import { Purchase, PurchaseDetails } from "../../purchase.model";

@Component({
  selector: "editPurchase",
  templateUrl: "./edit-purchase.component.html",
})
export class EditPurchaseComponent implements OnInit {
  purchaseDetails: Purchase = {
    id: 0,
    date: 0,
    supplierId: 0,
    notes: "",
    totalPaidPrice: 0,
    totalPrice: 0,
    details: [
      {
        id: 0,
        paidPrice: 0,
        price: 0,
        productId: 0,
        purchaseInvoiceId: 0,
        quantity: 0,
      },
    ],
  };
  public purchaseForm: FormGroup;
  suppliers: Array<any>;
  products: Array<any>;
  selectedProductFormArrayIndex: number = 0;
  showSupplierList: boolean = false;
  showProductList: boolean = false;
  showModal: boolean = false;
  selectedSupplier: string = "اختر المورد...";
  selectedProduct: Array<string> = ["اختر المنتج..."];
  totalPaidPrice: Array<number> = [];

  constructor(
    private fb: FormBuilder,
    private tablesService: TablesService,
    private activatedRoute: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private userService: UserService,
    private purchaseService: PurchaseService,
    private productService: ProductService,
    private sandoqService: SandoqService
  ) {
    this.purchaseForm = this.fb.group({
      id: [0],
      supplierId: ["", [Validators.required]],
      notes: [""],
      productFormGroup: this.fb.array([
        this.fb.group({
          id: [0],
          productId: ["", [Validators.required]],
          quantity: ["", [Validators.required]],
          price: ["", [Validators.required]],
          paidPrice: ["", [Validators.required]],
          purchaseInvoiceId: [0],
        }),
      ]),
    });
  }

  ngOnInit() {
    const id = +this.activatedRoute.snapshot.params.id;
    console.log("id>>>", id);
    this.resetFormControls(this.purchaseForm);
    this.getAllSuppliers();
    this.getAllProducts();
    if (id && id > 0) {
      this.getPurchaseDetails(id);
      console.log("getPurchaseDetails>>>>>", this.purchaseDetails);
      console.log("end..");
    }
  }

  showProductListFn(index) {
    this.showModal = true;
    this.showProductList = true;
    this.showSupplierList = false;
    this.selectedProductFormArrayIndex = index;
  }

  showSupplierListFn() {
    this.showModal = true;
    this.showSupplierList = true;
    this.showProductList = false;
  }

  showPurchaseFormFn() {
    this.showModal = false;
    this.showSupplierList = false;
    this.showProductList = false;
  }

  onSupplierSelect(args: ItemEventData) {
    console.log("onSupplierSelect::");
    console.log(
      `Index: ${args.index}; View: ${args.view} ; Item: ${
        this.suppliers[args.index].id
      }, ${this.suppliers[args.index].name}`
    );
    this.selectedSupplier = this.suppliers[args.index].name;
    this.purchaseForm.get("supplierId").setValue(this.suppliers[args.index].id);
    this.showPurchaseFormFn();
  }

  onProductSelect(args: ItemEventData) {
    console.log("onProductSelect::");
    this.selectedProduct[this.selectedProductFormArrayIndex] =
      this.products[args.index].name;
    this.productFormGroup
      .at(this.selectedProductFormArrayIndex)
      .get("productId")
      .setValue(this.products[args.index].id);
    this.showPurchaseFormFn();
  }

  getAllSuppliers() {
    this.userService.getUsers(1).then((result: any) => {
      if (result.status && result.data && result.data.length > 0) {
        let suppliers = [];
        result.data.forEach((el) => {
          suppliers.push({
            id: el.id,
            name: el.name,
          });
        });
        this.suppliers = suppliers;
      }
      console.log("this.suppliers:", this.suppliers);
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
          });
        });
        this.products = products;
        console.log("products:", products);
        console.log("this.products:", this.products);
      }
    });
  }

  getPurchaseDetails(id: number) {
    this.purchaseService.getPurchaseInvoiceWithDetails(id).then(
      (result: any) => {
        console.log("result:", result);
        if (result.status) {
          this.purchaseDetails = result.data;
          this.purchaseForm.get("id").setValue(this.purchaseDetails.id);
          this.purchaseForm
            .get("supplierId")
            .setValue(this.purchaseDetails.supplierId);
          let supplierObj = this.getSupplierNameById(
            this.purchaseDetails.supplierId
          );
          if (supplierObj) {
            this.selectedSupplier = supplierObj.name;
          }
          this.purchaseForm.get("notes").setValue(this.purchaseDetails.notes);

          // purchase Details
          let i = 0;
          for (let el of result.data.details) {
            console.log('el:::', el);
            
            if (i > 0) {
              this.addProductToForm();
            }
            this.productFormGroup.at(i).get("id").setValue(el.id);
            this.productFormGroup
              .at(i)
              .get("purchaseInvoiceId")
              .setValue(el.purchaseInvoiceId);
            this.productFormGroup.at(i).get("productId").setValue(el.productId);
            this.productFormGroup.at(i).get("quantity").setValue(el.quantity);
            this.productFormGroup.at(i).get("price").setValue(el.price);
            this.productFormGroup.at(i).get("paidPrice").setValue(el.paidPrice);
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

  getSupplierNameById(id) {
    return this.suppliers.find((el) => el.id == id);
  }

  getProductNameById(id) {
    return this.products.find((el) => el.id == id);
  }

  save() {
    console.log("purchaseForm:");
    console.log(this.purchaseForm.value);
    let purchaseDetails: PurchaseDetails;
    let purchase: Purchase = {
      id: this.purchaseForm.value.id,
      supplierId: this.purchaseForm.value.supplierId,
      date: (Date.now() / 1000) | 0,
      notes: this.purchaseForm.value.notes,
      totalPaidPrice: 0,
      totalPrice: 0,
      details: [purchaseDetails],
    };

    if (
      this.purchaseForm.value.productFormGroup &&
      this.purchaseForm.value.productFormGroup.length > 0
    ) {
      for (let el of this.purchaseForm.value.productFormGroup) {
        purchaseDetails = {
          id: el.id,
          productId: el.productId,
          quantity: el.quantity,
          price: Math.round(el.price * 100) / 100,
          paidPrice: Math.round(el.paidPrice * 100) / 100,
          purchaseInvoiceId: el.purchaseInvoiceId,
        };
        purchase.totalPaidPrice += Number(el.paidPrice);
        purchase.totalPrice += Number(el.price)*Number(el.quantity);
        purchase.details.push(purchaseDetails);
      }
    }
    if (
      purchase.details.length > 0 &&
      (purchase.details[0] === null || purchase.details[0] === undefined)
    ) {
      purchase.details.splice(0, 1);
    }
    console.log(":::purchase:::", purchase);
    if (this.purchaseForm.valid) {
      if (purchase.id && purchase.id > 0) {
        // update current purchase invoice
        this.purchaseService
          .updatePurchaseInvoice(purchase)
          .then((res: any) => {
            if (res.id && res.id > 0) {
              for (let el of purchase.details) {
                el.purchaseInvoiceId = res.id;
                this.purchaseService
                  .updatePurchaseInvoiceDetails(el)
                  .then((res) => {
                    this.applyPurchaseInvoiceOnStock(el);
                  });
              }
              this.sandoqService.UpdateOnSandoq(-1*purchase.totalPaidPrice);
              this.routerExtensions.navigate(["/purchase"]);
              console.log("updateProduct success", res);
            }
            console.log("updateProduct success", res);
          });
      } else {
        // save new purchase invoice
        this.purchaseService.savePurchaseInvoice(purchase).then((res: any) => {
          console.log('savePurchaseInvoice>>>>>>>>', purchase);
          
          if (res.id && res.id > 0) {
            for (let el of purchase.details) {
              el.purchaseInvoiceId = res.id;
              this.purchaseService
                .savePurchaseInvoiceDetails(el)
                .then((res) => {
                  this.applyPurchaseInvoiceOnStock(el);
                });
            }
            this.applyPurchaseInvoiceOnSandoq(-1 * purchase.totalPaidPrice);
            this.routerExtensions.navigate(["/purchase"]);
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

  applyPurchaseInvoiceOnStock(purchaseDetails: PurchaseDetails) {
    if (purchaseDetails) {
      // let invoiceProducts = [{}]
      this.purchaseService.purchaseUpdateStock(purchaseDetails).then((res) => {
        console.log("purchaseUpdateStock:", res);
      });
      // purchaseDetails = {
      //   id: el.id,
      //   productId: el.productId,
      //   quantity: el.quantity,
      //   price: el.price,
      //   paidPrice: el.paidPrice,
      //   purchaseInvoiceId: el.purchaseInvoiceId,
      // };
    }
  }

  get productFormGroup() {
    return this.purchaseForm.get("productFormGroup") as FormArray;
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
        purchaseInvoiceId: [0],
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
    form.get("supplierId").reset();
    form.get("notes").reset();
    form.get("productFormGroup").reset();
  }

  calcPrice(index) {
    this.totalPaidPrice[index] =
      this.productFormGroup.at(index).get("quantity").value *
      this.productFormGroup.at(index).get("price").value;
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
