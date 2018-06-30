import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {

  public slider = [
    'slider_01',
    'slider_03',
    'slider_04',
  ];

  constructor() { }

  ngOnInit() {
  }

}
