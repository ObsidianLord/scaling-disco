import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
  View,
  ScreenSpinner
} from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';

import MapPanel from './panels/MapPanel';

import { DEFAULT_GENERATED_POSTS_COUNT } from './consts/config';
import { getRandomPost } from './api/api';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePanel: 'home',
      history: [],
      isLoading: true,
      posts: [],
    };

    this.go = this.go.bind(this);
    this.setIsLoading = this.setIsLoading.bind(this);
    this.generatePosts = this.generatePosts.bind(this);
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
    this.generatePosts(DEFAULT_GENERATED_POSTS_COUNT);
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

  setIsLoading(isLoading) {
    this.setState({
      isLoading
    });
  }

  generatePosts(amount) {
    const posts = [];
    for (let i = 0; i < amount; i++) {
      posts.push(
        getRandomPost(i)
      );
    }
    this.setState({
      posts
    });
  }

  render() {
    return (
      <View 
        activePanel={this.state.activePanel}
        popout={this.state.isLoading ? <ScreenSpinner /> : null}
      >
        <MapPanel
          id="home"
          posts={this.state.posts}
          go={this.go}
          setIsLoading={this.setIsLoading}
        />
      </View>
    )
  }
}

export default App;
