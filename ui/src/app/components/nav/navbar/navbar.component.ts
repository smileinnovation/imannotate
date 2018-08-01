import { Component, OnInit, Input } from '@angular/core';

import { User } from '@app/classes/user';
import { UserService } from '@app/services/user.service';
import { ApiService } from "@app/services/api.service";



@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  @Input('title') title: string;
  show = true;

  constructor(
    private userService: UserService,
    private api: ApiService,
  ) { }

  ngOnInit() {
  }

  logout() {
    this.userService.logout();
  }

  get user() {
    return this.userService.currentUser;
  }

  get admin() {
    return this.userService.isAdmin;
  }

  get avatar() {
    return this.userService.avatar;
  }

}
