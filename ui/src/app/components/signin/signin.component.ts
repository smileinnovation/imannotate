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

  user: User;
  error = { 'error': '' };
  constructor(
    private userservice: UserService,
    private router: Router) {
  }

  ngOnInit() {
    this.user = new User();
  }

  doLogin() {
    this.error.error = '';
    this.userservice.user$.subscribe(user => {
      console.log(user);
      this.router.navigate(['dashboard']);
    }, error => {
      this.userservice.currentUser = null;
      console.log(error);
    });
    this.userservice.login(this.user);
  }
}
