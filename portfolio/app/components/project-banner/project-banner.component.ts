import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-project-banner',
  templateUrl: './project-banner.component.html',
  styleUrls: ['./project-banner.component.scss']
})

export class ProjectBannerComponent implements OnInit {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() image: string;
  @Input() projectUrl: string;
  @Input() docsUrl: string;
  backgroundImage: any;

  constructor() {}
  ngOnInit(): void {
    this.backgroundImage = {
      'background-image': 'url(' + this.image + '), linear-gradient(#a3a3a3, #a3a3a3)'
    };
  }
}
