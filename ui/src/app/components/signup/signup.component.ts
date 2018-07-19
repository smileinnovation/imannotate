import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../classes/user';
import { Router } from '@angular/router';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {


  public user: User;
  error = {'error' : ''};
  userExists = false;
  registered = false;

  constructor(private userservice: UserService, private router: Router) {
    this.user = new User();
  }

  ngOnInit() {
  }

  signup() {
    this.userservice.signup(this.user).subscribe(
      user => {
        console.log("Registered !");
        this.registered = true;
      },
      error => {
        this.error.error = error;
      }
    );
  }

  search() {
    console.log("search")
    if (this.user.username.length < 2) {
      return
    }

    this.userExists = false;
    this.userservice.search(this.user.username).subscribe(user => {
      user.forEach(u => {
        if (u.username.trim() == this.user.username) {
          this.userExists = true;
        }
      })
    });
  }

}
