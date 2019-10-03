import { Menu, Icon } from 'semantic-ui-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { handleLogout } from '../../../utils/auth';

const Header = ({ isAuthenticated }) => {
  const router = useRouter();

  const isActive = route => {
    return route === router.pathname;
  };

  return (
    <Menu stackable fluid id="menu" inverted>
      <Link href="/portfolio">
        <Menu.Item header active={isActive('/portfolio')} position="right">
          Portfolio
        </Menu.Item>
      </Link>

      <Link href="/transactions">
        <Menu.Item header active={isActive('/transactions')}>
          Transactions
        </Menu.Item>
      </Link>

      {isAuthenticated ? (
        <>
          <Menu.Item header onClick={handleLogout}>
            <Icon name="sign out" size="large" />
            Logout
          </Menu.Item>
        </>
      ) : (
        <>
          <Link href="/login">
            <Menu.Item header active={isActive('/login')}>
              <Icon name="sign in" size="large" />
              Login
            </Menu.Item>
          </Link>

          <Link href="/signup">
            <Menu.Item header active={isActive('/signup')}>
              <Icon name="signup" size="large" />
              Signup
            </Menu.Item>
          </Link>
        </>
      )}
    </Menu>
  );
};

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default Header;
