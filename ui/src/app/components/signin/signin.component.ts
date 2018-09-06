import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@app/services/user.service';
import { User } from '@app/classes/user';

@Component({
  selector: 'signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  public user: User;
  public error: boolean;

  constructor(
    private userservice: UserService,
    private router: Router) {}

  ngOnInit() {
    this.user = new User();
    this.error = false;
  }

  doLogin() {
    this.userservice.login(this.user).subscribe(
      user => {
        console.log(user);
        this.router.navigate(['dashboard']);
        this.error = false;
      },
      error => {
        this.userservice.currentUser = null;
        console.log(error);
        this.error = true;
      }
    );
  }
}
