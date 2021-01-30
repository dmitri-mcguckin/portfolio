import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { CanopenMonitorComponent } from './components/canopen-monitor/canopen-monitor.component';
import { ProjectBannerComponent } from './components/project-banner/project-banner.component';
import { UniclogsGsComponent } from './components/uniclogs-gs/uniclogs-gs.component';
import { MissionServerComponent } from './components/mission-server/mission-server.component';
import { BadukComponent } from './components/baduk/baduk.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    AboutMeComponent,
    NotFoundComponent,
    HomeComponent,
    CanopenMonitorComponent,
    ProjectBannerComponent,
    UniclogsGsComponent,
    MissionServerComponent,
    BadukComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
