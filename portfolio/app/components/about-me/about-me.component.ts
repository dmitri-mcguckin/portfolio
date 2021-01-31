import { Component, OnInit } from '@angular/core';
import { socials } from 'portfolio/assets/manifests/socials';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})

export class AboutMeComponent implements OnInit {
  socials: Array<object>;

  constructor() {
    this.socials = socials;
  }
  ngOnInit(): void {}
}
