import { TestBed, inject, ComponentFixture, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, LoadingController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { CrimeFormPage } from './crime-form';
import { guiConstants } from '../../constants/gui.constants';
import { configConstants } from '../../constants/config.constants';
import { NavController } from 'ionic-angular';
import { CrimeFormProvider } from '../crime-form/crime-form.provider';
import { HttpModule } from '@angular/http';
import { UtilsProvider } from '../../providers/utils.provider';
import { NavMock, CrimeFormProviderMockOK, LoadingControllerMock, CrimeFormProviderMockFail } from '../../mocks';
import { LocateCrimePage } from '../locate-crime/locate-crime';
 
let comp: CrimeFormPage;
let fixture: ComponentFixture<CrimeFormPage>;
let de: DebugElement;
let el: HTMLElement;
 
describe('Page: CrimeForm Page - OK', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyApp, CrimeFormPage],
            providers: [
                { provide: NavController, useClass: NavMock },
                { provide: CrimeFormProvider, useClass: CrimeFormProviderMockOK },
                { provide: LoadingController, useClass: LoadingControllerMock },
                UtilsProvider
            ],
            imports: [
                HttpModule,
                IonicModule.forRoot(MyApp)
            ]
        }).compileComponents();
    }));
 
    beforeEach(() => {
        spyOn(console, 'error');
        fixture = TestBed.createComponent(CrimeFormPage);
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

    it('should initialize form data', (done) => {
        setTimeout(()=>{
            expect(comp.form.location).toBeNull;
            expect(comp.form.category).toEqual('value');
            done();
        }, 100)
    });

    it('should set form crime type when selection changes',
    inject([CrimeFormProvider], (crimeFormProvider: CrimeFormProvider) => {
        let selection = 'selection';
        comp.crimeTypeSelectionChanged(selection);
        expect(crimeFormProvider.getCrimeType()).toEqual(selection);
    }));

    it('should move to locate crime view when select location button is clicked',
    inject([NavController], (navCtrl: NavController) => {
        spyOn(navCtrl, 'push');
        comp.selectLocation();
        expect(navCtrl.push).toHaveBeenCalledWith(LocateCrimePage);
    }));

    it('should create alert when crime report succeeds', (done) => {
        inject([UtilsProvider], (utils: UtilsProvider) => {
            spyOn(utils, 'createAlert');
            comp.reportCrime();
            setTimeout(() => {
                expect(utils.createAlert).toHaveBeenCalledWith(comp.successAlertOpts);
                done();
            }, 100);
        })();
    });
});

describe('Page: CrimeForm Page - Fail', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyApp, CrimeFormPage],
            providers: [
                { provide: NavController, useClass: NavMock },
                { provide: CrimeFormProvider, useClass: CrimeFormProviderMockFail },
                { provide: LoadingController, useClass: LoadingControllerMock },
                UtilsProvider
            ],
            imports: [
                HttpModule,
                IonicModule.forRoot(MyApp)
            ]
        }).compileComponents();
    }));
 
    beforeEach(() => {
        spyOn(console, 'error');
        fixture = TestBed.createComponent(CrimeFormPage);
        comp    = fixture.componentInstance;
    });
 
    afterEach(() => {
        fixture.destroy();
        comp = null;
        de = null;
        el = null;
    });

    it('should not initialize form data', (done) => {
        setTimeout(()=>{
            expect(comp.form.location).toBeNull;
            expect(comp.form.category).toBeNull;
            done();
        }, 100)
    });

    it('should create alert when crime report fails', (done) => {
        inject([UtilsProvider], (utils: UtilsProvider) => {
            spyOn(utils, 'createAlert');
            comp.reportCrime();
            setTimeout(() => {
                expect(utils.createAlert).toHaveBeenCalledWith(comp.reportAlertOpts);
                done();
            }, 100);
        })();
    });
});