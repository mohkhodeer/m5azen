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
import { User } from "../../user.model";
import { UserService } from "../../shared/user.service";
import { TablesService } from "~/app/shared/tables.service";

@Component({
  selector: "editUser",
  templateUrl: "./edit-user.component.html",
})
export class EditUserComponent implements OnInit {
  public user: User;
  public userForm: FormGroup;
  selectedIsSupplierYesNoIndex = 0;
  isSupplierYesNo: Array<string> = ["لا", "نعم"];

  constructor(
    private activatedRoute: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private userService: UserService,
    private fb: FormBuilder,
    private tablesService: TablesService,
  ) {
    this.userForm = this.fb.group({
      id: [0],
      name: ["", [Validators.required]],
      address: [""],
      mobile: [""],
      isSupplier: [0, [Validators.required]]
    });
  }

  async ngOnInit() {
    const id = +this.activatedRoute.snapshot.params.id;
    console.log("params:", this.activatedRoute.snapshot.params);
    this.resetFormControls(this.userForm);
    if (id && id > 0) {
      await this.getUser(id);
      console.log('getUser>>>>>', this.user);
      this.selectedIsSupplierYesNoIndex = this.user.isSupplier;
      this.userForm.get("id").setValue(this.user.id);
      this.userForm.get("name").setValue(this.user.name);
      this.userForm.get("address").setValue(this.user.address);
      this.userForm.get("mobile").setValue(this.user.mobile);
      this.userForm.get("isSupplier").setValue(this.user.isSupplier > 0 ? this.user.isSupplier: 0);
    }
  }

  resetFormControls(form) {
    form.get("id").reset();
    form.get("name").reset();
    form.get("address").reset();
    form.get("mobile").reset();
    form.get("isSupplier").reset();
  }

  async getUser(id: number) {
    await this.userService.getUser(id).then(
      (result: any) => {
        if (result.status) {
          this.user = result.data;
        }
      },
      (err) => {
        console.log("err:", err);
      }
    );
    console.log("end..");
  }

  save() {
    console.log("userForm:");
    console.log(this.userForm.value);
    let user: User = {
      id: this.userForm.get("id").value,
      name: this.userForm.get("name").value,
      address: this.userForm.get("address").value,
      mobile: this.userForm.get("mobile").value,
      isSupplier: this.userForm.get("isSupplier").value,
    };
    if (this.userForm.valid) {
      if (user.id && user.id > 0) {
        // update current user
        this.userService.updateUser(user).then((res) => {
          console.log("updateUser success", res);
          this.routerExtensions.navigate(['/user']);
        });
      } else {
        // save new user
        this.userService.saveUser(user).then((res) => {
          console.log("saveUser success", res);
          this.routerExtensions.navigate(['/user']);
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
