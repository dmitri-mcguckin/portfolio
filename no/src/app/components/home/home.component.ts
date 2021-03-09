import { Component, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

interface Thumbnail {
  title: string;
  description: string;
  img: string;
  updated: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  home_title: string = "Dmitri McGuckin";
  thumbnails: Array<Thumbnail> = [
    {
      title: 'OreSat0 Mission Server',
      description: 'A mission server to support OreSat0',
      img: '/assets/imgs/oresat-ultra.png',
      updated: 1612219377
    },
    {
      title: 'CANOpen Monitor',
      description: 'A debug tool fopr the CAN bus',
      img: '/assets/imgs/canopen-monitor.png',
      updated: 1612219357
    },
    {
      title: 'University Class Open Ground Station',
      description: 'A groundstation for OreSat0',
      img: '/assets/imgs/oresat-flatnogs.png',
      updated: 1612218377
    },
  ];


  constructor() {}
  ngOnInit(): void {}
}
