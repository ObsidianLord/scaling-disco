import React from 'react';
import {
  Avatar,
  Div,
  FixedLayout,
  HorizontalScroll,
  Panel,
  PanelHeader,
  Search,
  Select,
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
  DEFAULT_MAP_STYLE_LIGHT,
  DEFAULT_MAP_STYLE_DARK,
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
      markers: null,
      search: '',
      quickEmotionSelected: false,
      screenWidth: 0,
      screenHeight: 0,
      footerHeight: 0,
      headerHeight: 0,
      selectedEmotion: null,
      savedZoom: null,
      savedCenter: null,
      darkMode: false
    }

    this.getClusterIcon = this.getClusterIcon.bind(this);
    this.getEmotionalCategoriesList = this.getEmotionalCategoriesList.bind(this);
    this.getEmotionalCategoryButton = this.getEmotionalCategoryButton.bind(this);
    this.getEmotionPin = this.getEmotionPin.bind(this);
    this.getFilteredPosts = this.getFilteredPosts.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onEmotionSelect = this.onEmotionSelect.bind(this);
    this.onQuickEmotionSelect = this.onQuickEmotionSelect.bind(this);
    this.showWall = this.showWall.bind(this);
    this.resize = this.resize.bind(this);
  }

  componentDidMount() {
    const search = document.querySelector('.Search__placeholder-text');
    const schemeAttribute = document.body.attributes.getNamedItem('scheme');
    const darkMode = schemeAttribute && schemeAttribute.value.indexOf('light') === -1;

    if (search) {
      search.textContent = SEARCH_BAR_PLACEHOLDER;
    }

    const map = L.map('map', {
      center: this.state.savedCenter ?? center,
      maxZoom,
      zoom: this.state.savedZoom ?? zoom,
      zoomControl
    });

    L.tileLayer.colorFilter(
      DEFAULT_TILE_URL,
      {
        filter: darkMode
          ? DEFAULT_MAP_STYLE_DARK
          : DEFAULT_MAP_STYLE_LIGHT
      }
    ).addTo(map);

    this.setState({
      map,
      darkMode
    });

    if (this.props.savedMapView) {
      map.setView(this.props.savedMapView.center, this.props.savedMapView.zoom);
    }

    window.addEventListener('resize', this.resize);
    this.resize();
    this.props.setIsLoading(false);
  }

  componentWillUnmount() {
    this.props.setSavedMapView({
      center: this.state.map.getCenter(),
      zoom: this.state.map.getZoom(),
    })
    window.removeEventListener('resize', this.resize);
  }

  componentDidUpdate() {
    this.state.map.eachLayer((layer) => {
      if (!layer._url) {
        this.state.map.removeLayer(layer);
      }
    });

    const markers = L.markerClusterGroup({
      iconCreateFunction: this.getClusterIcon,
    });

    this.getFilteredPosts().forEach((post) => {
      const marker = L.marker(post.latlng, {
        alt: post.category.key,
        post,
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

    markers.on('click', ((e) => {
      const post = e.layer.options.post;
      this.showWall({
        category: null,
        emotion: null,
        wallName: post.category.name,
        posts: [ post ],
      });
    }));

    markers.on('clusterclick', ((e) => {
      const posts = e.layer.getAllChildMarkers().map((marker) => marker.options.post);
      this.showWall({
        category: null,
        emotion: null,
        wallName: e.originalEvent.target.dataset.name,
        posts,
      });
    }));
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

    return L.divIcon({
        html: `
          <div
            data-name="${Categories[dominantCategory].name}"
            class="map-panel__cluster-icon map-panel__cluster-icon-${sizeMultiplier} ${this.state.darkMode ? ' map-panel__cluster-icon--dark' : ''}"
          >
            <img
              data-name="${Categories[dominantCategory].name}"
              src="${Categories[dominantCategory].photo_url}"
              alt="${Categories[dominantCategory].name}"
            />
            <div
              data-name="${Categories[dominantCategory].name}"
              class="map-panel__cluster-icon-text ${sizeMultiplier < 2 ? 'd-none' : ''}">${Categories[dominantCategory].name}
            </div>
          </div>
        `
      })
  }

  getFilteredPosts() {
    const searchedPosts = this.state.search
      ? this.props.posts.filter((post) =>
        post.category.name.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1
          || post.emotion.name.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1)
      : this.props.posts;
    if (this.state.selectedEmotion) {
      return searchedPosts.filter((post) => {
        return this.state.selectedEmotion.key === 'NONE' || post.emotion === this.state.selectedEmotion;
      })
    }
    return searchedPosts;
  }

  onSearch(e) {
    this.setState({
      search: e.target.value
    });
  }

  onEmotionSelect(emotion) {
    this.setState({
      selectedEmotion: emotion
    });
  }

  onEmotionSelectByKey(emotionKey) {
    if (emotionKey === 'NONE') {
      this.setState({
        selectedEmotion: {
          key: 'NONE',
          emoji: '✨',
          name: 'Любое',
        }
      });
    } else {
      this.setState({
        selectedEmotion: Emotions[emotionKey]
      });
    }
  }

  onQuickEmotionSelect(emotion) {
    this.setState({
      quickEmotionSelected: true
    });
    this.onEmotionSelect(emotion);
  }

  resize() {
    const header = document.querySelector('.PanelHeader__in');
    const footer = document.querySelector('.FixedLayout--bottom');
    this.setState({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      headerHeight: header ? header.clientHeight : 0,
      footerHeight: footer ? footer.clientHeight : 0,
    });
  }

  getEmotionalCategoriesList() {
    const categoryOccurrences = {};
    this.getFilteredPosts().forEach((post) => {
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
      || category.name.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1
      || emotion.name.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1
    if (!suitsFilter) return null;
    return <div
      key={emotionalCategory}
      className="text-center cursor-pointer bg-none box-shadow-none"
      onClick={() => this.showWall({ category, emotion, wallName: category.name, posts: null })}
    >
      <Avatar
        src={category.photo_url}
        size={64}
        className="map-panel__emotional-category-avatar"
      >{ this.getEmotionPin(emotion, 20) }</Avatar>
      <div className="map-panel__emotional-category-text cursor-pointer">
        { Categories[categoryKey].name }
      </div>
    </div>
  }

  getEmotionPin(emotion, size) {
    return <div className={`map-panel__emotion-pin map-panel__emotion-pin-${size}`}>
      <img
        src={emotion.photo_url}
        alt={emotion.name}
      />
    </div>
  }

  showWall(options) {
    this.props.setWallOptions(options);
    this.props.go('wall-panel');
  }

  render() {
    return (
      <Panel id={this.props.id}>
        <PanelHeader visor={false}>
        </PanelHeader>
        <FixedLayout>
          {
            this.state.quickEmotionSelected &&
            <Select
              value={this.state.selectedEmotion.key}
              onChange={(e) => this.onEmotionSelectByKey(e.target.value)}
              className="map-panel__emotion-select"
              style={
                this.state.screenWidth !== 0
                ? { left: this.state.screenWidth / 2, top: this.state.screenHeight - this.state.footerHeight - 52, transform: 'translateX(-50%)' }
                : {}
              }
            >
              { Object.values(Emotions)
                .concat([{
                  key: 'NONE',
                  emoji: '✨',
                  name: 'Любое',
                }])
                .map((emotion) => <option
                  key={emotion.key}
                  value={emotion.key}>
                    {`${emotion.emoji} ${emotion.name} настроение`}
                </option>
              )}
            </Select>
          }
          <div
            className={
              !this.state.quickEmotionSelected
                ? 'map-panel__quick-emotions'
                : 'map-panel__quick-emotions map-panel__quick-emotions-top--hidden'
            }
            style={
              this.state.screenWidth !== 0
              ? { left: this.state.screenWidth / 2 - 16, top: this.state.headerHeight + 8 }
              : {}
            }
            onClick={() => this.onQuickEmotionSelect(Emotions.ENERGETIC)}
          >
            { this.getEmotionPin(Emotions.ENERGETIC, 32) }
          </div>
          <div
            className={
              !this.state.quickEmotionSelected
                ? 'map-panel__quick-emotions'
                : 'map-panel__quick-emotions map-panel__quick-emotions-right--hidden'
            }
            style={
              this.state.screenWidth !== 0
              ? { left: this.state.screenWidth - 54, top: (this.state.screenHeight - this.state.footerHeight) / 2 + 16 }
              : {}
            }
            onClick={() => this.onQuickEmotionSelect(Emotions.HAPPY)}
          >
            { this.getEmotionPin(Emotions.HAPPY, 32) }
          </div>
          <div
            className={
              !this.state.quickEmotionSelected
                ? 'map-panel__quick-emotions'
                : 'map-panel__quick-emotions map-panel__quick-emotions-bottom--hidden'
            }
            style={
              this.state.screenWidth !== 0
              ? { left: this.state.screenWidth / 2 - 16, top: this.state.screenHeight - this.state.footerHeight - 52 }
              : {}
            }
            onClick={() => this.onQuickEmotionSelect(Emotions.SLEEPY)}
          >
            { this.getEmotionPin(Emotions.SLEEPY, 32) }
          </div>
          <div
            className={
              !this.state.quickEmotionSelected
                ? 'map-panel__quick-emotions'
                : 'map-panel__quick-emotions map-panel__quick-emotions-left--hidden'
            }
            style={
              this.state.screenWidth !== 0
              ? { left: 16, top: (this.state.screenHeight - this.state.footerHeight) / 2 + 16 }
              : {}
            }
            onClick={() => this.onQuickEmotionSelect(Emotions.SAD)}
          >
            { this.getEmotionPin(Emotions.SAD, 32) }
          </div>
        </FixedLayout>
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