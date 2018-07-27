import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../classes/user';
import { UserService } from '../../../services/user.service';
import { ApiService } from "../../../services/api.service";



@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  @Input('title') title: string;
  show = true;
  avatar = "https://www.gravatar.com/avatar/";

  constructor(
    private userService: UserService,
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.getAvatar();
  }

  logout() {
    this.userService.logout();
  }

  toggleCollapse() {
    const main = document.querySelector('main')
    main.classList.toggle("disable")
    this.show = !this.show;
  }

  get user() {
    return this.userService.currentUser;
  }

  get admin() {
    return this.userService.isAdmin;
  }

  getAvatar() {
    this.api.get(`/v1/avatar/${this.userService.currentUser.id}`).subscribe(
      (resp: string) => {this.avatar = resp}
    )
  }

  onPan(evt, direction) {
    const main = document.querySelector('main')
    switch(direction){
      case "left":
        this.show=true
        main.classList.remove("disable")
        break
      case "right":
        this.show=false
        main.classList.add("disable")
        break;
    }
  }
}
