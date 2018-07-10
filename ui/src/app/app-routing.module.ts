import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './components/signin/signin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AnnotatorComponent } from './components/project/annotator/annotator.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProjectformComponent } from "./components/project/projectform/projectform.component";

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'annotate/:name', component: AnnotatorComponent },
  { path: 'project/create', component: ProjectformComponent },
  { path: 'project/edit/:name', component: ProjectformComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
