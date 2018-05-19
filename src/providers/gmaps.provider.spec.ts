import { TestBed, inject, async } from '@angular/core/testing';
import { App, Config, Platform, LoadingController, Loading,
         AlertOptions, AlertController, ViewController}
       from 'ionic-angular';
import { GmapsProvider } from './gmaps.provider';
import { AlertControllerMock } from '../mocks';
import * as _ from 'lodash';
import { markParentViewsForCheck } from '@angular/core/src/view/util';
import { guiConstants } from '../constants/gui.constants';

let gmaps : GmapsProvider;
declare var google;

describe('Provider: Utils', () => {

    const testConfig = {
        map: 'map',
        latitude: 'latitude',
        longitude: 'longitude',
        zoom: 'zoom',
        type: 'type',
        position: 'position',
        icon: 'icon',
        marker: 'marker',
        content: 'content',
        data: 'data',
        gradient: 'gradient',
        radius: 20,
        event: 'event'
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                App, Config, Platform,
                GmapsProvider
            ]
        }).compileComponents();
    }));

    beforeEach(inject([GmapsProvider], (gmapsProvider: GmapsProvider) => {
        spyOn(console, 'error');
        gmaps = gmapsProvider;
    }));

    describe('createMap', () => {
        it('should return a newly created map', () =>  {
            let map = gmaps.createMap(testConfig.map, { 
                latitude: testConfig.latitude,
                longitude: testConfig.longitude
            }, testConfig.zoom, testConfig.type);
            expect(map.map).toEqual(testConfig.map);
            expect(map.opts.center.latitude).toEqual(testConfig.latitude);
            expect(map.opts.center.longitude).toEqual(testConfig.longitude);
        })
    });

    describe('addMarker', () => {
        it('should return a newly created marker with no icon', () =>  {
            let marker = gmaps.addMarker(testConfig.map, testConfig.position);
            expect(marker.data.map).toEqual(testConfig.map);
            expect(marker.data.position).toEqual(testConfig.position);
            expect(marker.data.icon).toBeUndefined;
        });

        it('should return a newly created marker with icon', () =>  {
            let marker = gmaps.addMarker(testConfig.map, testConfig.position, testConfig.icon);
            expect(marker.data.icon).toEqual(testConfig.icon);
        });
    });

    describe('addInfoWindow', () => {
        it('should return a newly created info window', () =>  {
            let infoWindow = gmaps.addInfoWindow(testConfig.map, testConfig.marker, testConfig.content);
            expect(infoWindow.data.content).toEqual(testConfig.content);
        });
    });

    describe('createHeatMap', () => {
        it('should return a newly created heat map', () =>  {
            let heatMap = gmaps.createHeatMap(testConfig.map, testConfig.data, testConfig.gradient);
            expect(heatMap.data.data).toEqual(testConfig.data);
            expect(heatMap.data.radius).toEqual(testConfig.radius);
            expect(heatMap.map).toEqual(testConfig.map);
        });
    });

    describe('createLatLngObj', () => {
        it('should return a newly created latitude longitude object', () =>  {
            let latlng = gmaps.createLatLngObj(testConfig.latitude, testConfig.longitude);
            expect(latlng.latitude).toEqual(testConfig.latitude);
            expect(latlng.longitude).toEqual(testConfig.longitude);
        });
    });

    describe('addUserPositionMarker', () => {
        it('should return a newly created marker with an info window', () =>  {
            spyOn(gmaps, 'addInfoWindow');
            let marker = gmaps.addUserPositionMarker(testConfig.map, testConfig.position);
            expect(marker.data.map).toEqual(testConfig.map);
            expect(marker.data.position).toEqual(testConfig.position);
            expect(gmaps.addInfoWindow).toHaveBeenCalledWith(
                testConfig.map, gmaps.addMarker(testConfig.map, testConfig.position),
                guiConstants.map.userPosition);
        });
    });

    describe('bindEvent', () => {
        it('should call addListener function', () =>  {
            let fn =  () => {};
            spyOn(google.maps.event, 'addListener');
            let marker = gmaps.bindEvent(testConfig.map, testConfig.event, fn);
            expect(google.maps.event.addListener).toHaveBeenCalledWith(testConfig.map,
                testConfig.event, fn);
        });
    });
});