import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Application } from "@nativescript/core";
import { SandoqService } from "../shared/sandoq.service";

@Component({
  selector: "Sandoq",
  templateUrl: "./sandoq.component.html",
})
export class SandoqComponent implements OnInit {
  sandoqBalance: number = 0;
  sandoqModifiedDate: string = "";

  constructor(private sandoqService: SandoqService) {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
    // Init your component properties here.
    this.sandoqService.getSandoq().then((res: any) => {
      console.log("sandoq:", res);
      if (res && res.data) {
        if (res.data[1]) this.sandoqBalance = res.data[1];
        if (res.data[2]) {
          let dateFormat = new Date(res.data[2] * 1000);
          this.sandoqModifiedDate =
            dateFormat.getDate() +
            "/" +
            (dateFormat.getMonth() + 1) +
            "/" +
            dateFormat.getFullYear();
        }
      }
    });
  }

  save(){    
    this.sandoqService.saveSandoq(this.sandoqBalance).then((res) => {
      console.log('SandoqComponent save!');
      
    })    
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }
}
