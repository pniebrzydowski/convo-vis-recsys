import React from 'react';
import * as d3 from 'd3';
import d3Venn from './d3-venn.js';

class VennDiagram extends React.Component {
	constructor(props) {
		super(props);

		this.WIDTH = 600;
		this.HEIGHT = 600;
		this.colors = d3.scaleOrdinal(d3.schemeCategory10);
		this.d3Venn = new d3Venn();
		this.svg = null;
	}

	createChart(nextProps) {
		var self = this;

		if(nextProps.sets.length === 0 ) return;

		var sets = nextProps.sets;
		var data = nextProps.chartData;
		var totalWt = 0;
		var queryWts = {};
		for(var i=0; i<nextProps.queryValues.length; i++) {
			var q = nextProps.queryValues[i];;
			totalWt += q.weight;
			queryWts[q.name] = q.weight;
		}
		var l = self.d3Venn.venn().size([this.WIDTH, this.HEIGHT]).setsSize(function(set) {
			if(queryWts[set.__key__]) {
				return nextProps.queryValues.length * set.size * queryWts[set.__key__] / totalWt;
			}
			else {
				var sets = set.__key__.split(',');
				var weightSum = 0;
				for(var i=0; i<sets.length; i++) {
					weightSum +=  queryWts[sets[i]] / totalWt;
				}
				return weightSum * set.size;
			}
		});
		var ld = l.nodes(data);

		if(!this.svg) {
			this.svg = d3.select('svg')
				.attr('width', this.WIDTH)
				.attr('height', this.HEIGHT);
		}

		self.svg.selectAll("*").remove();

		var nodes = self.svg.selectAll("g")
			.data(l.sets().values(), function (d) {
				return d.__key__;
			});


		var venn = nodes.enter()
			.append('g')
			.attr("class", function (d) {
				return "venn-area venn-" +
					(d.sets.length == 1 ? "circle" : "intersection");
			})
			.attr('fill', function (d, i) {
				return self.colors(i)
			})


		venn.append("path")
			.attr('d', function (d, i) {
				return d.d(1)
			})
			// .attr('fill', function(d,i) {return self.colors(i)} )
			.attr('opacity', 0.25)

		var points = venn.selectAll("circle.node")
			.data(function (d) {
				return d.nodes;
			})
			.enter()

		points.append('circle')
			.attr('cx', function(d){
				return d.x;
			})
			.attr('cy', function(d){
				return d.y;
			})
			.attr('r', function(d){
				return d.r;
			})
			.attr('class', 'node')
			.append('title')
			.text(function(d){
					return d.data.name;
				});
	}

	componentWillReceiveProps(nextProps) {
		var self = this;

		this.createChart(nextProps);
	}


	render() {
		return (
			<div className="venn-diagram">
				<svg></svg>
			</div>
 		);
	}
}

export default VennDiagram;