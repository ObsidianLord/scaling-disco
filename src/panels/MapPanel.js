import React from 'react';
import {
  Avatar,
  Div,
  FixedLayout,
  HorizontalScroll,
  Panel,
  PanelHeader,
  Search,
  Caption
} from '@vkontakte/vkui';
import L from 'leaflet';
import 'leaflet.tilelayer.colorfilter/src/leaflet-tilelayer-colorfilter.min.js';
import 'leaflet.markercluster/dist/leaflet.markercluster';

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet/dist/leaflet.css';
import '../css/common.css';
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
import Emotions from '../data/emotions';

class MapPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      map: null,
      search: ''
    }

    this.getClusterIcon = this.getClusterIcon.bind(this);
    this.getEmotionalCategoriesList = this.getEmotionalCategoriesList.bind(this);
    this.getEmotionalCategoryButton = this.getEmotionalCategoryButton.bind(this);
    this.getEmotionPin = this.getEmotionPin.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.showWall = this.showWall.bind(this);
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

    this.setState({
      map
    });
    this.props.setIsLoading(false);
  }

  componentDidUpdate() {
    const markers = L.markerClusterGroup({
      iconCreateFunction: this.getClusterIcon,
    });
    
    this.props.posts.forEach((post) => {
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

    this.getEmotionalCategoriesList();
    this.state.map.addLayer(markers);
  }

  getClusterIcon(cluster) {
    const markers = cluster.getAllChildMarkers();
    let dominantCategory;
    let categoryOccurrences = {};
    let maxCount = 0;
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
        iconSize,
        iconAnchor,
        shadowSize,
        shadowAnchor,
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

  onSearch(e) {
    this.setState({
      search: e.target.value
    });
  }

  getEmotionalCategoriesList() {
    const categoryOccurrences = {};
    this.props.posts.forEach((post) => {
      const combinedKey = `${post.category.key}:${post.emotion.key}`;
      if (combinedKey in categoryOccurrences) {
        categoryOccurrences[combinedKey] += 1;
      } else {
        categoryOccurrences[combinedKey] = 1;
      }
    });
    const occurrencesArray = Object.entries(categoryOccurrences)
      .sort((a, b) => b[1] - a[1])
      .map((categoryOccurrency) => categoryOccurrency[0]);

    const elementsArray = occurrencesArray.map(
      (category) => this.getEmotionalCategoryButton(category)
    );

    if (elementsArray.some((el) => el !== null)) {
      return elementsArray;
    } else {
      return <Caption
        level={1}
        weight="regular"
        className="text-center map-panel__emotional-category-list-placeholder"
      >Записей не найдено</Caption>
    }
  }

  getEmotionalCategoryButton(emotionalCategory) {
    const [ categoryKey, emotionKey ] = emotionalCategory.split(':');
    const category = Categories[categoryKey];
    const emotion = Emotions[emotionKey];
    const suitsFilter = !this.state.search
      || category.name.toLowerCase().indexOf(this.state.search.toLowerCase()) >= 0
      || emotion.name.toLowerCase().indexOf(this.state.search.toLowerCase()) >= 0
    if (!suitsFilter) return null;
    return <div
      key={emotionalCategory}
      className="text-center cursor-pointer"
      onClick={() => this.showWall(category, emotion)}
    >
      <Avatar
        src={category.photo_url}
        size={64}
        className="map-panel__emotional-category-avatar"
      >{ this.getEmotionPin(emotion.photo_url) }</Avatar>
      <div className="map-panel__emotional-category-text cursor-pointer">
        { Categories[categoryKey].name }
      </div>
    </div>
  }

  getEmotionPin(emotionPhotoSrc) {
    return <div className="map-panel__emotion-pin">
      <img src={emotionPhotoSrc} />
    </div>
  }

  showWall(category, emotion) {
    this.props.setWallOptions({
      category,
      emotion
    });
    this.props.go('wall-panel');
  }

  render() {
    return (
      <Panel id={this.props.id}>
        <PanelHeader visor={false} />
        <div
          id="map"
          className="map-panel__map-container"
        ></div>
        <FixedLayout
          vertical="bottom"
          filled
        >
          <Search
            value={this.state.search}
            onChange={this.onSearch}
            className="map-panel__search"
          />
          <Div>
            <HorizontalScroll>
              <div className="d-flex">
                {this.getEmotionalCategoriesList()}
              </div>
            </HorizontalScroll>
          </Div>
        </FixedLayout>
      </Panel>
    );
  }
}

export default MapPanel;