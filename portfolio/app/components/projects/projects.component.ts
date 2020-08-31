import { Component, OnInit } from '@angular/core';
import { projects } from 'portfolio/assets/manifests/projects';

@Component({
  selector: 'projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})

export class ProjectsComponent implements OnInit {
  major_projects: Array<Object>;
  minor_projects: Array<Object>;

  constructor() {
    this.major_projects = projects.filter((element, _index, _array) => {
      return element.category == 'major';
    })
    this.minor_projects = projects.filter((element, _index, _array) => {
      return element.category == 'minor';
    })
  }
  ngOnInit(): void {}
}
