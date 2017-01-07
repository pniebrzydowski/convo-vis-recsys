import React from 'react';
import ReactDOM from 'react-dom';
import QueryFormContainer from './components/query-form-container.js';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return <QueryFormContainer />
  }  
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
