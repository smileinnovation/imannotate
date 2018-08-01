import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { UserService } from "@app/services/user.service";
import { ThemeService } from "@app/services/theme.service";
import { User } from "@app/classes/user";
import { md5 } from '@app/classes/md5';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user = new User();
  gravatar = "";
  saved = false;
  error = "";
  chosenTheme = "";

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    public themeService: ThemeService,
  ) { }

  ngOnInit() {
    this.chosenTheme = this.themeService.theme;
    this.route.params.subscribe(param => {
      if(param["name"]){
        this.userService.getUser(param["name"]).subscribe(
          user => {
            this.user = user;
            this.user.password = ""; // protection
            this.onEmail();
          }
        );
      }
    });
  }

  onEmail() {
    this.gravatar = "https://www.gravatar.com/avatar/" + md5(this.user.email);
  }

  submit() {
    this.userService.update(this.user).subscribe(
      () => {
        this.error = "";
        this.saved = true;
      },
      error => {
        this.saved = false;
        this.error = error.error;
      }
    )
  }

  themeChosen() {
    this.themeService.changeTheme(this.chosenTheme);
  }

}
