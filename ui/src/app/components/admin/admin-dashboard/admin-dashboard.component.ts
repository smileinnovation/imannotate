import { Component, OnInit } from '@angular/core';
import { AdminService } from "../../../services/admin.service";

@Component({
  selector: 'admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  constructor(private admin: AdminService) { }

  ngOnInit() {
    this.admin.getProjects().subscribe(
      resp => {console.log(resp);},
      error => {console.log(error);}
    );

  }

}
