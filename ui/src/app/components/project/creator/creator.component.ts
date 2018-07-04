import { Component, OnInit } from '@angular/core';
import { Project } from '../../../classes/project';
import { ProjectService } from '../../../services/project.service';
import { NgForm } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'project-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.css']
})
export class CreatorComponent implements OnInit {

  project: Project = new Project();

  constructor(
    private projectService: ProjectService,
    private userservice: UserService,
  ) { }

  ngOnInit() {
  }


  create(f: NgForm) {
    if (f.valid) {
      this.projectService.save(this.project).subscribe();
    }
  }
}
