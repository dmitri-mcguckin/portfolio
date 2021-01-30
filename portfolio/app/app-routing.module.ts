import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component'
import { BadukComponent } from './components/baduk/baduk.component'
import { CanopenMonitorComponent } from './components/canopen-monitor/canopen-monitor.component'
import { MissionServerComponent } from './components/mission-server/mission-server.component'
import { UniclogsGsComponent } from './components/uniclogs-gs/uniclogs-gs.component'
import { NotFoundComponent } from './components/not-found/not-found.component'

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'baduk', component: BadukComponent },
  { path: 'canopen-monitor', component: CanopenMonitorComponent },
  { path: 'mission-server', component: MissionServerComponent },
  { path: 'uniclogs-gs', component: UniclogsGsComponent },
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
