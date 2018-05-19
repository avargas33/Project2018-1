(() => {
    window.google = {
      maps: {
        Animation: {
          DROP: 'DROP'
        },
        MapTypeId: {
          ROADMAP: 'ROADMAP'
        },
        visualization: {
          HeatmapLayer: HeatmapConstructor
        },
        Map: MapConstructor,
        LatLng: LatLngConstructor,
        Marker: MarkerConstructor,
        InfoWindow: InfoWindowConstructor,
        event: {
          addListener: () => {}
        }
      }
    };

    function MapConstructor(map, opts) {
      this.map = map;
      this.opts = opts;
    }
    
    function LatLngConstructor(lat, lng) {
      this.latitude = lat;
      this.longitude = lng;
    }

    function MarkerConstructor(markerData) {
      this.data = markerData;
    }

    function InfoWindowConstructor(infoWindowData) {
      this.data = infoWindowData;
    }

    function HeatmapConstructor(heatmapData) {
      this.map = null;
      this.data = heatmapData;
      this.setMap = setMap;

      function setMap(map) {
        this.map = map;
      }
    }
})();