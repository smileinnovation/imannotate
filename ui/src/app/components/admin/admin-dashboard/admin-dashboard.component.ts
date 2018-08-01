import { Component, OnInit } from '@angular/core';

import { AdminService } from "@app/services/admin.service";
import { Project } from "@app/classes/project";

@Component({
  selector: 'admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {


  stats: any
  constructor(private admin: AdminService) { }

  ngOnInit() {
    this.stats = {"projects":0, "users":0};
    this.admin.stats().subscribe(
      resp => {this.stats = resp;},
      error => {console.log(error);}
    );

  }

}
