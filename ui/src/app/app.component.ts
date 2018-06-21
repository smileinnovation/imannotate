import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { UserService } from "./services/user.service";
import { User } from "./classes/user";
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Imannotate' + (environment.production? "" : " -- testing");
  user: User

  constructor(
    private userservice: UserService,
    private router: Router) {}

  ngOnInit(){
    this.userservice.user$.subscribe(user => this.user = user, error => {
      this.router.navigate(["signin"])
    })
  }
}
