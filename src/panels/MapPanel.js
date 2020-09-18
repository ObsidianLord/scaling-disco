import React from 'react';
import {
  Div,
  FixedLayout,
  HorizontalScroll,
  Panel,
  PanelHeader,
  Search
} from '@vkontakte/vkui';
import L from 'leaflet';
import 'leaflet.tilelayer.colorfilter/src/leaflet-tilelayer-colorfilter.min.js';
import 'leaflet.markercluster/dist/leaflet.markercluster';

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet/dist/leaflet.css';
import '../css/MapPanel.css';

import { SEARCH_BAR_PLACEHOLDER } from '../consts/strings';
import {
  DEFAULT_MAP_CENTER as center,
  DEFAULT_MAP_ZOOM as zoom,
  DEFAULT_MAP_MAX_ZOOM as maxZoom,
  DEFAULT_MAP_ZOOM_CONTROL as zoomControl,
  DEFAULT_TILE_URL,
  DEFAULT_MAP_STYLE_LIGHT as filter,
  DEFAULT_EMOTION_ICON_SIZE as iconSize,
  DEFAULT_EMOTION_ICON_ANCHOR as iconAnchor,
  DEFAULT_EMOTION_ICON_BG_SIZE as shadowSize,
  DEFAULT_EMOTION_ICON_BG_ANCHOR as shadowAnchor,
} from '../consts/map';

import shadowUrl from '../img/icons/bg.png';

import Categories from '../data/categories';
import Posts from '../data/posts';

class MapPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      go: props.go,
      setIsLoading: props.setIsLoading,
      map: null
    }

    this.iconCreateFunction = this.iconCreateFunction.bind(this);
  }

  componentDidMount() {
    const search = document.querySelector('.Search__placeholder-text');
    if (search) {
      search.textContent = SEARCH_BAR_PLACEHOLDER;
    }

    const map = L.map('map', {
      center,
      maxZoom,
      zoom,
      zoomControl
    });
  
    L.tileLayer.colorFilter(
      DEFAULT_TILE_URL,
      { filter }
    ).addTo(map);

    const markers = L.markerClusterGroup({
      iconCreateFunction: this.iconCreateFunction,
    });
    map.addLayer(markers);
    Posts.forEach((post) => {
      const marker = L.marker(post.latlng, {
        alt: post.category.key,
        icon: L.icon({
          iconUrl: post.category.photo_url,
          shadowUrl,
          iconSize,
          iconAnchor,
          shadowSize,
          shadowAnchor
        })
      });
      markers.addLayer(marker);
    });

    map.addLayer(markers);

    this.setState({
      map
    });
    this.state.setIsLoading(false);
  }

  iconCreateFunction(cluster) {
    const markers = cluster.getAllChildMarkers();
    let dominantCategory;
    let categoryOccurrences = {};
    let maxCount = 0;
    console.log(markers)
    markers.forEach((marker) => {
      if (marker.options.alt in categoryOccurrences) {
        categoryOccurrences[marker.options.alt] += 1;
      } else {
        categoryOccurrences[marker.options.alt] = 1;
      }
      if (categoryOccurrences[marker.options.alt] > maxCount) {
        maxCount = categoryOccurrences[marker.options.alt];
        dominantCategory = marker.options.alt;
      }
    });
    
    const sizeMultiplier = Math.log2(maxCount) + 1;

    return sizeMultiplier < 2
      ? L.icon({
        iconUrl: Categories[dominantCategory].photo_url,
        shadowUrl,
        iconSize: iconSize.map((num) => num * sizeMultiplier),
        iconAnchor: iconAnchor.map((num) => num * sizeMultiplier),
        shadowSize: shadowSize.map((num) => num * sizeMultiplier),
        shadowAnchor: shadowAnchor.map((num) => num * sizeMultiplier),
      })
      : L.divIcon({
        html: `
          <div class="map-panel__cluster-icon map-panel__cluster-icon-${sizeMultiplier}">
            <img
              src="${Categories[dominantCategory].photo_url}"
              alt="${Categories[dominantCategory].name}"
            />
            <div>${Categories[dominantCategory].name}</div>
          </div>
        `
      })
  }

  render() {
    return (
      <Panel id={this.state.id}>
        <PanelHeader visor={false} />
        <div
          id="map"
          className="map-panel__map-container"
        ></div>
        <FixedLayout
          vertical="bottom"
          filled
        >
          <Search />
          <Div>
            <HorizontalScroll>
            </HorizontalScroll>
          </Div>
        </FixedLayout>
      </Panel>
    );
  }
}

export default MapPanel;