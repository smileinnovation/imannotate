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

  constructor(private userservice: UserService, private router: Router) {
    this.user = new User();
  }

  ngOnInit() {
  }

  signup() {
  }

}
