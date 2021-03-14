import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { Button, Confirm, Icon } from 'semantic-ui-react';

const DeleteButton = ({ postId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    variables: { postId },
    update: cache => {
      setConfirmOpen(false);
      // remove post from cache
      cache.evict({ id: 'Post:' + postId });
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
        onConfirm={deletePost}
      />
    </>
  );
};

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export default DeleteButton;
