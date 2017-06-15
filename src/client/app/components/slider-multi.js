import React from 'react';
import ReactSlider from 'react-slider';

class SliderMulti extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let self = this;
		if (this.props.values.length <= 1) {
			return null;
		}

		let weightChange = function weightChange(value) {
			let vals = [];

			for(let val of self.props.values) {
				if(val.name === this.name) vals.push(value);
				else vals.push(val.weight);
			}
			self.props.handleWeightChange(vals);
		};

		return (
			<div className="weight-sliders">
				{this.props.values.map(function (val) {
					return (
						<ReactSlider
							key={val.name}
							name={val.name}
							min={1}
							max={10}
							orientation={"horizontal"}
							invert={true}
							value={val.weight}
							onAfterChange={weightChange}
						/>
					);
				})}
			</div>
		);
	}
}

export default SliderMulti;