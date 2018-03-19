import React from 'react';
import PropTypes from 'prop-types';

class Hello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'JR',
    };
  }

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <p>{this.state.name}</p>
      </div>
    );
  }
}

Hello.propTypes = {
  title: PropTypes.string,
};

Hello.defaultProps = {
  title: 'Hello World',
};

export default Hello;
