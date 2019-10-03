import { useState, useEffect } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Grid, Header, Segment } from 'semantic-ui-react';
import baseUrl from '../utils/baseUrl';
import catchErrors from '../utils/catchErrors';
import options from '../server/utils/transactionOptions';
import StockForm from '../components/portfolio/StockForm';
import PortfolioList from '../components/portfolio/PortfolioList';

// Remaps options into objects to pass into semantic-ui dropdown
const transactionOptions = options.map(op => ({
  key: op,
  text: op,
  value: op,
}));

const INITIAL_STOCK = {
  action: '',
  ticker: '',
  shares: '',
};

const emptyPortfolio = {
  user: {
    balance: 'N/A',
    name: 'N/A',
  },
  portfolio: {
    value: 'N/A',
    stocks: [],
  },
};

const Portfolio = ({ portfolio, fetchError }) => {
  const [stock, setStock] = useState(INITIAL_STOCK);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    const isStock = Object.values(stock).every(el => Boolean(el));
    if (isStock) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [stock]);

  const handleChange = (event, data) => {
    if (data.icon === 'dropdown') {
      setStock(prevState => ({ ...prevState, action: data.value }));
    } else {
      const { name, value } = event.target;
      setStock(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      const cookies = parseCookies();
      const url = `${baseUrl}/api/portfolio`;
      const headers = { headers: { Authorization: cookies.token } };
      const payload = { ...stock };
      await axios.post(url, payload, headers);
      router.push('/portfolio');
    } catch (err) {
      catchErrors(err, setError);
    } finally {
      setLoading(false);
    }
  };
  /* eslint-disable react/jsx-one-expression-per-line */
  return (
    <Grid columns={2} divided relaxed stackable>
      <Grid.Column>
        <Segment>
          <Header size="huge">Cash - {portfolio.user.balance}</Header>
        </Segment>
        <StockForm
          stock={stock}
          loading={loading}
          disabled={disabled}
          error={error}
          transactionOptions={transactionOptions}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </Grid.Column>
      <Grid.Column>
        <PortfolioList
          portfolio={portfolio.portfolio}
          fetchError={fetchError}
        />
      </Grid.Column>
    </Grid>
  );
  /* eslint-enable react/jsx-one-expression-per-line */
};

Portfolio.getInitialProps = async ctx => {
  const url = `${baseUrl}/api/portfolio`;
  const { token } = parseCookies(ctx);
  const headers = { headers: { Authorization: token } };
  try {
    const response = await axios.get(url, headers);
    return { portfolio: response.data, fetchError: '' };
  } catch (error) {
    return {
      portfolio: emptyPortfolio,
      fetchError: 'Error retrieving info, please try again later',
    };
  }
};

Portfolio.propTypes = {
  portfolio: PropTypes.shape({
    user: PropTypes.shape({
      balance: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    portfolio: PropTypes.shape({
      value: PropTypes.string.isRequired,
      stocks: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  fetchError: PropTypes.string.isRequired,
};

export default Portfolio;
