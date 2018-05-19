import { TestBed, inject, async } from '@angular/core/testing';
import { App, Config, Platform }
       from 'ionic-angular';
import { LocationProvider } from './location.provider';
import { Geolocation, Coordinates } from '@ionic-native/geolocation';
import { GeolocationMockOK, GeolocationMockFailure } from '../mocks';

let location : LocationProvider;

describe('Provider: Location OK', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                App, Config, Platform,
                LocationProvider,
                { provide: Geolocation, useClass: GeolocationMockOK }
            ]
        }).compileComponents();
    }));

    beforeEach(inject([LocationProvider], (locationProvider: LocationProvider) => {
        spyOn(console, 'error');
        location = locationProvider;
    }));

    describe('getLastLocation', () => {
        it('should not be defined before getting device location', () => {
            expect(location.getLastLocation()).toBeUndefined;
        });
    });

    describe('getLocation', () => {
        it("should return device location", (done) => {
            location.getLocation().then(geolocation => {
                expect(geolocation).toBeDefined;
                expect(geolocation.latitude).toEqual(1);
                expect(geolocation.longitude).toEqual(1);
                done();
            });
        });
    });
});


describe('Provider: Location Error', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                App, Config, Platform,
                LocationProvider,
                { provide: Geolocation, useClass: GeolocationMockFailure }
            ]
        }).compileComponents();
    }));

    beforeEach(inject([LocationProvider], (locationProvider: LocationProvider) => {
        spyOn(console, 'error');
        location = locationProvider;
    }));

    describe('getLastLocation', () => {
        it("should handle location error", (done) => {
                location.getLocation().catch(error => {
                    expect(error).toEqual('error');
                    expect(location.getLastLocation()).toBeUndefined;
                    done();
                })
        });
    });
});