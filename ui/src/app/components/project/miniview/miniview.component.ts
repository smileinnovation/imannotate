import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Project, ProjectStat } from '@app/classes/project';
import { UserService } from '@app/services/user.service';
import { ProjectService } from "@app/services/project.service";
import { ApiService } from "@app/services/api.service";
import { User } from "@app/classes/user";
import { md5 } from "@app/classes/md5";

@Component({
  selector: 'project-miniview',
  templateUrl: './miniview.component.html',
  styleUrls: ['./miniview.component.css']
})
export class MiniviewComponent implements OnInit {

  @Input('project') project: Project;
  public isOwner: boolean;
  public owner: User;
  public stats : ProjectStat;
  avatar = "";

  constructor(
    private user: UserService,
    private projectService: ProjectService,
    private router: Router,
    private api: ApiService,
  ) {
    this.isOwner = false;
    this.owner = new User();
    this.stats = new ProjectStat();
  }

  ngOnInit() {
    if (this.project.banner === "") {
      this.project.banner = "/assets/logo.svg";
    }
    this.isOwner = this.project.owner === this.user.currentUser.id;
    if (!this.isOwner) {
      this.user.getUser(this.project.owner).subscribe( user => {
          this.owner = user;
          this.api.get<string>(`/v1/avatar/${user.id}`).subscribe(av => this.avatar = av);
      });
    } else {
      // calculate gravatar ourself
      this.avatar = "https://www.gravatar.com/avatar/" + md5(this.user.currentUser.email);
    }

    this.projectService.getInfo(this.project).subscribe(stat => {
      this.stats = stat;
    });
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
