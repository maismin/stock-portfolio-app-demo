import App from 'next/app';
import axios from 'axios';
import { withRouter } from 'next/router';
import { parseCookies, destroyCookie } from 'nookies';
import Layout from '../components/_App/layouts/Layout';
import { redirectUser } from '../utils/auth';
import baseUrl from '../utils/baseUrl';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const { token } = parseCookies(ctx);
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    // User isn't authenticated
    if (!token) {
      // is protected route access?
      const isProtectedRoute =
        ctx.pathname === '/portfolio' || ctx.pathname === '/transactions';
      if (isProtectedRoute) {
        redirectUser(ctx, '/login');
      }
    } else {
      // Get user account with token
      try {
        const url = `${baseUrl}/api/auth`;
        // To use jwt for authorization, it needs to be in the header
        const payload = { headers: { authorization: token } };
        const response = await axios.get(url, payload);
        const user = response.data;
        pageProps.user = user;
      } catch (error) {
        // 1) Throw out invalid token
        destroyCookie(ctx, 'token');
        // 2) Redirect to login
        redirectUser(ctx, '/login');
      }
    }

    return { pageProps };
  }

  componentDidMount() {
    window.addEventListener('storage', this.syncLogout);
  }

  syncLogout(event) {
    if (event.key === 'logout') {
      this.router.push('/login');
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default withRouter(MyApp);
