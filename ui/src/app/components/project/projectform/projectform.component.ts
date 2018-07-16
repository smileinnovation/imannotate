import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../../classes/project';
import { UserService } from '../../../services/user.service';
import { ProjectService } from '../../../services/project.service';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { User } from "../../../classes/user";
import { Subject } from "rxjs/internal/Subject";


@Component({
  selector: 'project-form',
  templateUrl: './projectform.component.html',
  styleUrls: ['./projectform.component.css']
})
export class ProjectformComponent implements OnInit {

  @Input("project") project: Project;
  private _success = new Subject<string>();
  successMessage: string;
  alertType = "success";
  tags: string
  edit = false;
  title = "Create project"
  searching = false;
  contributors = new Array<User>();
  contribSearch: User;
  contribId = "";

  constructor(
    private userservice: UserService,
    private projectservice: ProjectService,
    private router: ActivatedRoute,
    private route: Router,
  ) { }

  ngOnInit() {
    this.contribSearch = new User();
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
        this.project.owner = this.userservice.currentUser.id;
        console.log(this.project)
        this.edit = true;
        this.title = "Edit project";
        this.projectservice.getContributors(project).subscribe(contributors => {
          contributors.forEach(c => this.contributors.push(c))
        });

        this._success.subscribe((message) => this.successMessage = message);
        this._success.pipe(
          debounceTime(5000)
        ).subscribe(() => this.successMessage = null);

      });
    })
    this.project.owner = this.userservice.currentUser.id;
  }

  create(){
    this.projectservice.save(this.project, this.edit).subscribe(
      project => {
        console.log("project created", project);
        this.route.navigate(["/project/edit", project.name]);
      },
      error => { console.log(error); }
    );
  }

  onTagChange(){
    this.project.tags = this.tags.split(",").map(i => i.trim());
  }


  addContributor() {
    this.alertType = "success";
    const u = this.contribSearch.username;
    this.projectservice.addContributor(this.contribSearch.id, this.project).subscribe(res => {
      this._success.next(`${u} successfuly added to the project`);
      this.projectservice.getContributors(this.project).subscribe(
        contributors => this.contributors = contributors,
        error => this.contributors = new Array<User>()
      );
    });
    this.contribSearch = new User();
  }

  removeContributor(contrib: User) {
    this.projectservice.removeContributor(contrib.id, this.project).subscribe(res => {
      this.alertType = "warning";
      this._success.next(`${contrib.username} has been removed from the project`);
      this.projectservice.getContributors(this.project).subscribe(
        contributors => this.contributors = contributors,
        error => this.contributors = new Array<User>()
      );
    });
  }


  searchFormatter = (x: User) => x.username;

  searchContributor = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term => {
        return this.userservice.search(term).pipe(
          tap(ob => {console.log(ob)}),
        );
      }),
      tap(() => this.searching = false),
    );


  onProviderChange() {
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
