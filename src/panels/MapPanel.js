import React from 'react';
import {
  Div,
  FixedLayout,
  HorizontalScroll,
  Panel,
  PanelHeader,
  Search
} from '@vkontakte/vkui';
import {
  Map,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import '../css/MapPanel.css';

import { SEARCH_BAR_PLACEHOLDER } from '../consts/strings';
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  DEFAULT_MAP_MAX_ZOOM,
  DEFAULT_TILE_LAYER_URL
} from '../consts/map';

class MapPanel extends React.Component {
  constructor(data) {
    super(data);

    this.state = {
      id: data.id,
      go: data.go
    }

    this.searchRef = React.createRef();
  }

  componentDidMount() {
    const search = document.querySelector('.Search__placeholder-text');
    if (search) {
      search.textContent = SEARCH_BAR_PLACEHOLDER;
    }
  }

  render() {
    return (
      <Panel id={this.state.id}>
        <PanelHeader visor={false} />
        <Map
          center={DEFAULT_MAP_CENTER}
          zoom={DEFAULT_MAP_ZOOM}
          maxZoom={DEFAULT_MAP_MAX_ZOOM}
        >
          <TileLayer
            url={DEFAULT_TILE_LAYER_URL}
          />
      </Map>
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