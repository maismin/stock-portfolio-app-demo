import {
  Button,
  Container,
  Form,
  Icon,
  Message,
  Segment,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const LoginForm = ({
  user,
  loading,
  disabled,
  error,
  signupLink,
  handleChange,
  handleSubmit,
}) => (
  <Container text>
    <Message
      attached
      icon="privacy"
      header="Welcome Back!"
      content="Log in with email and password"
      color="blue"
    />
    <Form loading={loading} error={Boolean(error)} onSubmit={handleSubmit}>
      <Message error header="Oops!" content={error} />
      <Segment>
        <Form.Input
          fluid
          icon="envelope"
          iconPosition="left"
          label="Email"
          placeholder="Email"
          name="email"
          type="email"
          value={user.email}
          onChange={handleChange}
        />
        <Form.Input
          fluid
          icon="lock"
          iconPosition="left"
          label="Password"
          placeholder="Password"
          name="password"
          type="password"
          value={user.password}
          onChange={handleChange}
        />
        <Button
          disabled={disabled || loading}
          icon="sign in"
          type="submit"
          color="blue"
          content="Log in"
        />
      </Segment>
    </Form>
    <Message attached="bottom" warning>
      <Icon name="help" />
      New user?&nbsp;
      <Link href={signupLink}>
        <a>Sign up here</a>
      </Link>
      &nbsp;instead
    </Message>
  </Container>
);

LoginForm.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  signupLink: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default LoginForm;
