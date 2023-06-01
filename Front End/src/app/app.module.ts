import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationService } from './service/authentication.service';
import { UserService } from './service/user.service';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AuthenticationGuard } from './guard/authentication.guard';
import { NotificationModule } from './notification.module';
import { NotificationService } from './service/notification.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { AccueilComponent } from './accueil/accueil.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CoursComponent } from './cours/cours.component';
import { MessageComponent } from './message/message.component';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AbonnementComponent } from './abonnement/abonnement.component';
import { BnNgIdleService } from 'bn-ng-idle';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    AccueilComponent,
    CoursComponent, 
    MessageComponent,
    AbonnementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NotificationModule,
    NgMultiSelectDropDownModule,
    [CommonModule],
    ReactiveFormsModule
  
  ],
  providers: [BnNgIdleService,NotificationService, AuthenticationGuard, AuthenticationService, UserService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {provide : LocationStrategy, useClass: HashLocationStrategy} ],
  bootstrap: [AppComponent]
})
export class AppModule { }
