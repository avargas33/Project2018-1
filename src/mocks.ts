export class ConfigMock {
 
  public get(): any {
    return '';
  }
 
  public getBoolean(): boolean {
    return true;
  }
 
  public getNumber(): number {
    return 1;
  }
}
 
export class FormMock {
  public register(): any {
    return true;
  }
}
 
export class NavMock {
 
  public pop(): any {
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }
 
  public push(): any {
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }
 
  public getActive(): any {
    return {
      'instance': {
        'model': 'something',
      },
    };
  }
 
  public setRoot(): any {
    return true;
  }

  public last() : any {
    return {
      name: 'name'
    };
  }
}
 
export class PlatformMock {
  public ready(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
}

export class PlatformMockMobile {
  public ready(): any {
    return Promise.resolve();
  }

  is(arg : string) {
    return arg === 'mobile';
  }
}

export class AndroidPermissionsMockOK {
  
  PERMISSION = {
    ACCESS_FINE_LOCATION: 'ACCESS_FINE_LOCATION'
  }
  
  checkPermission() {
    return Promise.resolve();
  }

  requestPermission() {
    return Promise.resolve();
  }
}
 
export class MenuMock {
  public close(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
}

export class ViewControllerMock {
  public _setHeader(): any { return {} };
  public _setNavbar(): any { return {} };
  public _setIONContent(): any { return {} };
  public _setIONContentRef(): any { return {} };
}

export class LoadingControllerMock {
  _getPortal(): any { return {} };
  create(options?: any) { 
      return new LoadingMock();
  };
}

export class AlertControllerMock {
  _getPortal(): any { return {} };
  create(options?: any) {
      return new AlertMock()
  };
}

export class GeolocationMockOK {
  getCurrentPosition() {
    return Promise.resolve({
      coords: {
        longitude: 1,
        latitude: 1
      }
    });
  }
}

export class GeolocationMockFailure {
  getCurrentPosition() {
    return Promise.reject('error');
  }
}

export class CrimeFormProviderMockOK {
  location = null;
  crimeType = null;

  resetFormData() {
    this.location = null;
    this.crimeType = null;
  }

  getCrimeTypes() {
    return Promise.resolve([{
      id : 1,
      name : 'name',
      value : 'value',
      gradient : ['gradient']
    }]);
  }

  reportCrime() {
    return Promise.resolve();
  }

  getCrimeType() {
    return this.crimeType;
  }

  getLocation() {
    return this.location;
  }

  setCrimeType(type) {
    this.crimeType = type;
  }

  setLocation(location) {
    this.location = location;
  }

  getCrimeTypeIcon() {
    return 'icon';
  }
}

export class CrimeFormProviderMockFail {
  location = null;
  crimeType = null;

  resetFormData() {
    this.location = null;
    this.crimeType = null;
  }

  getCrimeTypes() {
    return Promise.reject('error');
  }

  reportCrime() {
    return Promise.reject('error');
  }

  getCrimeType() {
    return this.crimeType;
  }

  getLocation() {
    return this.location;
  }

  setCrimeType(type) {
    this.crimeType = type;
  }

  setLocation(location) {
    this.location = location;
  }
}

export class LocationProviderMockOK {
  lastLocation = null;

  getLocation() {
    this.lastLocation = {
      latitude: 'latitude',
      longitude: 'longitude'
    };
    return Promise.resolve(this.lastLocation);
  }

  getLastLocation() {
    return this.lastLocation;
  }
}

export class LocationProviderMockSemiFail {
  lastLocation = {
    latitude: 'lastLatitude', longitude: 'lastLongitude'
  };

  getLocation() {
    return Promise.reject('error');
  }

  getLastLocation() {
    return this.lastLocation;
  }
}

export class LocationProviderMockFail {
  lastLocation;

  getLocation() {
    return Promise.reject('error');
  }

  getLastLocation() {
    return this.lastLocation;
  }
}

export class HomeProviderMockOK {
  getCrimeData() {
    return Promise.resolve([{
      id: 1,
      location: JSON.stringify({
        lat: 1,
        lng: 1
      }),
      type: 1
    }]);
  }
}

export class HomeProviderMockFail {
  getCrimeData() {
    return Promise.reject('error');
  }
}

export class GmapsProviderMockOK {
  createMap() {
    return 'map';
  }

  addMarker() {
    return 'marker';
  }

  addInfoWindow(map, marker, content) {
    return 'infowindow';
  }

  createHeatMap(map, data, gradient) {
    return 'heatmap'
  }

  createLatLngObj(lat, lng) {
    return 'latlng';
  }

  bindEvent() {}

  addUserPositionMarker() {
    return 'marker';
  }
}

class LoadingMock {
  present() { };
  dismiss() { };
  dismissAll() { };
}

class AlertMock {
  present() {
    return new Promise(res => res());
  };
}