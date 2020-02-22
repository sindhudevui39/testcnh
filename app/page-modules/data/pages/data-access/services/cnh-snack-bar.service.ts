import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

@Injectable()
export class CnhSnackBarService {

  private _defaultDuration: number;

  public constructor(
    private snackBar: MatSnackBar,
  ) {
    this._defaultDuration = 3000;
    //
  }


  public open(message: string): MatSnackBarRef<SimpleSnackBar>;
  public open<D = any>(message: string, config?: MatSnackBarConfig<D>): MatSnackBarRef<SimpleSnackBar>;
  public open<D = any>(message: string, action?: string, config?: MatSnackBarConfig<D>): MatSnackBarRef<SimpleSnackBar>;
  public open<D = any>(
    message: string, actionOrConfig?: string | MatSnackBarConfig<D>, maybeConfig: MatSnackBarConfig<D> = {}
  ): MatSnackBarRef<SimpleSnackBar> {
    const type: string = actionOrConfig && typeof actionOrConfig;

    if ('string' === type) {
      const action = actionOrConfig as string;
      return this.snackBar.open(message, action, { duration: this._defaultDuration, ...maybeConfig });
    } else if ('object' === type) {
      const config = actionOrConfig as MatSnackBarConfig;
      return this.snackBar.open(message, '', { duration: this._defaultDuration, ...config });
    } else {
      return this.snackBar.open(message, '', { duration: this._defaultDuration, ...maybeConfig });
    }
  }

}
