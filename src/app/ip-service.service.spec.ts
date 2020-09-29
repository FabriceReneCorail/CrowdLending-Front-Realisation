import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';

import { IpServiceService } from './ip-service.service';

describe('IpServiceService', () => {
  let service: IpServiceService;

  let mockHttp;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IpServiceService]
    });
    service = TestBed.inject(IpServiceService);  //  service: IpServiceService = TestBed.get(IpServiceService);

    mockHttp = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have getData function', () => {

    expect(service.getIPAddress).toBeTruthy();
   });

  it('appel api.ipify.org', () => {

    const infosIp = { ip: '109.26.21.104' };

    service.getIPAddress().subscribe((resp) => {
        expect(resp).toBe(infosIp);
      });

    const mockRequest = mockHttp.expectOne('http://api.ipify.org/?format=json');

    expect(mockRequest.request.method).toBe('GET');

    mockRequest.flush(infosIp);

    mockHttp.verify();
  });
  


});
