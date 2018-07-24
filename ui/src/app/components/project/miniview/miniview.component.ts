import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../../../classes/project';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ProjectService } from "../../../services/project.service";
import { ApiService } from "../../../services/api.service";

@Component({
  selector: 'project-miniview',
  templateUrl: './miniview.component.html',
  styleUrls: ['./miniview.component.css']
})
export class MiniviewComponent implements OnInit {

  @Input('project') project: Project;
  public owner: boolean;

  constructor(
    private user: UserService,
    private projectService: ProjectService,
    private router: Router,
    private api: ApiService,
  ) {
    this.owner = false;
  }

  ngOnInit() {
    if (this.project.banner === "") {
      this.project.banner = "/assets/logo-dark.svg";
    }
    this.owner = this.project.owner === this.user.currentUser.id;
  }

  gotoProject(p: Project) {
    this.router.navigate(['annotate', p.id]);
  }

  edit() {
    this.router.navigate(['project','edit', this.project.id])
  }

  exportProject() {
    this.projectService.downloadAnnotation(this.project).subscribe(
      res => {
        this.downloadBlob(
          res,
          {
            "type": 'text/csv;charset=utf-8'
          },
          this.project.name + '.csv'
        )
      }
    );
  }

  downloadBlob(data, options, filename) {
    var blob = new Blob([data], options);
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.setAttribute("href", url);
    link.style.display = "none";
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click()
    document.body.removeChild(link);
  }
}
