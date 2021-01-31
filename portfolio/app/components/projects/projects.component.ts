import { Component, OnInit } from '@angular/core';
import { projects } from 'portfolio/assets/manifests/projects';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})

export class ProjectsComponent implements OnInit {
  majorProjects: Array<object>;
  minorProjects: Array<object>;

  constructor() {
    this.majorProjects = projects.filter((element, index, array) => {
      return element.category === 'major';
    });

    this.minorProjects = projects.filter((element, index, array) => {
      return element.category === 'minor';
    });
  }
  ngOnInit(): void {}
}
