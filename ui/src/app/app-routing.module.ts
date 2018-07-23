import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './components/signin/signin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AnnotatorComponent } from './components/project/annotator/annotator.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProjectformComponent } from "./components/project/projectform/projectform.component";
import { AboutComponent } from "./components/about/about.component";
import { AdminDashboardComponent } from "./components/admin/admin-dashboard/admin-dashboard.component";

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
