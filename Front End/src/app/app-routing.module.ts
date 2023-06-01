import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { AccueilComponent } from './accueil/accueil.component';
import { RouterModule, Routes } from '@angular/router';
import { CoursComponent } from './cours/cours.component';
import { MessageComponent } from './message/message.component';
import { AbonnementComponent } from './abonnement/abonnement.component';



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cours', component: CoursComponent, canActivate: [AuthenticationGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'accueil', component: AccueilComponent },
  { path: 'abonnement', component: AbonnementComponent, canActivate: [AuthenticationGuard]},
  { path: 'message', component: MessageComponent, canActivate: [AuthenticationGuard] },
  { path: 'user/management', component: UserComponent, canActivate: [AuthenticationGuard] },
  { path: '', redirectTo: '/accueil', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
