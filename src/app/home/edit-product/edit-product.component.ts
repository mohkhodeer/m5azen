import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { TablesService } from "../../shared/tables.service";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
} from "@angular/forms";
import { ValueList } from "nativescript-drop-down";
import { Product } from "../../product.model";
import { ProductService } from "../../shared/product.service";
import { CategoryService } from "../../shared/category.service";

@Component({
  selector: "editProduct",
  templateUrl: "./edit-product.component.html",
})
export class EditProductComponent implements OnInit {
  product: Product = {
    id: 0,
    categoryId: 0,
    name: "",
    quantity: 0,
    unit: "",
    averagePrice: 0,
    salePrice: 0,
    notes: "",
  };
  public productForm: FormGroup;
  selectedCategoryIndex = 0;
  selectedUnitIndex = 0;
  categories: ValueList<string>;
  units: Array<string> = ["كيلو", "طن"];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private tablesService: TablesService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      id: [0],
      categoryId: [0, [Validators.required]],
      name: ["", [Validators.required]],
      quantity: [0, [Validators.required]],
      unit: ["", [Validators.required]],
      salePrice: [0, [Validators.required]],
      notes: [""],
    });
  }

  resetFormControls(form) {
    form.get("id").reset();
    form.get("categoryId").reset();
    form.get("name").reset();
    form.get("quantity").reset();
    form.get("unit").reset();
    form.get("salePrice").reset();
    form.get("notes").reset();
  }

  async ngOnInit() {
    const id = +this.activatedRoute.snapshot.params.id;
    this.resetFormControls(this.productForm);
    await this.getAllCategories();
    if (id && id > 0) {
      await this.getProduct(id);
      console.log("getProduct>>>>>", this.product);
      this.selectedUnitIndex = parseInt(this.product.unit);
      this.selectedCategoryIndex = this.categories.getIndex(
        this.product.categoryId.toString()
      );
      console.log("this.categories>>>", this.categories);
      console.log("this.selectedCategoryIndex>>>", this.selectedCategoryIndex, this.product.categoryId.toString());
      console.log("end..");
    }
  }

  async getProduct(id: number) {
    await this.productService.getProduct(id).then(
      (result: any) => {
        if (result.status) {
          this.product = result.data;
          this.productForm.get("id").setValue(this.product.id);
          this.productForm.get("categoryId").setValue(this.product.categoryId);
          this.productForm.get("name").setValue(this.product.name);
          this.productForm.get("quantity").setValue(this.product.quantity);
          this.productForm.get("unit").setValue(this.product.unit);
          this.productForm.get("salePrice").setValue(this.product.salePrice);
          this.productForm.get("notes").setValue(this.product.notes);
        }
      },
      (err) => {
        console.log("err:", err);
      }
    );
    console.log("end..");
  }

  async getAllCategories() {
    await this.categoryService.getCategories().then(
      (result: any) => {
        let cat = [{ value: '0', display: 'اختر الصنف' }];
        if (result.status && result.data && result.data.length > 0) {
          result.data.forEach((el) => {
            cat.push({ value: el.id.toString(), display: el.name });
            // cat.push({
            //   value: el.id,
            //   name: el.name,
            //   toString: () => {
            //     return el.name;
            //   },
            // });
          });
          this.categories = new ValueList<string>(cat);
          // this.categories = cat;
        }
        console.log("this.categories:", this.categories);
      },
      (err) => {
        console.log("getCategories err:::", err);
      }
    );
  }

  save() {
    console.log("productForm:");
    console.log(this.productForm.value);

    let categoryID =
      this.selectedCategoryIndex >= 0
        ? parseInt(this.categories.getValue(this.selectedCategoryIndex))
        : 0;
    console.log(
      "++selectedCategoryIndex+++",
      this.selectedCategoryIndex,
      categoryID
    );
    let product: Product = {
      id: this.productForm.get("id").value,
      name: this.productForm.get("name").value,
      categoryId: categoryID,
      // categoryId: this.productForm.get("categoryId").value,
      quantity: this.productForm.get("quantity").value,
      unit: this.productForm.get("unit").value,
      salePrice: this.productForm.get("salePrice").value,
      notes: this.productForm.get("notes").value,
    };
    if (this.productForm.valid) {
      if (product.id && product.id > 0) {
        // update current product
        this.productService.updateProduct(product).then((res) => {
          this.routerExtensions.navigate(["/home"]);
          console.log("updateProduct success", res);
        });
      } else {
        // save new product
        this.productService.saveProduct(product).then((res) => {
          this.routerExtensions.navigate(["/home"]);
          console.log("saveProduct success", res);
        });
      }
    }
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
