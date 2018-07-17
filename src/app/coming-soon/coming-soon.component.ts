import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit {

  public countDown = {
    text: {
      Year: '',
      Month: '',
      Weeks: '',
      Days: 'Days',
      Hours: 'Hours',
      Minutes: 'Minutes',
      Seconds: 'Seconds',
      MilliSeconds: ''
    },
    units: 'Days | Hours | Minutes | Seconds',
    end: 'July 22, 2018'
  };

  constructor() { }

  ngOnInit() {
  }

}
