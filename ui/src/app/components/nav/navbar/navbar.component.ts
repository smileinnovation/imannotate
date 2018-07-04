import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../classes/user';
import { UserService } from '../../../services/user.service';



@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  @Input('title') title: string;
  show = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  logout() {
    this.userService.logout();
  }

  toggleCollapse() {
    this.show = !this.show;
  }

  get user() {
    return this.userService.currentUser;
  }
}
