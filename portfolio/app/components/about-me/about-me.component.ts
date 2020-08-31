import { Component, OnInit } from '@angular/core';
import { socials } from 'portfolio/assets/manifests/socials';

@Component({
  selector: 'about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})

export class AboutMeComponent implements OnInit {
  socials: Array<Object>;

  constructor() {
    this.socials = socials;
  }
  ngOnInit(): void {}
}
