import Head from 'next/head';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';

import Header from '../includes/Header';

function Layout({ children }) {
  return (
    <>
      <Head>
        {/* Stylesheets */}
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css"
        />
        <title>Stock Portfolio App Demo</title>
      </Head>
      <Header />
      <Container text style={{ paddingTop: '1em' }}>
        {children}
      </Container>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.object.isRequired, // eslint-disable-line
};

export default Layout;
