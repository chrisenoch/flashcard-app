import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { ComponentLibraryComponent } from './blog/component-library/component-library.component';
import { TourGuideDemoComponent } from './blog/tour-guide/tour-guide-demo/tour-guide-demo.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: SignInComponent },
  { path: 'component-library', component: ComponentLibraryComponent },
  { path: 'tour-guide-demo', component: TourGuideDemoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
