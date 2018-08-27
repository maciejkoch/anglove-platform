import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuardService } from './authentication/authentication-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'topics',
    pathMatch: 'full'
  },
  {
    path: 'topics',
    loadChildren: './topics-list/topics-list.module#TopicsListPageModule',
    canActivate: [AuthenticationGuardService]
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule'
  },
  {
    path: 'topic/:id',
    loadChildren: './topic/topic.module#TopicPageModule',
    canActivate: [AuthenticationGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
