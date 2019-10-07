import { Header, Message, Table, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const performance = value => {
  const color = {};
  if (value < 0) {
    color.color = 'red';
  } else if (value === 0) {
    color.color = 'grey';
  } else {
    color.color = 'green';
  }
  return color;
};

/* eslint-disable no-underscore-dangle, react/jsx-one-expression-per-line */
const mapStocksToRows = stocks => {
  return stocks.map(s => {
    const color = performance(s.performance);
    return (
      <Table.Row key={s._id} style={{ size: '5em' }} data-cy="portfolio-list">
        <Table.Cell style={color}>
          <span>{s.ticker}</span>
        </Table.Cell>
        <Table.Cell>{`${s.shares} shares`}</Table.Cell>
        <Table.Cell style={color}>{s.value}</Table.Cell>
      </Table.Row>
    );
  });
};

const PortfolioList = ({ portfolio, fetchError }) => {
  return (
    <>
      <Segment>
        <Header size="huge">Portfolio - {portfolio.value}</Header>
        {fetchError && <Message error header="Oops!" content={fetchError} />}
      </Segment>
      <Table>
        <Table.Body>{mapStocksToRows(portfolio.stocks)}</Table.Body>
      </Table>
    </>
  );
};
/* eslint-enable no-underscore-dangle, react/jsx-one-expression-per-line */

PortfolioList.propTypes = {
  portfolio: PropTypes.shape({
    value: PropTypes.string.isRequired,
    stocks: PropTypes.array.isRequired,
  }).isRequired,
  fetchError: PropTypes.string.isRequired,
};

export default PortfolioList;
