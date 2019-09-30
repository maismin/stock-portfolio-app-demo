import App from 'next/app';
import Layout from '../components/_App/layouts/Layout';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
