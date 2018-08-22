import { Component, OnInit } from '@angular/core';
import { AdminService } from "@app/services/admin.service";
import { User } from "@app/classes/user";
import { md5 } from "@app/classes/md5";
import { UserService } from "@app/services/user.service";


class userStat {
  projets: number
}

class UserStat {
  user: User
  stat: userStat
  isAdmin: boolean
}

@Component({
  selector: 'admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css']
})
export class AdminUserComponent implements OnInit {


  stats: Array<UserStat>
  constructor(
    private admin: AdminService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.setUserList();
  }

  get currentUser() {
    return this.userService.currentUser;
  }

  setUserList() {
    this.admin.getUserStat().subscribe(stats => {
      this.stats = stats
    });
  }

  deleteUser(u: User) {
    if(!confirm(`Do you really want to delete user ${u.id} ?`)) {
      return
    }
    this.admin.deleteUser(u).subscribe(
      resp => {
        console.log(resp);
        this.setUserList();
      },
      error => {
        console.log(error);
      }
    )
  }

  gravatar(u: User) {
    return `https://www.gravatar.com/avatar/${md5(u.email)}`;
  }

  setAdmin(u: User) {
    this.admin.setAdmin(u).subscribe(()=>{
      this.setUserList();
    }, error => {
      console.log(error);
    });
  }

  removeAdmin(u: User) {
    this.admin.removeAdmin(u).subscribe(()=>{
      this.setUserList();
    }, error => {
      console.log(error);
    });

  }
}
