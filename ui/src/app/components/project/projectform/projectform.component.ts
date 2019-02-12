import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../../classes/project';
import { UserService } from '../../../services/user.service';
import { ProjectService } from '../../../services/project.service';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { User } from "../../../classes/user";
import { Subject } from "rxjs/internal/Subject";
import { ApiService } from "../../../services/api.service";

class Bucket {
  Name: string;
}

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
  bucketList = new Array<Bucket>();
  s3Valid = true;
  s3Error = "";
  projectWasSaved = false;

  constructor(
    private userservice: UserService,
    private projectservice: ProjectService,
    private router: ActivatedRoute,
    private route: Router,
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.contribSearch = new User();
    if (!this.project) {
      this.project = new Project();
    }
    this.router.params.subscribe(param => {
      if (param["state"] && param["state"] === "saved") {
        this.projectWasSaved = true;
      }
      if (!param["name"]) {
        return;
      }
      this.projectservice.getProject(param.name).subscribe(project => {
        this.project = project;
        this.tags = this.project.tags.join(",");
        if (this.project.owner == "") {
          this.project.owner = this.userservice.currentUser.id;
        }
        this.edit = true;
        this.title = "Edit project";
        this.projectservice.getContributors(project).subscribe(contributors => {
          contributors.forEach(c => this.contributors.push(c))
        });
        if (this.project.imageProvider == "s3") {
          this.checkS3Credentials();
        }

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
        this.route.navigate(["/project/edit", project.id, "saved"]);
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
      case 's3':
        this.project.imageProviderOptions = {};
        this.checkS3Credentials()
        break;
    }
  }

  checkS3Credentials() {
    this.api.post('/v1/check/s3', this.project.imageProviderOptions).subscribe(
      (resp: Array<Bucket>) => {
        this.bucketList = resp;
        this.s3Valid = true;
      },
      error => {
        this.s3Valid = false;
        this.s3Error = "Invalid S3 communication, maybe your AWS ID, Secret or Region is wrong.";
        this.bucketList = new Array<Bucket>();
      }
    );
  }


  setBanner(event) {
    let reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.project.banner = reader.result as string;
      };
    }
  }

  formIsValid() {
    switch(this.project.imageProvider) {
      case 's3':
        if (!this.s3Valid) {
          return false;
        }
        return true;
      default:
        return true;
    }
  }
}
