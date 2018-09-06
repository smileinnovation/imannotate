import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HAMMER_GESTURE_CONFIG } from "@angular/platform-browser";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from '@app/app-routing.module';
import { AuthInterceptor } from '@app/classes/auth.interceptor';
import { AppComponent } from '@app/app.component';
import { SignupComponent } from '@app/components/signup/signup.component';
import { SigninComponent } from '@app/components/signin/signin.component';
import { ApiService } from '@app/services/api.service';
import { UserService } from '@app/services/user.service';
import { NavbarComponent } from '@app/components/nav/navbar/navbar.component';
import { ProjectService } from '@app/services/project.service';
import { ListComponent } from '@app/components/project/list/list.component';
import { MiniviewComponent } from '@app/components/project/miniview/miniview.component';
import { AnnotatorComponent } from '@app/components/project/annotator/annotator.component';
import { ProjectformComponent } from '@app/components/project/projectform/projectform.component';
import { AboutComponent } from '@app/components/about/about.component';
import { DashboardComponent } from "@app/components/dashboard/dashboard.component";
import { AdminDashboardComponent } from '@app/components/admin/admin-dashboard/admin-dashboard.component';
import { AdminService } from "@app/services/admin.service";
import { AdminProjectComponent } from '@app/components/admin/admin-project/admin-project.component';
import { AdminUserComponent } from '@app/components/admin/admin-user/admin-user.component';
import { UserComponent } from '@app/components/user/user.component';
import { TruncatePipe } from '@app/pipe/truncate.pipe';
import { HammerConfig } from '@app/classes/hammer-config';

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
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig
    },
    ApiService,
    UserService,
    ProjectService,
    AdminService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
