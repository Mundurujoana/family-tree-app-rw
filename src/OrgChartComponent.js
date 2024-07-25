import React, { useLayoutEffect, useRef, useEffect } from 'react';
import { OrgChart } from 'd3-org-chart';

const OrgChartComponent = React.forwardRef((props, ref) => {
  const d3Container = useRef(null);
  const chartRef = useRef(null);

  const addNode = (node) => {
    if (chartRef.current) {
      chartRef.current.addNode(node);
    }
  };

  useEffect(() => {
    props.setClick(addNode);
  }, [props]);

  useLayoutEffect(() => {
    if (props.data && d3Container.current) {
      if (!chartRef.current) {
        chartRef.current = new OrgChart();
      }

      chartRef.current
        .container(d3Container.current)
        .data(props.data)
        .svgWidth(500)
        .initialZoom(0.4)
        .onNodeClick((event, d) => {
          console.log(d + ' node clicked');
          console.log('props', Object.keys(props), d);
          props.onNodeClick(event, d.nodeId);
        })
        .render();
    }
  }, [props.data]);

  return (
    <div>
      <div ref={d3Container} />
    </div>
  );
});

export default OrgChartComponent;
