import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../classes/user';

@Component({
  selector: 'signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  public user: User;
  error = "";
  constructor(
    private userservice: UserService,
    private router: Router) {
    this.user = new User();
  }

  ngOnInit() {}

  doLogin() {
    this.error = '';
    console.log("login");
    this.userservice.login(this.user).subscribe(
      user => {
        console.log(user);
        this.router.navigate(['dashboard']);
      },
      error => {
        this.userservice.currentUser = null;
        console.log(error);
        this.error = error.error;
      }
    );
  }
}
