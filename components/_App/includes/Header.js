import { Menu, Container, Icon } from 'semantic-ui-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
  const user = false;
  const router = useRouter();

  const isActive = route => {
    return route === router.pathname;
  };

  return (
    <Menu stackable fluid id="menu" inverted>
      <Container text>
        <Link href="/">
          <Menu.Item header active={isActive('/')}>
            Stock Portfolio
          </Menu.Item>
        </Link>

        <Link href="/portfolio">
          <Menu.Item header active={isActive('/portfolio')}>
            Portfolio
          </Menu.Item>
        </Link>

        <Link href="/transactions">
          <Menu.Item header active={isActive('/transactions')}>
            Transactions
          </Menu.Item>
        </Link>

        {user ? (
          <>
            <Menu.Item header>
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
      </Container>
    </Menu>
  );
};

export default Header;
