import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../../../classes/project';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

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
    private router: Router
  ) {
    this.owner = false;
  }

  ngOnInit() {
    this.owner = this.project.owner === this.user.currentUser.username;
  }

  gotoProject(p: Project) {
    this.router.navigate(['annotate', p.name]);
  }

}
