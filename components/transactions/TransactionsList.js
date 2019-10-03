import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

/* eslint-disable no-underscore-dangle */
const mapTransactionsToRows = transactions => {
  return transactions.map(t => {
    return (
      <Table.Row key={t._id}>
        <Table.Cell>
          {`${t.action} (${t.ticker}) - ${t.shares} shares @ $ ${t.price}`}
        </Table.Cell>
      </Table.Row>
    );
  });
};
/* eslint-enable no-underscore-dangle */

const TransactionsList = ({ transactions }) => {
  return (
    <>
      <Table>
        <Table.Body>{mapTransactionsToRows(transactions)}</Table.Body>
      </Table>
    </>
  );
};

TransactionsList.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TransactionsList;
