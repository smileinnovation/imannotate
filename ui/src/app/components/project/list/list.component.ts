import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Project } from '../../../classes/project';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'project-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  private _projects: Array<Project>;

  constructor(
    private projectService: ProjectService,
    private userService: UserService) { }

  ngOnInit() {
    this.projectService.getProjectList().subscribe(projects => {
      console.log('projects: ', projects);
      this._projects = projects;
    });

  }

  get projects() {
    console.log('get projects...');
    return this._projects;
  }

}
