import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { Project } from "../../classes/project";
import { ProjectService } from "../../services/project.service";

@Component({
  selector: 'project-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {


  constructor(
    private projectService: ProjectService) {}

  ngOnInit() {
  }

  get projects(): Project[]{
    return this.projectService.projects
  }

}
