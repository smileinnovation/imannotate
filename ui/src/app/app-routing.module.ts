import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from '@app/components/signin/signin.component';
import { DashboardComponent } from '@app/components/dashboard/dashboard.component';
import { AnnotatorComponent } from '@app/components/project/annotator/annotator.component';
import { SignupComponent } from '@app/components/signup/signup.component';
import { ProjectformComponent } from "@app/components/project/projectform/projectform.component";
import { AboutComponent } from "@app/components/about/about.component";
import { AdminDashboardComponent } from "@app/components/admin/admin-dashboard/admin-dashboard.component";
import { AdminProjectComponent } from "@app/components/admin/admin-project/admin-project.component";
import { AdminUserComponent } from "@app/components/admin/admin-user/admin-user.component";
import { UserComponent } from "@app/components/user/user.component";

const routes: Routes = [
  { path:'', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'about', component: AboutComponent },
  { path: 'annotate/:name', component: AnnotatorComponent },
  { path: 'project/create', component: ProjectformComponent },
  { path: 'project/edit/:name', component: ProjectformComponent },
  { path: 'project/edit/:name/:state', component: ProjectformComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'admin/projects', component: AdminProjectComponent },
  { path: 'admin/users', component: AdminUserComponent },
  { path: 'user/edit/:name', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
