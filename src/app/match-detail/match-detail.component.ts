import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent implements OnInit {


  match = {id:"", awayTeam:"", homeTeam:"", rate:"", leftAmount:"", rightAmount:"", leftAddress:"", rightAddress:""};

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      console.log(params); // {order: "popular"}
      // this.match = params;
      console.log(this.match); // popular
    });
  }


  public fetchMatchDetail(match: any): any{



      return null;
  }
  

}
