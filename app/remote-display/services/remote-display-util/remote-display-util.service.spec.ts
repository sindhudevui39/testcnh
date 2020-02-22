import { TestBed } from '@angular/core/testing';

import { RemoteDisplayUtilService } from './remote-display-util.service';

import { ConnectionStatus, RdvDialogTypes } from '@remote-display/rdv.enums';
import { IEvoSocketMessage } from '@services/evo-socket/evo-socket.service';
import { ISocketResponse } from '@remote-display/rdv.models';

describe('RemoteDisplayUtilService', () => {
  let rdvUtilService: RemoteDisplayUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RemoteDisplayUtilService]
    });

    rdvUtilService = TestBed.get(RemoteDisplayUtilService);
  });

  it('#should be created', () => expect(rdvUtilService).toBeTruthy());

  it('#should return user Teamviewer version', () =>
    expect(rdvUtilService.getUserTvVersion(20)).toBe(13));

  it('#should generate request message for Remote Display', () => {
    const message: IEvoSocketMessage = {
      subscribers: ['RDV.12345'],
      topics: ['Fleet:RemoteDisplay']
    };

    expect(rdvUtilService.generateRDVMessage('12345')).toEqual(message);
  });

  it('#should return Teamviewer url response for status code 001 :: Success - Connection URL generated', () => {
    const response: any = {
      content: {
        Status: 'Success - Connection URL generated.',
        StatusCode: '001',
        Url: 'www.teamviewer.com'
      }
    };

    const socketResponse: ISocketResponse = {
      launchTvApp: true,
      tvAppUrl: 'www.teamviewer.com',
      updateView: true,
      connectionStatus: ConnectionStatus.RUNNING
    };

    expect(rdvUtilService.getSocketResponse(response)).toEqual(socketResponse);
  });

  it('#should return abort response for status code 001 :: Success - Session Aborted ', () => {
    const response: any = {
      content: {
        Status: 'Success - Session Aborted.',
        StatusCode: '001'
      }
    };

    const socketResponse: ISocketResponse = {
      abort: true,
      abortMessage: 'PAGE_RDV.TERMINATION_HOST'
    };

    expect(rdvUtilService.getSocketResponse(response)).toEqual(socketResponse);
  });

  it('#should return empty response status code 002 :: Session request accepted by the user', () => {
    const response: any = {
      content: {
        StatusCode: '002'
      }
    };

    const socketResponse: ISocketResponse = {};

    expect(rdvUtilService.getSocketResponse(response)).toEqual(socketResponse);
  });

  it('#should return update response status code 003 :: Failed - Unable to fetch the connection URL | Failed - Device is not able to process tv app', () => {
    const response: any = {
      content: {
        StatusCode: '003'
      }
    };

    const socketResponse: ISocketResponse = {
      updateView: true,
      connectionStatus: ConnectionStatus.FAILED,
      updateMessage: 'PAGE_RDV.MESSAGES.ERROR_4'
    };

    expect(rdvUtilService.getSocketResponse(response)).toEqual(socketResponse);
  });

  it('#should return abort response status code 004 :: Failed - Vehicle is not having Remote Display Subscription', () => {
    const response: any = {
      content: {
        StatusCode: '004'
      }
    };

    const socketResponse: ISocketResponse = {
      abort: true,
      abortMessage: RdvDialogTypes.INACTIVE_SUBSCRIPTION
    };

    expect(rdvUtilService.getSocketResponse(response)).toEqual(socketResponse);
  });

  it('#should return update response status code 005 :: Failed - Session reqeust rejected by the user', () => {
    const response: any = {
      content: {
        StatusCode: '005'
      }
    };

    const socketResponse: ISocketResponse = {
      updateView: true,
      connectionStatus: ConnectionStatus.FAILED,
      updateMessage: 'PAGE_RDV.MESSAGES.ERROR_1'
    };

    expect(rdvUtilService.getSocketResponse(response)).toEqual(socketResponse);
  });

  it('#should return abort response status code 006 :: Failed - Host aborted the session.', () => {
    const response: any = {
      content: {
        StatusCode: '006'
      }
    };

    const socketResponse: ISocketResponse = {
      abort: true,
      abortMessage: 'PAGE_RDV.TERMINATION_HOST'
    };

    expect(rdvUtilService.getSocketResponse(response)).toEqual(socketResponse);
  });

  it('#should return update response status code 007 :: Failed - Session terminated due to connection issues', () => {
    const response: any = {
      content: {
        StatusCode: '007'
      }
    };

    const socketResponse: ISocketResponse = {
      updateView: true,
      connectionStatus: ConnectionStatus.WAITING,
      code: '007'
    };

    expect(rdvUtilService.getSocketResponse(response)).toEqual(socketResponse);
  });

  it('#should return abort response status code 008 :: Failed - Client aborted the session', () => {
    const response: any = {
      content: {
        StatusCode: '008'
      }
    };

    const socketResponse: ISocketResponse = {
      abort: true,
      abortMessage: 'PAGE_RDV.TERMINATION_CLIENT'
    };

    expect(rdvUtilService.getSocketResponse(response)).toEqual(socketResponse);
  });

  it('#should return update response status code 009 :: Failed - Request Timeout', () => {
    const response: any = {
      content: {
        StatusCode: '009'
      }
    };

    const socketResponse: ISocketResponse = {
      updateView: true,
      connectionStatus: ConnectionStatus.FAILED,
      updateMessage: 'PAGE_RDV.MESSAGES.ERROR_1'
    };

    expect(rdvUtilService.getSocketResponse(response)).toEqual(socketResponse);
  });

  it('#should return update response status code 010 :: Failed - Session Timeout', () => {
    const response: any = {
      content: {
        StatusCode: '010'
      }
    };

    const socketResponse: ISocketResponse = {
      updateView: true,
      connectionStatus: ConnectionStatus.FAILED,
      updateMessage: 'PAGE_RDV.MESSAGES.ERROR_3'
    };

    expect(rdvUtilService.getSocketResponse(response)).toEqual(socketResponse);
  });
});
