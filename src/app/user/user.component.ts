import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Application } from "@nativescript/core";
import { Dialogs } from "@nativescript/core";
import { User } from "../user.model";
import { UserService } from "../shared/user.service";
import { TablesService } from "../shared/tables.service";

@Component({
  selector: "User",
  templateUrl: "./user.component.html",
})
export class UserComponent implements OnInit {
  items: Array<User> = [
    {
      id: 0,
      name: "",
      address: "",
      mobile: "",
      isSupplier: 0,
    },
  ];

  constructor(private tablesService: TablesService,private userService: UserService) {}

  ngOnInit(): void {
    console.log("init..");
    this.getAllUsers();
  }

  delete(id) {
    console.log("del id:", id);
    if (id && id > 0) {
      Dialogs.confirm({
        title: "حذف",
        message: "هل تريد فعلا حذف هذا المورد/العميل؟",
        okButtonText: "موافق",
        cancelButtonText: "إلغاء",
      }).then((yes) => {
        console.log("Dialog closed!", yes);
        if(yes){
          this.userService.deleteUser(id).then(
            (result: any) => {
              console.log("deleteUser:::", result);
              this.getAllUsers();
            },
            (err) => {
              console.log("deleteUser err:::", err);
            }
          );
        }
      });
    }
  }

  getAllUsers() {
    this.userService.getUsers().then(
      (result: any) => {
        if (result.status) {
          this.items = result.data;
        }
        console.log("getAllUsers::", result);
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
