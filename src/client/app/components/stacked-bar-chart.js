import React from 'react';
import * as d3 from 'd3';
import {BarStackHorizontalChart} from 'react-d3-basic';

class StackedBarChart extends React.Component {
	constructor(props) {
		super(props);
    
    this.WIDTH = 800;
    this.HEIGHT = 500;
    this.xDomain = [0,100];
    this.xTickFormat = d3.format(".3");
    this.yScale = 'ordinal';
		this.margins = {
			top: 10,
			right: 20,
			bottom: 50,
			left: 130
		};
  }
  
  x(d) {
    return +d;
  }
  y(d) {
    return d.name;
  }

  getSeries() {
		let series = [];
		for(let query of this.props.queries) {
			series.push({
				field: query,
				name: query
			})
		}

		return series;
	}

	getData() {
		return this.props.data.slice(0,10).reverse();
	}
		
	render() {
		if(this.props.queries.length === 0) {
			return null;
		}

		let series = this.getSeries();
		let data = this.getData();

		return (
			<BarStackHorizontalChart
				data= {data}
				width= {this.WIDTH}
				height= {this.HEIGHT}
				chartSeries = {series}
				x= {this.x}
				xDomain= {this.xDomain}
				xTickFormat= {this.xTickFormat}
				y= {this.y}
				yScale = {this.yScale}
				horizontal= {true}
				margins= {this.margins}
			/>
 		);
	}
}

export default StackedBarChart;