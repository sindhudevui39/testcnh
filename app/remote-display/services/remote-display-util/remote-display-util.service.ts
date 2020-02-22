import { Injectable, RendererFactory2, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { IEvoSocketMessage, EvoSocketEvent } from '@services/evo-socket/evo-socket.service';
import { ConnectionStatus, RdvDialogTypes, RdvSocketMessages } from '@remote-display/rdv.enums';
import { ISocketResponse } from '@remote-display/rdv.models';

@Injectable({
  providedIn: 'root'
})
export class RemoteDisplayUtilService {
  private _renderer: Renderer2;
  private _htmlBody: HTMLBodyElement;
  private _tvIframe: HTMLIFrameElement;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _rendererFactory: RendererFactory2
  ) {
    this._htmlBody = <HTMLBodyElement>this._document.getElementsByTagName('body')[0];
    this._renderer = this._rendererFactory.createRenderer(null, null);
  }

  public getUserTvVersion(maxVersion: number): number {
    let version: number;

    const minVersion = 8;

    for (let i = minVersion; i <= maxVersion; i++) {
      version = i;

      if (this.detectTeamviewer('TeamViewer' + String(i))) {
        break;
      }
    }

    return version;
  }

  public getSocketResponse(response: any): ISocketResponse {
    const socketResponse: ISocketResponse = {};

    const status: string = response.content.Status;
    const statusCode: string = response.content.StatusCode;

    if (statusCode) {
      switch (statusCode) {
        // Success - Connection URL generated
        // Success - Session Aborted TERMINATION_HOST
        case '001':
          if (status.includes(RdvSocketMessages.SUCCESS_001_1)) {
            socketResponse.launchTvApp = true;
            socketResponse.tvAppUrl = response.content.Url;
            socketResponse.updateView = true;
            socketResponse.connectionStatus = ConnectionStatus.RUNNING;
          } else if (status.includes(RdvSocketMessages.SUCCESS_001_2)) {
            socketResponse.abort = true;
            socketResponse.abortMessage = 'PAGE_RDV.TERMINATION_HOST';
          }

          break;

        // Pending - Session request accepted by the user
        case '002':
          break;

        // Failed - Unable to fetch the connection URL
        // Failed - Device is not able to process tv app
        case '003':
          socketResponse.updateView = true;
          socketResponse.connectionStatus = ConnectionStatus.FAILED;
          socketResponse.updateMessage = 'PAGE_RDV.MESSAGES.ERROR_4';

          break;

        // Failed - Vehicle is not having Remote Display Subscription
        case '004':
          socketResponse.abort = true;
          socketResponse.abortMessage = RdvDialogTypes.INACTIVE_SUBSCRIPTION;

          break;

        // Failed - Session reqeust rejected by the user
        case '005':
        // Failed - Request Timeout (When display receives notification and the user does not accept or reject)
        case '009':
          socketResponse.updateView = true;
          socketResponse.connectionStatus = ConnectionStatus.FAILED;
          socketResponse.updateMessage = 'PAGE_RDV.MESSAGES.ERROR_1';

          break;

        // Failed - Host aborted the session.
        case '006':
          socketResponse.abort = true;
          socketResponse.abortMessage = 'PAGE_RDV.TERMINATION_HOST';

          break;

        // Failed - Session terminated due to connection issues.
        case '007':
          socketResponse.updateView = true;
          socketResponse.connectionStatus = ConnectionStatus.WAITING;
          socketResponse.code = '007';

          break;

        // Failed - Client aborted the session. TERMINATION_CLIENT
        case '008':
          socketResponse.abort = true;
          socketResponse.abortMessage = 'PAGE_RDV.TERMINATION_CLIENT';

          break;

        // Failed - Session Timeout
        case '010':
          socketResponse.updateView = true;
          socketResponse.connectionStatus = ConnectionStatus.FAILED;
          socketResponse.updateMessage = 'PAGE_RDV.COULD_NOT_CONNECT';

          break;
      }
    }

    return socketResponse;
  }

  public generateRDVMessage(transactionId: string): IEvoSocketMessage {
    const subscriber = `RDV.${transactionId}`;

    const message: IEvoSocketMessage = {
      subscribers: [subscriber],
      topics: [EvoSocketEvent.FLEET_RDV]
    };

    return message;
  }

  public openTeamviewer(url: string): void {
    this._tvIframe = <HTMLIFrameElement>this._renderer.createElement('iframe');

    this._tvIframe.style.display = 'none';
    this._tvIframe.src = url;

    this._htmlBody.appendChild(this._tvIframe);
  }

  public closeTeamviewer(): void {
    if (this._tvIframe) {
      this._tvIframe.parentNode.removeChild(this._tvIframe);
      this._tvIframe = null;
    }
  }

  private detectTeamviewer(font: string): boolean {
    const span = <HTMLSpanElement>this._renderer.createElement('span');

    const fallBackFont = 'nonexistingfonttoforcedefault';

    span.style.fontSize = '72px';
    span.innerHTML = font;
    span.style.fontFamily = fallBackFont;

    this._htmlBody.appendChild(span);

    const fallBackOffsetWidth = span.offsetWidth;
    const fallBackOffsetHeight = span.offsetHeight;

    this._htmlBody.removeChild(span);

    span.style.fontFamily = `${font},${fallBackFont}`;

    this._htmlBody.appendChild(span);

    const detected =
      span.offsetWidth !== fallBackOffsetWidth || span.offsetHeight !== fallBackOffsetHeight;

    this._htmlBody.removeChild(span);

    return detected;
  }
}
