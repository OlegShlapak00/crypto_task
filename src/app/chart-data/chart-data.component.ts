import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ChartDataRecord} from "../../models/models";

@Component({
  selector: 'app-chart-data',
  templateUrl: './chart-data.component.html',
  styleUrl: './chart-data.component.css'
})
export class ChartDataComponent implements OnChanges{
  @Input() chartData: ChartDataRecord[];

  chart: any;

  chartOptions = {
    exportEnabled: true,
    axisX: {
      valueFormatString: "HH:mm",

    },
    axisY: {
      crosshair: {
        enabled: true
      }
    },
    data:[{
      type: "candlestick",
      yValueFormatString: "##.####",
      xValueFormatString: "DD MMM YYYY, HH:mm",
      dataPoints: []
    }]
  }

  getChartInstance(chart: object) {
    this.chart = chart;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData']) {
      this.chartOptions.data[0].dataPoints = this.chartData as any;
      this.chart?.render();
    }
  }
}
