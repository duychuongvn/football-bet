import { Injectable } from '@angular/core';
import { AppComponent } from '../app/app.component';
@Injectable({
  providedIn: 'root'
})
export class JhelperService {

  data_rate_json: any;
  constructor(private _app: AppComponent) { 
    

  }

  getRatesJson(){
    // this.data_rate_json = this._app.rate_data_json;
    // console.log(this._app.rate_data_json)
  }

}
