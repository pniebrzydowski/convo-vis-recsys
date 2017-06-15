import React from 'react';
import ReactDOM from 'react-dom';
import RestaurantSearch from './adapters/restaurant-search.js';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <RestaurantSearch />
    );
  }  
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
