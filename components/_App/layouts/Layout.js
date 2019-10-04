import Head from 'next/head';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';

import Header from '../includes/Header';

/* eslint-disable react/jsx-one-expression-per-line, react/jsx-closing-tag-location */
function Layout({ children, isAuthenticated }) {
  return (
    <>
      <Head>
        {/* Stylesheets */}
        <link rel="stylesheet" type="text/css" href="/static/styles.css" />
        <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css"
        />
        <title>Stock Portfolio App Demo</title>
      </Head>
      <Header isAuthenticated={isAuthenticated} />
      <Container style={{ paddingTop: '1em' }}>{children}</Container>

      <style jsx global>{`
        body {
          background-image: url('/static/splash.jpeg');
          background-repeat: no-repeat;
          background-attachment: fixed;
          background-size: cover;
        }
      `}</style>
    </>
  );
}
/* eslint-enable react/jsx-one-expression-per-line, react/jsx-closing-tag-location */
Layout.propTypes = {
  children: PropTypes.object.isRequired, // eslint-disable-line
  isAuthenticated: PropTypes.bool.isRequired,
};

export default Layout;
