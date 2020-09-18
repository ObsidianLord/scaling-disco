import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';

import '@vkontakte/vkui/dist/vkui.css';

import MapPanel from './panels/MapPanel';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePanel: 'home',
      history: []
    };

    this.go = this.go.bind(this);
  }

  componentDidMount() {
    window.onpopstate = (event) => {
      if (this.state.history.length > 0) {
        this.go('back');
      }
    };
    bridge.subscribe(({ detail: { type, data }}) => {
      if (type === 'VKWebAppUpdateConfig') {
        const schemeAttribute = document.createAttribute('scheme');
        schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
        document.body.attributes.setNamedItem(schemeAttribute);
        const status_bar = schemeAttribute.value.includes('light') ? 'dark' : 'light';
        bridge.send('VKWebAppSetViewSettings', {'status_bar_style': status_bar});
      }
    });
  }

  componentWillUnmount() {
    window.onpopstate = () => {};
  }

  go(target) {
    if (target === 'back') {
      const previousPanel = this.state.history.pop();
      this.setState({
          activePanel: previousPanel
      });
    } else {
      this.state.history.push(this.state.activePanel);
      window.history.pushState({}, '');
      this.setState({
          activePanel: target
      });
    }
  }

  render() {
    return (
      <View activePanel={this.state.activePanel}>
        <MapPanel
          id='home'
          go={this.go}
        />
      </View>
    )
  }
}

export default App;
