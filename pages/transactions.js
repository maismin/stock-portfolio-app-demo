import axios from 'axios';
import { parseCookies } from 'nookies';
import PropTypes from 'prop-types';
import { Grid, Message } from 'semantic-ui-react';
import baseUrl from '../utils/baseUrl';
import TransactionsList from '../components/transactions/TransactionsList';

const Transactions = ({ transactions, fetchError }) => {
  return (
    <>
      {fetchError && <Message error header="Oops!" content={fetchError} />}
      <Grid columns={1} relaxed>
        <Grid.Column>
          <TransactionsList transactions={transactions} />
        </Grid.Column>
      </Grid>
    </>
  );
};

Transactions.getInitialProps = async ctx => {
  const url = `${baseUrl}/api/transactions`;
  const { token } = parseCookies(ctx);
  const headers = { headers: { Authorization: token } };
  try {
    const response = await axios.get(url, headers);
    return { transactions: response.data, fetchError: '' };
  } catch (error) {
    return {
      transactions: [],
      fetchError: 'Error retrieving info, please try again later',
    };
  }
};

Transactions.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchError: PropTypes.string.isRequired,
};

export default Transactions;
