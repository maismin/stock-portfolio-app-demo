import PropTypes from 'prop-types';
import { Button, Container, Form, Message, Segment } from 'semantic-ui-react';

const StockForm = ({
  stock,
  loading,
  disabled,
  error,
  transactionOptions,
  handleChange,
  handleSubmit,
}) => (
  <Container>
    <Form loading={loading} error={Boolean(error)} onSubmit={handleSubmit}>
      <Message error header="Oops!" content={error} />
      <Segment>
        <Form.Input
          fluid
          label="Ticker"
          placeholder="Ticker"
          name="ticker"
          type="text"
          value={stock.ticker}
          onChange={handleChange}
        />
        <Form.Input
          fluid
          label="Shares"
          placeholder="Shares"
          name="shares"
          type="number"
          min="1"
          value={stock.shares}
          onChange={handleChange}
        />
        <Form.Dropdown
          placeholder="Select an action"
          fluid
          selection
          options={transactionOptions}
          onChange={handleChange}
        />
        <Button
          disabled={disabled || loading}
          fluid
          type="submit"
          name="action"
          color="black"
          content="Submit"
        />
      </Segment>
    </Form>
  </Container>
);

StockForm.propTypes = {
  stock: PropTypes.shape({
    action: PropTypes.string.isRequired,
    ticker: PropTypes.string.isRequired,
    shares: PropTypes.string.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  transactionOptions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default StockForm;
