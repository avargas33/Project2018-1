import { TestBed, inject, ComponentFixture, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, LoadingController, AlertController, ViewController, Loading, Alert, Platform } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { HomePage } from './home';
import { guiConstants } from '../../constants/gui.constants';
import { configConstants } from '../../constants/config.constants';
import { NavController } from 'ionic-angular';
import { CrimeFormProvider } from '../crime-form/crime-form.provider';
import { HttpModule } from '@angular/http';
import { UtilsProvider } from '../../providers/utils.provider';
import { NavMock, CrimeFormProviderMockOK, LoadingControllerMock,
    CrimeFormProviderMockFail, LocationProviderMockOK, GmapsProviderMockOK,
    LocationProviderMockFail, HomeProviderMockOK, LocationProviderMockSemiFail,
    HomeProviderMockFail, ViewControllerMock, AlertControllerMock,
    PlatformMockMobile, AndroidPermissionsMockOK} from '../../mocks';
import { GmapsProvider } from '../../providers/gmaps.provider';
import { LocationProvider } from '../../providers/location.provider';
import { Geolocation, Coordinates } from '@ionic-native/geolocation';
import { CrimeFormPage } from '../crime-form/crime-form';
import { HomeProvider } from './home.provider';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { notDeepEqual } from 'assert';
 
let comp: HomePage;
let fixture: ComponentFixture<HomePage>;
let de: DebugElement;
let el: HTMLElement;
 
describe('Page: Home - Crimes OK - CrimeTypes - OK - Platform OK - Android OK - Location OK', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyApp, HomePage],
            providers: [
                { provide: NavController, useClass: NavMock },
                { provide: CrimeFormProvider, useClass: CrimeFormProviderMockOK },
                { provide: LoadingController, useClass: LoadingControllerMock },
                { provide: GmapsProvider, useClass: GmapsProviderMockOK },
                { provide: LocationProvider, useClass: LocationProviderMockOK },
                { provide: HomeProvider, useClass: HomeProviderMockOK },
                AndroidPermissions, UtilsProvider, Geolocation,
            ],
            imports: [
                HttpModule,
                IonicModule.forRoot(MyApp)
            ]
        }).compileComponents();
    }));
 
    beforeEach(() => {
        spyOn(console, 'error');
        fixture = TestBed.createComponent(HomePage);
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
            expect(comp.tags).toEqual(guiConstants.home);
            expect(comp.mapTypes.length).toEqual(2);
            expect(comp.currentMap).not.toBeNull;
            expect(comp.loadingLocation).not.toBeNull;
            expect(comp.loadingCrimeData).not.toBeNull;
            expect(comp.locationAlertOpts).not.toBeNull;
            expect(comp.crimeAlertOpts).not.toBeNull;
            done();
        }, 100);
    });

    describe('reportCrime', () => {
        it('should go to crime form page', inject([NavController], (nav : NavController) => {
            spyOn(nav, 'setRoot');
            comp.reportCrime();
            expect(nav.setRoot).toHaveBeenCalledWith(CrimeFormPage);
        }));
    });

    describe('toggleMapType', () => {
        it('should create alert', inject([AlertController], (alert : AlertController) => {
            let alertSpy = spyOn(alert, 'create').and.returnValue({
                present: () => {}
            });
            comp.toggleMapType();
            let callOpts = alertSpy.calls.mostRecent().args[0];
            expect(callOpts.title).toEqual(guiConstants.alert.mapTypes.title);
            expect(callOpts.inputs.length).toEqual(2);
            expect(callOpts.inputs[0].type).toEqual('radio');
            expect(callOpts.inputs[1].type).toEqual('radio');
            expect(callOpts.buttons.length).toEqual(1);
            expect(callOpts.buttons[0].text).toEqual(guiConstants.alert.mapTypes.button.text);
        }));
    });

    describe('onChangeMapType', () => {
        it('should do nothing if map is already selected', (done) => {
            inject([AlertController], (alert : AlertController) => {
                setTimeout(() => {
                    spyOn(comp.currentMap, 'destroy');
                    let alertSpy = spyOn(alert, 'create').and.returnValue({
                        present: () => {}
                    });
                    comp.toggleMapType();
                    let onChangeMapType = alertSpy.calls.mostRecent().args[0].buttons[0].handler;
                    onChangeMapType(configConstants.mapTypes.heat.name);
                    expect(comp.currentMap.destroy).not.toHaveBeenCalled();
                    done();
                }, 100);
            })();
        });

        it('should destroy the original map if another one is selected', (done) => {
            inject([AlertController], (alert : AlertController) => {
                setTimeout(() => {
                    let createSpy = spyOn(comp.mapTypes[1], 'create');
                    let destroySpy = spyOn(comp.currentMap, 'destroy');
                    let alertSpy = spyOn(alert, 'create').and.returnValue({
                        present: () => {}
                    });
                    comp.toggleMapType();
                    let onChangeMapType = alertSpy.calls.mostRecent().args[0].buttons[0].handler;
                    onChangeMapType(configConstants.mapTypes.info.name);
                    expect(createSpy).toHaveBeenCalled();
                    expect(destroySpy).toHaveBeenCalled();
                    done();
                }, 100);
            })();
        });
    });

    describe('toggleCrimeFilter', () => {
        it('should create alert', inject([AlertController], (alert : AlertController) => {
            let alertSpy = spyOn(alert, 'create').and.returnValue({
                present: () => {}
            });
            comp.crimeTypes = [{
                id: 1,
                name: 'name',
                value: 'value',
                gradient: [],
                data: [],
                checked: true
            }]
            comp.toggleCrimeFilter();
            let callOpts = alertSpy.calls.mostRecent().args[0];
            expect(callOpts.title).toEqual(guiConstants.alert.crimeFilter.title);
            expect(callOpts.inputs.length).toEqual(comp.crimeTypes.length);
            expect(callOpts.inputs[0].type).toEqual('checkbox');
            expect(callOpts.buttons.length).toEqual(1);
            expect(callOpts.buttons[0].text).toEqual(guiConstants.alert.crimeFilter.button.text);
        }));
    });

    describe('onChangeCrimeFilter', () => {
        it('should do nothing if filters were not changed', (done) => {
            inject([AlertController], (alert : AlertController) => {
                setTimeout(() => {
                    let alertSpy = spyOn(alert, 'create').and.returnValue({
                        present: () => {}
                    });
                    comp.crimeTypes = [{
                        id: 1,
                        name: 'name',
                        value: 'value',
                        gradient: [],
                        data: [],
                        checked: true
                    }];
                    spyOn(comp.currentMap, 'update');
                    comp.toggleCrimeFilter();
                    let onChangeCrimeFilter = alertSpy.calls.mostRecent().args[0].buttons[0].handler;
                    onChangeCrimeFilter(['value']);
                    expect(comp.currentMap.update).not.toHaveBeenCalled();
                    done();
                }, 100);
            })();
        });

        it('should update the current map with the new filters', (done) => {
            inject([AlertController], (alert : AlertController) => {
                setTimeout(() => {
                    let alertSpy = spyOn(alert, 'create').and.returnValue({
                        present: () => {}
                    });
                    comp.crimeTypes = [{
                        id: 1,
                        name: 'name',
                        value: 'value',
                        gradient: [],
                        data: [],
                        checked: false
                    }];
                    spyOn(comp.currentMap, 'update');
                    comp.toggleCrimeFilter();
                    let onChangeCrimeFilter = alertSpy.calls.mostRecent().args[0].buttons[0].handler;
                    onChangeCrimeFilter(['value']);
                    expect(comp.currentMap.update).toHaveBeenCalledWith(comp.crimeTypes[0]);
                    done();
                }, 100);
            })();
        });
    });

    describe('centerLocation', () => {
        it('should center the map according to user position', () => {
            let userPosition = 'userPosition';
            comp.userPosition = {
                getPosition: () => userPosition
            };
            comp.map = {
                setCenter: () => {}
            };
            spyOn(comp.map, 'setCenter');
            comp.centerLocation();
            expect(comp.map.setCenter).toHaveBeenCalledWith(userPosition);
        })
    });

    describe('updateCrimes', () => {
        it('should create current map if both crimes and crime types are returned successfully', (done) => {
            inject([AlertController], (alert : AlertController) => {
                setTimeout(() => {
                    let destroySpy = spyOn(comp.currentMap, 'destroy');
                    let createSpy =  spyOn(comp.currentMap, 'create');
                    comp.updateCrimes();
                    expect(destroySpy).toHaveBeenCalled();
                    setTimeout(() => {
                        expect(comp.crimes).not.toBeNull();
                        expect(comp.crimes).not.toBeUndefined();
                        expect(comp.crimeTypes).not.toBeNull();
                        expect(comp.crimeTypes).not.toBeUndefined();
                        expect(createSpy).toHaveBeenCalled();
                        done();
                    }, 100);
                }, 100);
            })();
        });
    });
});

describe('Page: Home - Crimes Fail - CrimeTypes OK', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyApp, HomePage],
            providers: [
                { provide: NavController, useClass: NavMock },
                { provide: CrimeFormProvider, useClass: CrimeFormProviderMockOK },
                { provide: LoadingController, useClass: LoadingControllerMock },
                { provide: GmapsProvider, useClass: GmapsProviderMockOK },
                { provide: LocationProvider, useClass: LocationProviderMockOK },
                { provide: HomeProvider, useClass: HomeProviderMockFail },
                { provide: AlertController, useClass: AlertControllerMock },
                AndroidPermissions, UtilsProvider, Geolocation
            ],
            imports: [
                HttpModule,
                IonicModule.forRoot(MyApp)
            ]
        }).compileComponents();
    }));
 
    beforeEach(() => {
        spyOn(console, 'error');
        fixture = TestBed.createComponent(HomePage);
        comp    = fixture.componentInstance;
    });
 
    afterEach(() => {
        fixture.destroy();
        comp = null;
        de = null;
        el = null;
    });
 
    describe('updateCrimes', () => {
        it('should not create current map if crime data is not returned', (done) => {
            setTimeout(() => {
                let destroySpy = spyOn(comp.currentMap, 'destroy');
                let createSpy =  spyOn(comp.currentMap, 'create');
                comp.updateCrimes();
                expect(destroySpy).toHaveBeenCalled();
                setTimeout(() => {
                    expect(comp.crimes).toBeUndefined();
                    expect(comp.crimeTypes).toBeUndefined();
                    expect(createSpy).not.toHaveBeenCalled();
                    done();
                }, 100);
            }, 100);
        });
    });
});

describe('Page: Home - Crimes OK - CrimeTypes - Fail', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyApp, HomePage],
            providers: [
                { provide: NavController, useClass: NavMock },
                { provide: CrimeFormProvider, useClass: CrimeFormProviderMockFail },
                { provide: LoadingController, useClass: LoadingControllerMock },
                { provide: GmapsProvider, useClass: GmapsProviderMockOK },
                { provide: LocationProvider, useClass: LocationProviderMockOK },
                { provide: HomeProvider, useClass: HomeProviderMockOK },
                { provide: AlertController, useClass: AlertControllerMock },
                AndroidPermissions, UtilsProvider, Geolocation
            ],
            imports: [
                HttpModule,
                IonicModule.forRoot(MyApp)
            ]
        }).compileComponents();
    }));
 
    beforeEach(() => {
        spyOn(console, 'error');
        fixture = TestBed.createComponent(HomePage);
        comp    = fixture.componentInstance;
    });
 
    afterEach(() => {
        fixture.destroy();
        comp = null;
        de = null;
        el = null;
    });
 
    describe('updateCrimes', () => {
        it('should not create current map if crime types data is not returned', (done) => {
            setTimeout(() => {
                let destroySpy = spyOn(comp.currentMap, 'destroy');
                let createSpy =  spyOn(comp.currentMap, 'create');
                comp.updateCrimes();
                expect(destroySpy).toHaveBeenCalled();
                setTimeout(() => {
                    expect(comp.crimes).not.toBeNull();
                    expect(comp.crimes).not.toBeUndefined();
                    expect(comp.crimeTypes).toBeUndefined();
                    expect(createSpy).not.toHaveBeenCalled();
                    done();
                }, 100);
            }, 100);
        });
    });
});

describe('Page: Home - ionViewDidEnter', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyApp, HomePage],
            providers: [
                { provide: NavController, useClass: NavMock },
                { provide: CrimeFormProvider, useClass: CrimeFormProviderMockFail },
                { provide: LoadingController, useClass: LoadingControllerMock },
                { provide: GmapsProvider, useClass: GmapsProviderMockOK },
                { provide: LocationProvider, useClass: LocationProviderMockOK },
                { provide: HomeProvider, useClass: HomeProviderMockOK },
                { provide: AlertController, useClass: AlertControllerMock },
                { provide: AndroidPermissions, useClass: AndroidPermissionsMockOK },
                UtilsProvider, Geolocation
            ],
            imports: [
                HttpModule,
                IonicModule.forRoot(MyApp)
            ]
        }).compileComponents();
    }));
 
    beforeEach(() => {
        spyOn(console, 'error');
        fixture = TestBed.createComponent(HomePage);
        comp    = fixture.componentInstance;
    });
 
    afterEach(() => {
        fixture.destroy();
        comp = null;
        de = null;
        el = null;
    });

    it('should create map when everything works correctly', (done) => {
        inject([Platform, AndroidPermissions], (platform : Platform, android : AndroidPermissions) => {
            let readySpy = spyOn(platform, 'ready').and.returnValue(Promise.resolve());
            let isSpy = spyOn(platform, 'is').and.returnValue(true);
            let permissionSpy = spyOn(android, 'checkPermission').and.returnValue(Promise.resolve());
            comp.ionViewDidEnter();
            setTimeout(() => {
                expect(comp.map).not.toBeUndefined();
                expect(comp.map).not.toBeUndefined();
                expect(comp.userPosition).not.toBeUndefined();
                expect(comp.userPosition).not.toBeUndefined();
                expect(permissionSpy).toHaveBeenCalled();
                done();
            }, 100);
        })();
    });

    it('should create map without asking permissions if its not mobile', (done) => {
        inject([Platform, AndroidPermissions], (platform : Platform, android : AndroidPermissions) => {
            let readySpy = spyOn(platform, 'ready').and.returnValue(Promise.resolve());
            let isSpy = spyOn(platform, 'is').and.returnValue(false);
            let permissionSpy = spyOn(android, 'checkPermission');
            comp.ionViewDidEnter();
            setTimeout(() => {
                expect(comp.map).not.toBeUndefined();
                expect(comp.map).not.toBeUndefined();
                expect(comp.userPosition).not.toBeUndefined();
                expect(comp.userPosition).not.toBeUndefined();
                expect(permissionSpy).not.toHaveBeenCalled();
                done();
            }, 100);
        })();
    });

    it('should create map if requested permissions are granted', (done) => {
        inject([Platform, AndroidPermissions], (platform : Platform, android : AndroidPermissions) => {
            let readySpy = spyOn(platform, 'ready').and.returnValue(Promise.resolve());
            let isSpy = spyOn(platform, 'is').and.returnValue(true);
            let permissionSpy = spyOn(android, 'checkPermission').and.returnValue(Promise.reject('error'));
            let requestSpy = spyOn(android, 'requestPermission').and.returnValue(Promise.resolve());
            comp.ionViewDidEnter();
            setTimeout(() => {
                expect(comp.map).not.toBeUndefined();
                expect(comp.map).not.toBeUndefined();
                expect(comp.userPosition).not.toBeUndefined();
                expect(comp.userPosition).not.toBeUndefined();
                expect(permissionSpy).toHaveBeenCalled();
                done();
            }, 100);
        })();
    });

    it('should not create map if requested permissions are not granted', (done) => {
        inject([Platform, AndroidPermissions], (platform : Platform, android : AndroidPermissions) => {
            let readySpy = spyOn(platform, 'ready').and.returnValue(Promise.resolve());
            let isSpy = spyOn(platform, 'is').and.returnValue(true);
            let permissionSpy = spyOn(android, 'checkPermission').and.returnValue(Promise.reject('error'));
            let requestSpy = spyOn(android, 'requestPermission').and.returnValue(Promise.reject('error'));
            comp.ionViewDidEnter();
            setTimeout(() => {
                expect(comp.map).toBeUndefined();
                expect(comp.map).toBeUndefined();
                expect(comp.userPosition).toBeUndefined();
                expect(comp.userPosition).toBeUndefined();
                expect(permissionSpy).toHaveBeenCalled();
                done();
            }, 100);
        })();
    });
});

describe('Page: Home - Location Fail', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyApp, HomePage],
            providers: [
                { provide: NavController, useClass: NavMock },
                { provide: CrimeFormProvider, useClass: CrimeFormProviderMockFail },
                { provide: LoadingController, useClass: LoadingControllerMock },
                { provide: GmapsProvider, useClass: GmapsProviderMockOK },
                { provide: LocationProvider, useClass: LocationProviderMockFail },
                { provide: HomeProvider, useClass: HomeProviderMockOK },
                { provide: AlertController, useClass: AlertControllerMock },
                { provide: AndroidPermissions, useClass: AndroidPermissionsMockOK },
                UtilsProvider, Geolocation
            ],
            imports: [
                HttpModule,
                IonicModule.forRoot(MyApp)
            ]
        }).compileComponents();
    }));
 
    beforeEach(() => {
        spyOn(console, 'error');
        fixture = TestBed.createComponent(HomePage);
        comp    = fixture.componentInstance;
    });
 
    afterEach(() => {
        fixture.destroy();
        comp = null;
        de = null;
        el = null;
    });

    it('should not create map when the location fails', (done) => {
        inject([Platform, AndroidPermissions], (platform : Platform, android : AndroidPermissions) => {
            let readySpy = spyOn(platform, 'ready').and.returnValue(Promise.resolve());
            let isSpy = spyOn(platform, 'is').and.returnValue(true);
            let permissionSpy = spyOn(android, 'checkPermission').and.returnValue(Promise.resolve());
            comp.ionViewDidEnter();
            setTimeout(() => {
                expect(comp.map).toBeUndefined();
                expect(comp.map).toBeUndefined();
                expect(comp.userPosition).toBeUndefined();
                expect(comp.userPosition).toBeUndefined();
                expect(permissionSpy).toHaveBeenCalled();
                done();
            }, 100);
        })();
    });
});

describe('Page: Home - Maptypes', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyApp, HomePage],
            providers: [
                { provide: NavController, useClass: NavMock },
                { provide: CrimeFormProvider, useClass: CrimeFormProviderMockOK },
                { provide: LoadingController, useClass: LoadingControllerMock },
                { provide: GmapsProvider, useClass: GmapsProviderMockOK },
                { provide: LocationProvider, useClass: LocationProviderMockOK },
                { provide: HomeProvider, useClass: HomeProviderMockOK },
                AndroidPermissions, UtilsProvider, Geolocation,
            ],
            imports: [
                HttpModule,
                IonicModule.forRoot(MyApp)
            ]
        }).compileComponents();
    }));
 
    beforeEach(() => {
        spyOn(console, 'error');
        fixture = TestBed.createComponent(HomePage);
        comp    = fixture.componentInstance;
    });
 
    afterEach(() => {
        fixture.destroy();
        comp = null;
        de = null;
        el = null;
    });

    describe('heat', () => {
        it('should create map', (done) => {
            setTimeout(() => {
                let heatmap = comp.mapTypes[0];
                comp.crimeTypes = [{
                    id: 1,
                    name: 'name',
                    value: 'value',
                    gradient: [],
                    data: [],
                    checked: true
                }];
                heatmap.create();
                expect(comp.title).toEqual(comp.tags.title.heat);
                expect(comp.crimeTypes[0].heatmap).not.toBeUndefined();
                expect(comp.crimeTypes[0].heatmap).not.toBeNull();
                done();
            }, 100);
        });

        it('should hide map if updated when the map is checked', (done) => {
            setTimeout(() => {
                let heatmap = comp.mapTypes[0];
                let changedType = {
                    heatmap: {
                        setMap: () => {}
                    },
                    checked: true
                }
                spyOn(changedType.heatmap, 'setMap');
                heatmap.update(changedType);
                expect(changedType.heatmap.setMap).toHaveBeenCalledWith(null);
                done();
            }, 100);
        });

        it('should show map if updated when the map is not checked', (done) => {
            setTimeout(() => {
                let heatmap = comp.mapTypes[0];
                let changedType = {
                    heatmap: {
                        setMap: () => {}
                    },
                    checked: false
                }
                spyOn(changedType.heatmap, 'setMap');
                heatmap.update(changedType);
                expect(changedType.heatmap.setMap).toHaveBeenCalledWith(comp.map);
                done();
            }, 100);
        });

        it('should destroy map', (done) => {
            setTimeout(() => {
                let heatmap = comp.mapTypes[0];
                comp.crimeTypes = [{
                    id: 1,
                    name: 'name',
                    value: 'value',
                    gradient: [],
                    data: [],
                    checked: true,
                    heatmap: {
                        setMap: () => {}
                    }
                }];
                heatmap.destroy();
                expect(comp.crimeTypes[0].heatmap).toBeNull();
                done();
            }, 100);
        });
    });

    describe('info', () => {
        it('should create map', (done) => {
            setTimeout(() => {
                let infomap = comp.mapTypes[1];
                comp.crimeTypes = [{
                    id: 1,
                    name: 'name',
                    value: 'value',
                    gradient: [],
                    data: [],
                    markers: [{
                        setMap: () => {}
                    }],
                    checked: true
                }];
                spyOn(comp.crimeTypes[0].markers[0], 'setMap');
                infomap.create();
                expect(comp.title).toEqual(comp.tags.title.info);
                expect(comp.crimeTypes[0].markers[0].setMap).toHaveBeenCalledWith(comp.map);
                expect(comp.crimeTypes[0].infoWindows).not.toBeNull();
                expect(comp.crimeTypes[0].infoWindows).not.toBeUndefined();
                expect(comp.crimeTypes[0].infoWindows.length).toEqual(comp.crimeTypes[0].markers.length);
                done();
            }, 100);
        });

        it('should hide all markers and infowindows if updated when the map is checked', (done) => {
            setTimeout(() => {
                let infomap = comp.mapTypes[1];
                let changedType = {
                    markers: [{
                        setMap: () => {}
                    }],
                    infoWindows: [{
                        close: () => {}
                    }],
                    checked: true
                };
                spyOn(changedType.markers[0], 'setMap');
                spyOn(changedType.infoWindows[0], 'close');
                infomap.update(changedType);
                expect(changedType.markers[0].setMap).toHaveBeenCalledWith(null);
                expect(changedType.infoWindows[0].close).toHaveBeenCalled();
                done();
            }, 100);
        });

        it('should show all markers and infowindows if updated when the map is checked', (done) => {
            setTimeout(() => {
                let infomap = comp.mapTypes[1];
                let changedType = {
                    markers: [{
                        setMap: () => {}
                    }],
                    infoWindows: [{
                        close: () => {}
                    }],
                    checked: false
                };
                spyOn(changedType.markers[0], 'setMap');
                infomap.update(changedType);
                expect(changedType.markers[0].setMap).toHaveBeenCalledWith(comp.map);
                expect(changedType.infoWindows.length).toEqual(changedType.markers.length);
                done();
            }, 100);
        });

        it('should hide all markers and infowindows when map is destroyed', (done) => {
            setTimeout(() => {
                let infomap = comp.mapTypes[1];
                comp.crimeTypes = [{
                    id: 1,
                    name: 'name',
                    value: 'value',
                    gradient: [],
                    data: [],
                    markers: [{
                        setMap: () => {}
                    }],
                    infoWindows: [{
                        close: () => {}
                    }],
                    checked: true
                }];
                spyOn(comp.crimeTypes[0].markers[0], 'setMap');
                spyOn(comp.crimeTypes[0].infoWindows[0], 'close');
                infomap.destroy();
                expect(comp.crimeTypes[0].markers[0].setMap).toHaveBeenCalledWith(null);
                expect(comp.crimeTypes[0].infoWindows[0].close).toHaveBeenCalled();
                done();
            }, 100);
        });
    });
});