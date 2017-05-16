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
	}

	createChart(nextProps) {
		var self = this;

		console.log(nextProps);
		if(nextProps.sets.length === 0 ) return;

		var sets = nextProps.sets;
		var data = nextProps.chartData;

/*		var setChar = 'ABCDEFGHIJKLMN';
		var charFn = i => setChar[i];
		var setLength = 4;
		var sets = d3.range(setLength).map(function (d, i) {
			return setChar[i]
		});

		var dataLength = 180,
			ii = 0,
			data = d3.range(dataLength).map((d, i) => {
				var l = Math.floor((Math.random() * setLength / 3) + 1),
					set = [],
					c,
					i;
				for (i = -1; ++i < l;) {
					c = charFn(Math.floor((Math.random() * setLength)));
					if (set.indexOf(c) == -1) {
						set.push(c)
					}
				}
				return {
					set: set,
					name: 'set_' + ii++
				}
			});
*/
		var l = self.d3Venn.venn().size([this.WIDTH, this.HEIGHT]),

			ld = l.nodes(data);

		var svg = d3.select('svg')
			.attr('width', this.WIDTH)
			.attr('height', this.HEIGHT);

		var nodes = svg.selectAll("g")
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

		venn.append("text")
			.attr("class", "label")
			.text(function (d) {
				return d.__key__;
			})
			.attr("text-anchor", "middle")
			.attr("dy", ".35em")
			.attr("x", function (d) {
				return d.center.x
			})
			.attr("y", function (d) {
				return d.center.y
			});

		var points = venn.selectAll("circle.node")
			.data(function (d) {
				return d.nodes
			})
			.enter()

		points.append('circle')
			.attr('class', 'node')
			.attr("cx", function (d) {
				return d.x
			})
			.attr("cy", function (d) {
				return d.y
			})
			.attr('r', 3)

		venn.append('circle')
			.attr('class', 'inner')
			.attr('fill', 'grey')
			.attr('opacity', 0.2)
			.attr("cx", function (d) {
				return d.center.x
			})
			.attr("cy", function (d) {
				return d.center.y
			})
			.attr('r', function (d) {
				return d.innerRadius
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