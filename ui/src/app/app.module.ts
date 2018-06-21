import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ImageAnnotatorComponent } from './image-annotator/image-annotator.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ApiService } from "./services/api.service";
import { UserService } from "./services/user.service";
import { NavbarComponent } from './nav/navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectService } from "./services/project.service";
import { ListComponent } from './project/list/list.component';
import { CreatorComponent } from './project/creator/creator.component';


@NgModule({
  declarations: [
    AppComponent,
    ImageAnnotatorComponent,
    SignupComponent,
    SigninComponent,
    NavbarComponent,
    DashboardComponent,
    ListComponent,
    CreatorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    ApiService,
    UserService,
    ProjectService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
