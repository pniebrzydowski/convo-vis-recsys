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
		this.sets = [];
	}

	createChart(nextProps) {
		var self = this;

		if(nextProps.sets.length === 0 ) return;

		var sets = nextProps.sets;
		this.sets = sets;
		var data = nextProps.chartData;
		var totalWt = 0;
		var queryWts = {};
		var numQueries = nextProps.queryValues.length;
		for(var i=0; i<numQueries; i++) {
			var q = nextProps.queryValues[i];;
			totalWt += q.weight;
			queryWts[q.name] = q.weight;
		}
		var setLength = sets.length;
		var l = self.d3Venn.venn().size([this.WIDTH, this.HEIGHT]).setsSize(function(set) {
			if(queryWts[set.__key__]) {
				var adj = numQueries / setLength;
				return  adj * set.size * queryWts[set.__key__] / totalWt;
			}
			else {
				var subsets = set.__key__.split(',');
				var weightSum = 0;
				for(var i=0; i<subsets.length; i++) {
					weightSum +=  queryWts[sets[i]] / totalWt;
				}
				return weightSum * set.size * setLength / subsets.length / numQueries;
			}
		});
		var ld = l.nodes(data);

		if(!this.svg) {
			this.svg = d3.select('svg')
				.attr('width', this.WIDTH)
				.attr('height', this.HEIGHT);
		}

		self.svg.selectAll("*").remove();
		d3.selectAll(".tooltip").remove();

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
			.each(function(d, i) {
				if(d.sets.length === 1) {
					d3.select("#"+d.sets[0]+" .legend-icon").style("background-color", self.colors(i));
				}
			});


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

		// Define 'div' for tooltips
		var div = d3.select("body")
			.append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);

		points.append('circle')
			.attr('cx', function(d){
				return d.x;
			})
			.attr('cy', function(d){
				return d.y;
			})
			.attr('r', function(d){
				return d.r * d.data.set.length / numQueries;
			})
			.attr('class', 'node')
			.attr('opacity', 0.7)
			.on("click", function(d) {
				var elm = d3.select(this);
				d3.selectAll("circle.node").attr("opacity", 0.7);
				elm.attr("opacity", 1);
				div.transition()
					.duration(500)
					.style("opacity", 0);
				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.html(d.data.name)
					.style("left", (d3.event.pageX - 50) + "px")
					.style("top", (d3.event.pageY) + "px");
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