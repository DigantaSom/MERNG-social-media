import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { Button, Confirm, Icon } from 'semantic-ui-react';

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
      <Button
        as='div'
        color='red'
        floated='right'
        onClick={() => {
          setConfirmOpen(true);
        }}>
        <Icon name='trash' style={{ margin: 0 }} />
      </Button>
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
