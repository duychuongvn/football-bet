import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class NotifyService {
  constructor(private toastrService: ToastrService) { }

  public success(message: string, title?: string) {
    return this.toastrService.success(this._renderText(message), title);
  }

  public error(message: any, title?: string) {
    let msg: string;
    switch (message.constructor) {
      case String:
        msg = message;
        break;
      case Object:
        if (message.hasOwnProperty('message')) {
          msg = message.message;
          break;
        }
        break;
    }

    if (msg) {
      this.toastrService.error(this._renderText(msg), title);
    }
  }

  public info(message: string, title?: string) {
    return this.toastrService.info(this._renderText(message), title);
  }

  public warning(message: string, title?: string) {
    return this.toastrService.warning(this._renderText(message), title);
  }

  public clear() {
    this.toastrService.clear();
  }

  private _renderText(s: string): string {
    return s.replace('\n', '<br>');
  }

}
