import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Button, Confirm, Icon } from 'semantic-ui-react';

import PopupComponent from './PopupComponent';

const DeleteButton = ({ postId, commentId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrMutation] = useMutation(mutation, {
    variables: {
      postId,
      commentId,
    },
    update: cache => {
      setConfirmOpen(false);
      if (!commentId) {
        // remove post from cache
        cache.evict({ id: 'Post:' + postId });
      }
      // redirect to homepage
      if (callback) {
        callback();
      }
    },
  });

  return (
    <>
      <PopupComponent content={`Delete this ${commentId ? 'comment' : 'post'}`}>
        <Button
          as='div'
          color='red'
          floated='right'
          onClick={() => {
            setConfirmOpen(true);
          }}>
          <Icon name='trash' style={{ margin: 0 }} />
        </Button>
      </PopupComponent>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation}
      />
    </>
  );
};

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default DeleteButton;
