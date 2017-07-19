import React from 'react';
import * as d3 from 'd3';
import d3Venn from './d3-venn.js';

class VennDiagram extends React.Component {
	constructor(props) {
		super(props);

		this.WIDTH = 800;
		this.HEIGHT = 800;
		this.colors = d3.scaleOrdinal(d3.schemeCategory10);
		this.d3Venn = new d3Venn();
		this.svg = null;
	}

	createChart(nextProps) {
		let self = this;

		if(nextProps.queries.length === 0 ) return;

		let sets = nextProps.queries;
		let data = nextProps.data;

		for(let d of data) {
			d.set = [];
			for (let s of sets) {
				if(d[s]) {
					d.set.push(s);
				}
			}
		}

		let totalWt = 0;
		let queryWts = {};
		let numQueries = nextProps.queryValues.length;
		for(let q of nextProps.queryValues) {
			totalWt += q.weight;
			queryWts[q.name] = q.weight;
		}
		let l = self.d3Venn.venn().size([this.WIDTH, this.HEIGHT])
			.setsSize(function(set) {
				let size;
				if(queryWts[set.__key__]) {
					size = set.size * queryWts[set.__key__] / totalWt;
				}
				else {
					let subsets = set.__key__.split(',');
					let weightSum = 0;
					for(let i=0; i<subsets.length; i++) {
						weightSum +=  queryWts[sets[i]] / totalWt;
					}
					size = weightSum * 10 / subsets.length / subsets.length;
				}
				set.nodes = set.nodes.slice(0,10);
				return size;
			});
		let ld = l.nodes(data);

		if(!this.svg) {
			this.svg = d3.select('svg')
				.attr('width', this.WIDTH)
				.attr('height', this.HEIGHT);
		}

		self.svg.selectAll("*").remove();
		d3.selectAll(".tooltip").remove();

		let nodes = self.svg.selectAll("g")
			.data(l.sets().values(), function (d) {
				return d.__key__;
			});


		let venn = nodes.enter()
			.append('g')
			.attr("class", function (d) {
				return "venn-area venn-" +
					(d.sets.length == 1 ? "circle" : "intersection");
			})
			.attr('fill', function (d, i) {
				return self.colors(i);
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
			.attr('fill', 'none')
			.attr('stroke', function (d, i) {
				if(d.sets.length === 1) {
					return self.colors(i);
				}
				return 'none';
			})
			.attr('stroke-width', 3);

		let points = venn.selectAll("circle.node")
			.data(function (d) {
				return d.nodes;
			})
			.enter()

		// Define 'div' for tooltips
		let div = d3.select("body")
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
				if(d.data.totalScore < 20) return 0;
				return 6 * (5-numQueries);
			})
			.attr('class', 'node')
			.attr('fill', '#000')
			.attr('opacity', function(d){
				return d.data.totalScore / 100;
			})
			.on("click", function(d) {
				d3.event.stopPropagation();
				let elm = d3.select(this);
				div.transition()
					.duration(500)
					.style("opacity", 0);
				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.html(self.getTooltip(d))
					.style("left", (parseFloat(elm.attr("cx")) + 267.5) + "px")
					.style("top", (parseFloat(elm.attr("cy")) + parseFloat(elm.attr("r")) + 12) + "px");
			})
			.each(function(d, i) {
				if(d.data.name === nextProps.data[0].name) {
					let elm = d3.select(this);
					div.transition()
						.duration(200)
						.style("opacity", .9);
					div.html(self.getTooltip(d))
						.style("left", (parseFloat(elm.attr("cx")) + 267.5) + "px")
						.style("top", (parseFloat(elm.attr("cy")) + parseFloat(elm.attr("r")) + 12) + "px");
				}
			});
		;

		d3.select(".weight-sliders").on("click", function() {
			d3.event.stopPropagation();
		});

		d3.select("body").on("click", function(d) {
			d3.selectAll(".tooltip")
				.style("opacity", 0)
				.style("left", (-1000) + "px")
				.style("top", (-1000) + "px");
		});
	}

	getTooltip(d) {
		let tooltip =
			d.data.name + "<br>" +
			Math.round(d.data.totalScore);
		return tooltip;
	}

	componentWillReceiveProps(nextProps) {
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