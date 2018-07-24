import { Project, ProjectStat } from "../../../classes/project";
import { Component, OnInit } from '@angular/core';
import { AdminService } from "../../../services/admin.service";
import { ProjectService } from "../../../services/project.service";
import { Router } from "@angular/router";



@Component({
  selector: 'admin-project',
  templateUrl: './admin-project.component.html',
  styleUrls: ['./admin-project.component.css']
})
export class AdminProjectComponent implements OnInit {


  stats: ProjectStat[]
  constructor(
    private admin: AdminService,
    private projectService: ProjectService,
    private router: Router,
  ) {
    this.stats = new Array<ProjectStat>();
  }

  ngOnInit() {
    this.setProjectList();
  }

  setProjectList() {
    this.admin.getProjects().subscribe(
      stats  => this.stats = stats,
      error => {console.log(error);}
    );
  }

  deleteProject(p: Project) {
    if (!confirm(`Really delete that project ${p.name} ?`)) {
      return
    }
    this.projectService.deleteProject(p).subscribe(
      resp => {
        console.log(resp);
        this.setProjectList();
      },
      error => {console.log(error)}
    );
  }

  editProject(p: Project) {
    this.router.navigate(["project", "edit", p.id]);
  }

}
