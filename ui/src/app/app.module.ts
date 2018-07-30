import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './classes/auth.interceptor';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { ApiService } from './services/api.service';
import { UserService } from './services/user.service';
import { NavbarComponent } from './components/nav/navbar/navbar.component';
import { ProjectService } from './services/project.service';
import { ListComponent } from './components/project/list/list.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MiniviewComponent } from './components/project/miniview/miniview.component';
import { AnnotatorComponent } from './components/project/annotator/annotator.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectformComponent } from './components/project/projectform/projectform.component';
import { AboutComponent } from './components/about/about.component';
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminService } from "./services/admin.service";
import { AdminProjectComponent } from './components/admin/admin-project/admin-project.component';
import { AdminUserComponent } from './components/admin/admin-user/admin-user.component';
import { UserComponent } from './components/user/user.component';
import { TruncatePipe } from './pipe/truncate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    NavbarComponent,
    DashboardComponent,
    ListComponent,
    MiniviewComponent,
    AnnotatorComponent,
    ProjectformComponent,
    AboutComponent,
    AdminDashboardComponent,
    AdminProjectComponent,
    AdminUserComponent,
    UserComponent,
    TruncatePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    ApiService,
    UserService,
    ProjectService,
    AdminService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
