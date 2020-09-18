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
} from '../consts/map';

class MapPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      go: props.go
    }
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