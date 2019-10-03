import { parseCookies } from 'nookies';
import PropTypes from 'prop-types';
import { Grid, Message } from 'semantic-ui-react';
import backend from '../utils/backend';
import TransactionsList from '../components/transactions/TransactionsList';

const Transactions = ({ transactions, fetchError }) => {
  return (
    <>
      {fetchError && <Message error header="Oops!" content={fetchError} />}
      <Grid columns={2} relaxed divided stackable>
        <Grid.Column></Grid.Column>
        <Grid.Column>
          <TransactionsList transactions={transactions} />
        </Grid.Column>
      </Grid>
    </>
  );
};

Transactions.getInitialProps = async ctx => {
  const { token } = parseCookies(ctx);
  try {
    const response = await backend.fetchData('transactions', token);
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
