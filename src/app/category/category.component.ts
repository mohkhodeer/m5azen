import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Application } from "@nativescript/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Dialogs } from "@nativescript/core";
import { Category } from "../category.model";
import { CategoryService } from "../shared/category.service";
import { TablesService } from "../shared/tables.service";

@Component({
  selector: "Category",
  templateUrl: "./category.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent implements OnInit {
  items: Array<Category> = [
    {
      id: 0,
      name: "",
    },
  ];

  constructor(private categoryService: CategoryService, private tablesService: TablesService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log("init..");
    this.getAllCategories();
  }

  delete(id) {
    console.log("del id:", id);
    if (id && id > 0) {
      Dialogs.confirm({
        title: "حذف",
        message: "هل أنت متأكد من حذف الصنف والمنتجات الخاصة به؟",
        okButtonText: "موافق",
        cancelButtonText: "إلغاء",
      }).then((yes) => {
        console.log("Dialog closed!", yes);
        if (yes) {
          this.categoryService.deleteCategory(id).then(
            (result: any) => {
              console.log("deleteCategory:::", result);
              this.getAllCategories();
            },
            (err) => {
              console.log("deleteCategory err:::", err);
            }
          );
        }
      });
    }
  }

  getAllCategories() {
    this.categoryService.getCategories().then(
      (result: any) => {
        if (result.status) {
          this.items = result.data;
          this.cd.markForCheck();
        }
        console.log("result:::", result);
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
