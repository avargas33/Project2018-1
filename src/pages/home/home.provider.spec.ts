import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { TestBed, inject, async } from '@angular/core/testing';
import { App, Config, Platform} from 'ionic-angular';
import { HomeProvider } from '../home/home.provider';
import * as _ from 'lodash';
import 'rxjs/add/operator/toPromise';
import { configConstants } from '../../constants/config.constants';
import { Crime } from '../../interfaces/crime.interface';

describe('Provider: Home', () => {

    let homeProvider : HomeProvider;
    let backend: MockBackend;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                App, Config, Platform,
                HomeProvider,
                MockBackend,
                BaseRequestOptions,
                {
                    provide: Http,
                    useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backendInstance, defaultOptions);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                }
            ]
        }).compileComponents();
    }));

    
    beforeEach(inject([HomeProvider, MockBackend], (homeProv: HomeProvider, mockBackend: MockBackend) => {
        spyOn(console, 'error');
        homeProvider = homeProv;
        backend = mockBackend;
    }));

    
    it('Should get crime data', (done) => {
        let data : Array<Crime> = [{
            id: 1,
            location: 'location',
            type: 1
        }];
        backend.connections.subscribe((connection: MockConnection) => {
          let options = new ResponseOptions({
            body: JSON.stringify(data)
          });
          expect(connection.request.method).toEqual(RequestMethod.Get);
          expect(connection.request.url).toEqual(configConstants.webAPI.urls.crimes.get);
          connection.mockRespond(new Response(options));
        });

        homeProvider.getCrimeData().then((response) => {
            expect(response).toEqual(data);
            done();
        });
    });

    it('Should handle crime data error', (done) => {
        let error = new Error('Cant get crime data');
        backend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.method).toEqual(RequestMethod.Get);
          expect(connection.request.url).toEqual(configConstants.webAPI.urls.crimes.get);
          connection.mockError(error);
        });
        homeProvider.getCrimeData().catch(err => {
            expect(err).toEqual(error);
            done();
        });
    });
});