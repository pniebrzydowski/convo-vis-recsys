import React from 'react';
import SingleInput from './single-input.js';

class AggregateForm extends React.Component {
	constructor(props) {
	super(props);
		this.addQuery = props.handleQueryAdd;
		this.formSubmitted = false;
    this.state = {
      query: null,
      loc: null
		}
	
		this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleLocChange = this.handleLocChange.bind(this);
  }
	
	handleSubmit(event) {
		var self = this;
		self.formSubmitted = true;
		event.preventDefault();
		self.addQuery(self.state.query,self.state.loc);
	}

	handleQueryChange(event) {
		this.setState({query: event.target.value});
	}
	handleLocChange(event) {
		this.setState({loc: event.target.value});
	}
		
	render() {
		return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <SingleInput
            inputType="text"
            title="Near"
            name="location"
            placeholder="e.g., New York, NY"
            onChange={this.handleLocChange}
						disabled={this.formSubmitted}
          />
					<SingleInput
						inputType="text"
						title="Search for"
						name="query"
						placeholder="e.g., casual"
						onChange={this.handleQueryChange}
					/>
          <button type="submit">Search</button>
        </form>        
      </div>
 		);
	}
}

export default AggregateForm;