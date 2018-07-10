import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { UserService } from './services/user.service';
import { User } from './classes/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Imannotate' + (environment.production ? '' : ' -- testing');

  constructor(
    private userservice: UserService,
    private router: Router) { }

  ngOnInit() {
    const luser = localStorage.getItem('user');

    if (luser !== null) {
      this.userservice.currentUser = JSON.parse(luser);
      console.log('Yes, user found');
      this.router.navigate(['dashboard']);
    } else {
      this.router.navigate(['signin']);
      console.log('Hu... user NOT found');
    }
  }
}
