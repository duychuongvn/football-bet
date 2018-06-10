import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Fixture } from '../../models/fixture';

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent implements OnInit {


  public fixtures: Fixture[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      

    });
  }


  

}
