import { useContext, useRef, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Button, Card, Form, Grid, Icon, Image, Label } from 'semantic-ui-react';
import moment from 'moment';

import { AuthContext } from '../context/auth';

import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

const SinglePost = ({ match, history }) => {
  const postId = match.params.postId;
  const { user } = useContext(AuthContext);
  // const commentInputRef = useRef(null);

  const [comment, setComment] = useState('');

  const { data, loading } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });

  const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
    variables: {
      postId,
      body: comment,
    },
    update: cache => {
      cache.evict({ fieldName: 'comments' });
      setComment('');
      // commentInputRef.current.blur();
    },
  });

  const deletePostCallback = () => {
    history.replace('/');
  };

  let postMarkup;

  if (loading && !data) {
    postMarkup = <p>Loading post...</p>;
  }
  if (!loading && !data) {
    postMarkup = <p>No post found</p>;
  }
  if (!loading && data) {
    const {
      id,
      body,
      createdAt,
      username,
      likeCount,
      likes,
      commentCount,
      comments,
    } = data.getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src='https://react.semantic-ui.com/images/avatar/large/molly.png'
              size='small'
              floated='right'
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Button as='div' labelPosition='right' onClick={() => {}}>
                  <Button basic color='blue'>
                    <Icon name='comments' />
                  </Button>
                  <Label basic color='blue' pointing='left'>
                    {commentCount}
                  </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className='ui action input fluid'>
                      <input
                        type='text'
                        name='comment'
                        placeholder='Comment...'
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        // ref={commentInputRef}
                      />
                      <button
                        type='submit'
                        className='ui button teal'
                        disabled={comment.trim() === ''}
                        onClick={createComment}>
                        Comment
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map(comment => (
              <Card key={comment.id} fluid>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
};

const FETCH_POST_QUERY = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        body
        createdAt
        username
      }
    }
  }
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      commentCount
      comments {
        id
        body
        createdAt
        username
      }
    }
  }
`;

export default SinglePost;
