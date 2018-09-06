import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user.service';
import { Project } from '@app/classes/project';
import { ProjectService } from '@app/services/project.service';

@Component({
  selector: 'project-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  public projects: Array<Project>;

  constructor(
    private projectService: ProjectService,
    private userService: UserService) { }

  ngOnInit() {
    this.projectService.getProjectList().subscribe(projects => {
      this.projects = projects;
    });

  }
}
