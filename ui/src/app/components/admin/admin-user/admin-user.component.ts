import { Component, OnInit } from '@angular/core';
import { AdminService } from "../../../services/admin.service";
import { User } from "../../../classes/user";
import { md5 } from "../../../classes/md5";

class userStat {
  projets: number
}


class UserStat {
  user: User
  stat: userStat
}


@Component({
  selector: 'admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css']
})
export class AdminUserComponent implements OnInit {


  stats: Array<UserStat>
  constructor(private admin: AdminService) { }

  ngOnInit() {
    this.setUserList();
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
}
