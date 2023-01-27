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
import { Category } from "../../category.model";
import { CategoryService } from "../../shared/category.service";
import { TablesService } from "~/app/shared/tables.service";

@Component({
  selector: "editCategory",
  templateUrl: "./edit-category.component.html",
})
export class EditCategoryComponent implements OnInit {
  public category: Category;
  public categoryForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private tablesService: TablesService,
  ) {
    this.categoryForm = this.fb.group({
      id: [""],
      name: ["", [Validators.required]],
    });
  }

  async ngOnInit() {
    const id = +this.activatedRoute.snapshot.params.id;
    console.log("params:", this.activatedRoute.snapshot.params);
    this.resetFormControls(this.categoryForm);
    if (id && id > 0) {
      await this.getCategory(id);
      console.log('getCategory>>>>>', this.category);
      this.categoryForm.get("id").setValue(this.category.id);
      this.categoryForm.get("name").setValue(this.category.name);
    }
  }

  resetFormControls(form) {
    form.get("id").reset();
    form.get("name").reset();
  }

  async getCategory(id: number) {
    await this.categoryService.getCategory(id).then(
      (result: any) => {
        if (result.status) {
          this.category = result.data;
        }
      },
      (err) => {
        console.log("err:", err);
      }
    );
    console.log("end..");
  }

  save() {
    console.log("categoryForm:");
    console.log(this.categoryForm.value);
    let category: Category = {
      id: this.categoryForm.get("id").value,
      name: this.categoryForm.get("name").value,
    };
    if (this.categoryForm.valid) {
      if (category.id && category.id > 0) {
        // update current category
        this.categoryService.updateCategory(category).then((res) => {
          console.log("updateCategory success", res);
          this.routerExtensions.navigate(['/category']);
        });
      } else {
        // save new category
        this.categoryService.saveCategory(category).then((res) => {
          console.log("saveCategory success", res);
          this.routerExtensions.navigate(['/category']);
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
