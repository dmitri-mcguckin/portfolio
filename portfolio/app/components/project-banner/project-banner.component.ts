import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'project-banner',
  templateUrl: './project-banner.component.html',
  styleUrls: ['./project-banner.component.scss']
})

export class ProjectBannerComponent implements OnInit {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() image: string;
  @Input() project_url: string;
  @Input() docs_url: string;
  background_image: any;

  constructor() {}
  ngOnInit(): void {
    this.background_image = {
      'background-image': "url(" + this.image + "), linear-gradient(#a3a3a3, #a3a3a3)"
    };
  }
}
