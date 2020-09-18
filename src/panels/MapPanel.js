import React from 'react';
import { Panel, PanelHeader } from '@vkontakte/vkui';

class MapPanel extends React.Component {
  constructor(data) {
    super(data);
    this.state = {
      id: data.id,
      go: data.go
    }
  }

  render() {
    return (
      <Panel id={this.state.id}>
        <PanelHeader visor={false} />
      </Panel>
    );
  }
}

export default MapPanel;