import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { TestBed, inject, async } from '@angular/core/testing';
import { App, Config, Platform} from 'ionic-angular';
import { CrimeFormProvider } from '../crime-form/crime-form.provider';
import * as _ from 'lodash';
import 'rxjs/add/operator/toPromise';
import { configConstants } from '../../constants/config.constants';
import { CrimeType } from '../../interfaces/crime-type.interface';

describe('Provider: CrimeForm', () => {

    let crimeFormProvider : CrimeFormProvider;
    let backend: MockBackend;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                App, Config, Platform,
                CrimeFormProvider,
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

    beforeEach(inject([CrimeFormProvider, MockBackend], (crimeFormProv: CrimeFormProvider, mockBackend: MockBackend) => {
        spyOn(console, 'error');
        crimeFormProvider = crimeFormProv;
        backend = mockBackend;
    }));

    it('should set and get location', () => {
        let location = 'location';
        crimeFormProvider.setLocation(location);
        expect(crimeFormProvider.getLocation()).toEqual(location);
    });

    it('should set and get crimeType', () => {
        let crimeType = 'crimeType';
        crimeFormProvider.setCrimeType(crimeType);
        expect(crimeFormProvider.getCrimeType()).toEqual(crimeType);
    });

    it('should reset data', () => {
        let location = 'location';
        let crimeType = 'crimeType';
        crimeFormProvider.setLocation(location);
        crimeFormProvider.setCrimeType(crimeType);
        crimeFormProvider.resetFormData();
        expect(crimeFormProvider.getCrimeType()).toBeNull;
        expect(crimeFormProvider.getCrimeType()).toBeNull;
    });

    describe('reportCrime', () => {

        beforeEach(() => {
            crimeFormProvider.setCrimeType({
                id: 1
            });
            crimeFormProvider.setLocation({
                lat: () => 1,
                lng: () => 1
            });
        });

        it('Should report crime', (done) => {
            backend.connections.subscribe((connection: MockConnection) => {
              let data = { success: true };
              let options = new ResponseOptions({
                body: data
              });
              expect(connection.request.method).toEqual(RequestMethod.Post);
              expect(connection.request.url).toEqual(configConstants.webAPI.urls.crimes.add);
              connection.mockRespond(new Response(options));
            });
    
            crimeFormProvider.reportCrime().then((response) => {
                expect(response._body.success).toBeTruthy;
                done();
            });
        });

        it('Should handle report error', (done) => {
            let error = new Error('Could not report crime');
            backend.connections.subscribe((connection: MockConnection) => {
              expect(connection.request.method).toEqual(RequestMethod.Post);
              expect(connection.request.url).toEqual(configConstants.webAPI.urls.crimes.add);
              connection.mockError(error);
            });
            crimeFormProvider.reportCrime().catch(err => {
                expect(err).toEqual(error);
                done();
            });
        });
    });

    describe('getCrimeTypes', () => {
        it('Should get crime type data', (done) => {
            let data : Array<any> = [{
                id : 1,
                name : 'name',
                value : 'value',
                gradient : '["gradient1"]'
            }];
            backend.connections.subscribe((connection: MockConnection) => {
              let options = new ResponseOptions({
                body: JSON.stringify(data)
              });
              expect(connection.request.method).toEqual(RequestMethod.Get);
              expect(connection.request.url).toEqual(configConstants.webAPI.urls.crimeTypes.get);
              connection.mockRespond(new Response(options));
            });
    
            crimeFormProvider.getCrimeTypes().then((response) => {
                expect(response).toEqual(data.map(d => {
                    d.gradient = JSON.parse(d.gradient);
                    return d;
                }));
                done();
            });
        });
    
        it('Should handle crime type data error', (done) => {
            let error = new Error('Cant get crime type data');
            backend.connections.subscribe((connection: MockConnection) => {
              expect(connection.request.method).toEqual(RequestMethod.Get);
              expect(connection.request.url).toEqual(configConstants.webAPI.urls.crimeTypes.get);
              connection.mockError(error);
            });
            crimeFormProvider.getCrimeTypes().catch(err => {
                expect(err).toEqual(error);
                done();
            });
        });
    });
});