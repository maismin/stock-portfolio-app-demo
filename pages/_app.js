import App from 'next/app';
import { withRouter } from 'next/router';
import { parseCookies } from 'nookies';
import Layout from '../components/_App/layouts/Layout';
import { auth, redirectUser } from '../utils/auth';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const { token } = parseCookies(ctx);
    let pageProps = {};

    // User isn't authenticated
    if (!token) {
      // check if protected routes are accessed
      const isProtectedRoute =
        ctx.pathname === '/portfolio' || ctx.pathname === '/transactions';
      if (isProtectedRoute) {
        redirectUser(ctx, '/login');
      }
    } else {
      if (token && (ctx.pathname === '/login' || ctx.pathname === '/signup')) {
        redirectUser(ctx, '/portfolio');
      }
      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
      }
    }

    pageProps.isAuthenticated = auth(token);

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
