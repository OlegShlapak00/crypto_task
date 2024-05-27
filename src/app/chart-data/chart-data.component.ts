import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as d3 from "d3";
import {ChartDataRecord} from "../../models/models";

@Component({
  selector: 'app-chart-data',
  templateUrl: './chart-data.component.html',
  styleUrl: './chart-data.component.css'
})
export class ChartDataComponent implements OnInit, OnChanges {
  @Input() transformedChartData: ChartDataRecord[] | null;

  private svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);


  ngOnInit(): void {
    this.createSvg();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes ['transformedChartData'].firstChange) {
      this.updateChart(this.transformedChartData);
    }
  }

  private createSvg(): void {
    this.svg = d3.select(".chart-data div#lineChart")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")")

  }

  private updateChart(transformedData: any): void {
    // Create a group for the chart elements
    d3.select("div#lineChart svg").remove();
    this.createSvg();
    const chartGroup = this.svg.append("g");

    // Create scales
    const xScale = d3.scaleUtc()
      .domain(d3.extent(transformedData, (d: any) => d.date) as any)
      .range([0, this.width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(transformedData, (d: any) => d.price) as any])
      .range([this.height, 0]);

    // Create a line generator
    const line = d3.line()
      .x((d: any) => xScale(d.date))
      .y((d: any) => yScale(d.price));

    // Draw the line
    chartGroup.append("path")
      .datum(transformedData)
      .attr("class", "line")
      .attr("d", line)


    // Add axes
    chartGroup.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${this.height})`)
      .call(d3.axisBottom(xScale));

    chartGroup.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale));


    //Styling line. Just for example
    this.svg.selectAll('.line')
      .style('fill', 'none')
      .style('stroke', '#6C4CFC')
      .style('stroke-width', '2');
  }
}
