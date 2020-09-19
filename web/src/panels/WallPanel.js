import React from 'react';
import {
  Avatar,
  Div,
  Text,
  Subhead,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  SimpleCell
} from '@vkontakte/vkui';
import {
  Icon24MoreHorizontal,
  Icon24LikeOutline,
  Icon24CommentOutline,
  Icon24ShareOutline,
  Icon20ViewOutline
} from '@vkontakte/icons';

import '../css/common.css';
import '../css/WallPanel.css';

class WallPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }

    this.getWallPost = this.getWallPost.bind(this);
  }

  componentDidMount() {

  }

  getWallPost(post) {
    return <div
      className="wall-panel__post"
      key={post.id}
    >
      <SimpleCell
        disabled
        before={<Avatar size={48} src={post.avatar_url}></Avatar>}
        description={`${post.date} • ${post.emotion.name.toLowerCase()} настроение`}
        after={<Icon24MoreHorizontal fill={'var(--icon_tertiary)'} />}
      >
        {post.author}
      </SimpleCell>
      { post.text && <Div>
        <Text>
          { post.text }
        </Text>
      </Div> }
      { post.photo_url && <img
        src={post.photo_url}
        alt={post.category.name}
        className="wall-panel__post-img"
      />}
      <Div className="d-flex text-placeholder align-items-center wall-panel__post-actions">
          <Icon24LikeOutline fill={"var(--content_placeholder_icon)"}/>
          <Subhead weight="regular">{ post.likes_count }</Subhead>
          <Icon24CommentOutline fill={"var(--content_placeholder_icon)"}/>
          <Subhead weight="regular">{ post.comments_count }</Subhead>
          <Icon24ShareOutline fill={"var(--content_placeholder_icon)"}/>
          <Subhead weight="regular">{ post.reposts_count }</Subhead>
          <div className="flex-grow-1 d-flex justify-content-flex-end">
            <Icon20ViewOutline  fill={"var(--content_placeholder_icon)"}/>
            <Subhead weight="medium">{ post.views_count }</Subhead>
          </div>
      </Div>
    </div>
  }

  render() {
    return (
      <Panel
        id={this.props.id}
        className="wall-panel"
      >
        <PanelHeader left={<PanelHeaderBack onClick={() => this.props.go('back')} />}>
          {this.props.wallOptions.posts
            ? this.props.wallOptions.wallName
            : this.props.wallOptions.category.name}
        </PanelHeader>
        { this.props.wallOptions.posts &&
          this.props.wallOptions.posts.map((post) => this.getWallPost(post))
        }
        { !this.props.wallOptions.posts && this.props.posts
          .filter((post) => post.category === this.props.wallOptions.category && post.emotion === this.props.wallOptions.emotion)
          .map((post) => this.getWallPost(post))
        }
      </Panel>
    );
  }
}

export default WallPanel;