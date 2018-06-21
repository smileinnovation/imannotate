import { Component, OnInit } from '@angular/core';
import { UserService } from "../services/user.service";
import { User } from "../classes/user";
import { Router } from '@angular/router';

@Component({
  selector: 'signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  user: User
  error = {
    error: ""
  }

  constructor(private userservice: UserService, private router: Router) {
  }

  ngOnInit() {
    this.user = new User()
    this.userservice.user$.subscribe(user => this.user = user)
  }

  doLogin() {
    console.log(this.user);
    this.userservice.login(this.user).subscribe(
      resp => {
        this.router.navigate(["dashboard"])
      },
      err => {
        this.error = err.error
      }
    );
  }

}
