import { TestBed, inject, async } from '@angular/core/testing';
import { App, Config, Platform, LoadingController, Loading,
         AlertOptions, AlertController, ViewController}
       from 'ionic-angular';
import { UtilsProvider } from './utils.provider';
import { AlertControllerMock } from '../mocks';
import * as _ from 'lodash';

let utils : UtilsProvider;

describe('Provider: Utils', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [

            ],
            providers: [
                App, Config, Platform,
                UtilsProvider,
                LoadingController,
                { provide: AlertController, useClass: AlertControllerMock }
            ]
        }).compileComponents();
    }));

    beforeEach(inject([UtilsProvider], (utilsProvider: UtilsProvider) => {
        spyOn(console, 'error');
        utils = utilsProvider;
    }));

    describe('cloneObj', () => {
        it('the cloned object should be equal to the parameter object', () => {
            let obj = { a: 1 };
            expect(utils.cloneObj(obj)).toEqual(obj);
        });

        it('the cloned object properties should be different from the original', () => {
            let obj = { a: 1 };
            let clone = utils.cloneObj(obj);
            obj.a = 2;
            expect(obj.a).not.toEqual((<any>clone).a);
        });
    });

    describe('createLoader', () => {
        it('should not be undefined', () => {
            expect(utils.createLoader('')).toBeDefined();
        });

        it('should have the expected methods', () => {
            let loader = utils.createLoader('');
            expect(loader.present).toBeDefined;
            expect(loader.dismiss).toBeDefined;
        });
    });

    describe('createAlertOpts', () => {
        it('should not be undefined', () => {
            expect(utils.createAlertOpts({
                title: 'title',
                subTitle: 'subtitle',
                buttons : [{ text: 'text'}],
                enableBackdropDismiss: true
            }, () => {})).toBeDefined();
        });

        it('every button should have a handler', () => {
            let handler = () => {};
            let alertOpts : AlertOptions;
            alertOpts = utils.createAlertOpts({
                title: 'title',
                subTitle: 'subtitle',
                buttons : [{ text: 'text'}],
                enableBackdropDismiss: true
            }, handler);
            expect((<any>_.head(alertOpts.buttons)).handler).toEqual(handler);
        });
    });

    describe('createAlertOpts', () => {
        it('should not be undefined', () => {
            let alertOpts = utils.createAlertOpts({
                title: 'title',
                subTitle: 'subtitle',
                buttons : [{ text: 'text'}],
                enableBackdropDismiss: true
            }, () => {});
            expect(utils.createAlert(alertOpts)).toBeDefined();
        });

        it('should return a promise', () => {
            let alertOpts = utils.createAlertOpts({
                title: 'title',
                subTitle: 'subtitle',
                buttons : [{ text: 'text'}],
                enableBackdropDismiss: true
            }, () => {});
            let alert = utils.createAlert(alertOpts);
            expect(alert.then).toBeDefined();
            expect(alert.catch).toBeDefined();
        });
    });
});