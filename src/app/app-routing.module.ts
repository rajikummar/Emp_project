import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobdemplyoeeComponent } from './jobdemplyoee/jobdemplyoee.component';

const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  redirectTo: 'employee'
},
{
path:'employee',component:JobdemplyoeeComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
