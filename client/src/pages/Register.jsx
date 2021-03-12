import { useContext, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';

import { useForm } from '../utils/hooks';
import { AuthContext } from '../context/auth';

const Register = ({ history }) => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER_MUTATION, {
    variables: values,
    update: (_, result) => {
      // console.log(result);
      context.login(result.data.register);
      history.replace('/');
    },
    onError: err => {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });

  function registerUser() {
    addUser();
  }

  return (
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Register</h1>
        <Form.Input
          label='Username'
          placeholder='Username..'
          type='text'
          name='username'
          value={values.username}
          onChange={onChange}
          error={errors.username ? true : false}
        />
        <Form.Input
          label='Email'
          placeholder='Email..'
          type='email'
          name='email'
          value={values.email}
          onChange={onChange}
          error={errors.email ? true : false}
        />
        <Form.Input
          label='Password'
          placeholder='Password..'
          type='password'
          name='password'
          value={values.password}
          onChange={onChange}
          error={errors.password ? true : false}
        />
        <Form.Input
          label='Confirm Password'
          placeholder='Confirm Password..'
          type='password'
          name='confirmPassword'
          value={values.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword ? true : false}
        />
        <Button type='submit' primary>
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className='ui error message'>
          <ul className='list'>
            {Object.values(errors).map(er => (
              <li key={er}>{er}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const REGISTER_USER_MUTATION = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
