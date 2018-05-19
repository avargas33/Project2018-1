import { TestBed, inject, ComponentFixture, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, LoadingController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { LocateCrimePage } from './locate-crime';
import { guiConstants } from '../../constants/gui.constants';
import { configConstants } from '../../constants/config.constants';
import { NavController } from 'ionic-angular';
import { CrimeFormProvider } from '../crime-form/crime-form.provider';
import { HttpModule } from '@angular/http';
import { UtilsProvider } from '../../providers/utils.provider';
import { NavMock, CrimeFormProviderMockOK, LoadingControllerMock,
    CrimeFormProviderMockFail, LocationProviderMockOK, GmapsProviderMockOK,
    LocationProviderMockFail, 
    LocationProviderMockSemiFail} from '../../mocks';
import { GmapsProvider } from '../../providers/gmaps.provider';
import { LocationProvider } from '../../providers/location.provider';
import { Geolocation, Coordinates } from '@ionic-native/geolocation';
import { CrimeFormPage } from '../crime-form/crime-form';
 
let comp: LocateCrimePage;
let fixture: ComponentFixture<LocateCrimePage>;
let de: DebugElement;
let el: HTMLElement;
 
describe('Page: Locate Crime - OK', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyApp, LocateCrimePage],
            providers: [
                { provide: NavController, useClass: NavMock },
                { provide: CrimeFormProvider, useClass: CrimeFormProviderMockOK },
                { provide: LoadingController, useClass: LoadingControllerMock },
                UtilsProvider,
                { provide: GmapsProvider, useClass: GmapsProviderMockOK },
                { provide: LocationProvider, useClass: LocationProviderMockOK },
                Geolocation
            ],
            imports: [
                HttpModule,
                IonicModule.forRoot(MyApp)
            ]
        }).compileComponents();
    }));
 
    beforeEach(() => {
        spyOn(console, 'error');
        fixture = TestBed.createComponent(LocateCrimePage);
        comp    = fixture.componentInstance;
    });
 
    afterEach(() => {
        fixture.destroy();
        comp = null;
        de = null;
        el = null;
    });
 
    it('should be created', () => {
        expect(fixture).toBeTruthy();
        expect(comp).toBeTruthy();
    });

    it('should initialize data', (done) => {
        setTimeout(() => {
            expect(comp.tags).toEqual(guiConstants.locateCrime);
            expect(comp.location).toBeNull;
            expect(comp.icon).toEqual('icon');
            done();
        }, 100);
    });

    describe('ionViewDidEnter', () => {
        it('should create map after view loads', (done) => {
            inject([GmapsProvider], (gmaps: GmapsProvider) => {
                expect(comp.map).toBeUndefined;
                let bindSpy = spyOn(gmaps, 'bindEvent');
                spyOn(gmaps, 'addUserPositionMarker');
                spyOn(gmaps, 'addMarker');
                comp.ionViewDidEnter();
                setTimeout(() => {
                    expect(comp.map).toEqual('map');
                    expect(bindSpy.calls.mostRecent().args[0]).toEqual('map');
                    expect(bindSpy.calls.mostRecent().args[1]).toEqual('click');
                    expect(gmaps.addUserPositionMarker).toHaveBeenCalledWith('map', 'latlng');
                    expect(gmaps.addMarker).not.toHaveBeenCalled();
                    expect(comp.locationMarker).toBeUndefined;
                    done();
                }, 100);
            })();
        });

        it('should use device location as center if location is not defined', (done) => {
            inject([GmapsProvider], (gmaps: GmapsProvider) => {
                let createSpy = spyOn(gmaps, 'createMap');
                comp.ionViewDidEnter();
                setTimeout(() => {
                    expect(createSpy.calls.mostRecent().args[1]).toEqual({
                        latitude: 'latitude', longitude: 'longitude'
                    });
                    done();
                }, 100);
            })();
        });

        it('should use selected location as center when defined', (done) => {
            inject([GmapsProvider], (gmaps: GmapsProvider) => {
                let createSpy = spyOn(gmaps, 'createMap');
                comp.location = { lat: () => 1, lng: () => 1};
                comp.ionViewDidEnter();
                setTimeout(() => {
                    expect(createSpy.calls.mostRecent().args[1]).toEqual({
                        latitude: 1, longitude: 1
                    });
                    expect(comp.locationMarker).toEqual('marker');
                    done();
                }, 100);
            })();
        });
    });

    describe('locationSelected', () => {
        it('should add a new marker when a crime location is selected', (done) => {
            inject([GmapsProvider], (gmaps: GmapsProvider) => {
                let bindSpy = spyOn(gmaps, 'bindEvent');
                comp.locationMarker = {
                    setMap: () => {}
                };
                let setMapSpy = spyOn(comp.locationMarker, 'setMap');
                comp.ionViewDidEnter();
                setTimeout(() => {
                    bindSpy.calls.mostRecent().args[2]({ latLng: 'latLng' });
                    expect(setMapSpy).toHaveBeenCalledWith(null);
                    expect(comp.locationMarker).toEqual('marker');
                    done();
                }, 100);
            })();
        });
    });

    describe('locationConfirmed', () => {
        it('should ', inject([CrimeFormProvider, NavController], (crimeForm: CrimeFormProvider, nav : NavController) => {
            comp.locationMarker = {
                position: 'position'
            };
            spyOn(nav, 'setRoot');
            comp.locationConfirmed();
            expect(crimeForm.getLocation()).toEqual('position');
            expect(nav.setRoot).toHaveBeenCalledWith(CrimeFormPage);
        }));
    });
});

describe('Page: Locate Crime - Device Location fails but previous exists', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyApp, LocateCrimePage],
            providers: [
                { provide: NavController, useClass: NavMock },
                { provide: CrimeFormProvider, useClass: CrimeFormProviderMockOK },
                { provide: LoadingController, useClass: LoadingControllerMock },
                UtilsProvider,
                { provide: GmapsProvider, useClass: GmapsProviderMockOK },
                { provide: LocationProvider, useClass: LocationProviderMockSemiFail },
                Geolocation
            ],
            imports: [
                HttpModule,
                IonicModule.forRoot(MyApp)
            ]
        }).compileComponents();
    }));
 
    beforeEach(() => {
        spyOn(console, 'error');
        fixture = TestBed.createComponent(LocateCrimePage);
        comp    = fixture.componentInstance;
    });
 
    afterEach(() => {
        fixture.destroy();
        comp = null;
        de = null;
        el = null;
    });

    describe('ionViewDidEnter', () => {
        it('should use device location as center if location is not defined', (done) => {
            inject([GmapsProvider], (gmaps: GmapsProvider) => {
                let createSpy = spyOn(gmaps, 'createMap');
                expect(comp.map).toBeUndefined;
                comp.ionViewDidEnter();
                setTimeout(() => {
                    expect(createSpy.calls.mostRecent().args[1]).toEqual({
                        latitude: 'lastLatitude', longitude: 'lastLongitude'
                    });
                    done();
                }, 100);
            })();
        });
    });
});

describe('Page: Locate Crime - Device Location fails completely', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyApp, LocateCrimePage],
            providers: [
                { provide: NavController, useClass: NavMock },
                { provide: CrimeFormProvider, useClass: CrimeFormProviderMockOK },
                { provide: LoadingController, useClass: LoadingControllerMock },
                UtilsProvider,
                { provide: GmapsProvider, useClass: GmapsProviderMockOK },
                { provide: LocationProvider, useClass: LocationProviderMockFail },
                Geolocation
            ],
            imports: [
                HttpModule,
                IonicModule.forRoot(MyApp)
            ]
        }).compileComponents();
    }));
 
    beforeEach(() => {
        spyOn(console, 'error');
        fixture = TestBed.createComponent(LocateCrimePage);
        comp    = fixture.componentInstance;
    });
 
    afterEach(() => {
        fixture.destroy();
        comp = null;
        de = null;
        el = null;
    });

    describe('ionViewDidEnter', () => {
        it('should show an error alert and dont create the map', (done) => {
            inject([UtilsProvider], (utils: UtilsProvider) => {
                spyOn(utils, 'createAlert');
                comp.ionViewDidEnter();
                setTimeout(() => {
                    expect(comp.map).toBeUndefined;
                    expect(utils.createAlert).toHaveBeenCalledWith(comp.locationAlertOpts);
                    done();
                }, 100);
            })();
        });
    });
});