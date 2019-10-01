import { Button, Form, Icon, Message, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const SignupForm = ({
  user,
  loading,
  disabled,
  error,
  loginLink,
  handleChange,
  handleSubmit,
}) => (
  <>
    <Message
      attached
      icon="settings"
      header="Get Started!"
      content="Create a new account"
      color="blue"
    />
    <Form loading={loading} error={Boolean(error)} onSubmit={handleSubmit}>
      <Message error header="Oops!" content={error} />
      <Segment>
        <Form.Input
          fluid
          icon="user"
          iconPosition="left"
          label="Name"
          placeholder="Name"
          name="name"
          value={user.name}
          onChange={handleChange}
        />
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
          icon="signup"
          type="submit"
          color="blue"
          content="Signup"
        />
      </Segment>
    </Form>
    <Message attached="bottom" warning>
      <Icon name="help" />
      Existing user?&nbsp;
      <Link href={loginLink}>
        <a>Log in here</a>
      </Link>
      &nbsp;instead
    </Message>
  </>
);

SignupForm.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  loginLink: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default SignupForm;
