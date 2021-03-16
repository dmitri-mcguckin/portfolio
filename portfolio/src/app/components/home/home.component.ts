import { Component, OnInit } from '@angular/core';
import {Project, PmApiService} from '../../services/pm-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  home_title: string = "Dmitri McGuckin";
  projects: Project[] = [];

  constructor(private pm_api: PmApiService) {}
  ngOnInit(): void {
    this.pm_api.getAllProjects().then((projects) => {
      this.projects = projects;
    }).catch((err) => {
      console.error(err);
    });
  }
}
