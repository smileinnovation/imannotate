import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from "../../../classes/project";
import { UserService } from "../../../services/user.service";
import { ProjectService } from "../../../services/project.service";

@Component({
  selector: 'project-form',
  templateUrl: './projectform.component.html',
  styleUrls: ['./projectform.component.css']
})
export class ProjectformComponent implements OnInit {

  @Input("project") project: Project;
  tags: string
  edit = false;
  title = "Create project"

  constructor(
    private userservice: UserService,
    private projectservice: ProjectService,
    private router: ActivatedRoute,
  ) { }

  ngOnInit() {
    if (!this.project) {
      this.project = new Project();
    }
    this.router.params.subscribe(param => {
      console.log("params", param);
      if (!param["name"]) {
        return;
      }
      this.projectservice.getProject(param.name).subscribe(project => {
        this.project = project;
        this.tags = this.project.tags.join(",");
        this.project.owner = this.userservice.currentUser.username;
        this.edit = true;
        this.title = "Edit project";
      })
    })
    this.project.owner = this.userservice.currentUser.username;
  }

  create(){
    this.projectservice.save(this.project, this.edit).subscribe(
      project => { console.log("project created", project); },
      error => { console.log(error); }
    );
  }

  onTagChange(){
    this.project.tags = this.tags.split(",").map(i => i.trim());
  }

  onProviderChange(){
    switch(this.project.imageProvider) {
      case 'qwant':
        this.project.imageProviderOptions = {
          qwantQuery: ""
        };
        break;
      case 'filesystem':
        this.project.imageProviderOptions = {
          file: ""
        };
        break;
    }
  }
}
