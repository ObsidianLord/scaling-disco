import React from 'react';
import {
  Div,
  FixedLayout,
  HorizontalScroll,
  Panel,
  PanelHeader,
  Search
} from '@vkontakte/vkui';

import { SEARCH_BAR_PLACEHOLDER } from '../consts/strings';

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
        <FixedLayout vertical="bottom">
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