import React from 'react';
import ReactDOM from 'react-dom';
import QueryFormContainer from './components/query-form-container.js';
import FoursquareSearch from './components/foursquare-search.js';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
	/*<QueryFormContainer />
	<svg id="chart-word-cloud"></svg>
	<StackedBarChart />
  <div id="chart-stacked-bar"></div>*/
  
  render() {
    return (
      <div>
        <FoursquareSearch />
      </div>
    );
  }  
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
