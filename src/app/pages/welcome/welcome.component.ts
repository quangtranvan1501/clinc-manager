import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})

export class WelcomeComponent implements OnInit {
  constructor(
    private appService: AppService,
  ) { }

  Highcharts: typeof Highcharts = Highcharts;
  // updateFlag = false;

  data1 = [];
  data2 = [];
  data3 = [];
  data4 = [];

  renderChart1(){
    Highcharts.chart('chart1', {
      chart: {
        type: 'pie',
        height: 300
      },
      title: {
        text: 'Biểu đồ thống kê bệnh nhân theo giới tính',
        style: {
          fontSize: '16px',
          fontWeight: '700'
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          type: 'pie',
          data: this.data1.map((item: any) => ({name: item.gender, y: item.tong})),
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.percentage:.1f} %',
            distance: -30,
          }
        },
      ],
    })
  }

  renderChart2(){
    Highcharts.chart('chart2', {
      chart: {
        type: 'pie',
        height: 300
      },
      title: {
        text: 'Biểu đồ thống kê bác sỹ theo giới tính',
        style: {
          fontSize: '16px',
          fontWeight: '700'
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          type: 'pie',
          data: this.data2.map((item: any) => ({name: item.gender, y: item.tong})),
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.percentage:.1f} %',
            distance: -30,
          }
        },
      ],
    })
  }

  renderChart3(){
    Highcharts.chart('chart3', {
      chart: {
        type: 'line',
        height: 300
      },
      title: {
        text: 'Biểu đồ thống kê doanh thu theo tháng',
        style: {
          fontSize: '16px',
          fontWeight: '700'
        }
      },
      legend:{
        enabled: false
      },
      xAxis: {
        categories: this.data3.map((item: any) => item.month),
      },
      credits: {
        enabled: false
      },
      yAxis: {
        title: {
          text: 'Doanh thu (VNĐ)'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:16px; font-weight: 700">Tháng {point.key}</span></br></br>',
        pointFormat: 'Doanh thu: <b>{point.y} VNĐ</b>'
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [
        {
          type: 'line',
          name: 'Doanh thu',
          data: this.data3.map((item: any) => item.totalRevenue),
        },
      ],
    })
  }

  renderChart4(){
    Highcharts.chart('chart4', {
      chart: {
        type: 'column',
        height: 300
      },
      title: {
        text: 'Biểu đồ top 10 dịch vụ được sử dụng nhiều nhất',
        style: {
          fontSize: '16px',
          fontWeight: '700'
        }
      },
      legend:{
        enabled: false
      },
      xAxis: {
        categories: this.data4.map((item: any) => item.serviceName),
      },
      credits: {
        enabled: false
      },
      yAxis: {
        title: {
          text: ''
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:16px; font-weight: 700">{point.key}</span></br></br>',
        pointFormat: 'Số lượng: <b>{point.y} VNĐ</b>'
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [
        {
          type: 'column',
          name: 'Sô lượng',
          data: this.data4.map((item: any) => item.totalQuantity),
        },
      ],
    })
  }

  getTop10Services(){
    this.appService.find<any>('/manager/top-10-services').subscribe((res: any) => {
      if (!res.body) {
        return
      }
      if (res.body) {
        this.data4 = res.body.data;
        this.renderChart4();
      }
    })
  }

  getTotalRevenueByMonth(){
    this.appService.find<any>('/manager/total-revenue-by-month').subscribe((res: any) => {
      if (!res.body) {
        return
      }
      if (res.body) {
        this.data3 = res.body.data;
        this.renderChart3();
      }
    })
  }

  getCountGender1() {
    const body: HttpParams = new HttpParams();

    this.appService.get<any>(body.set('role', 'user'), '/manager/count-gender').subscribe((res: any) => {
      if (!res.body) {
        return
      }
      if (res.body) {
        this.data1 = res.body.data;
        this.renderChart1();
      }
    })
  }

  getCountGender2() {
    const body: HttpParams = new HttpParams();

    this.appService.get<any>(body.set('role', 'doctor'), '/manager/count-gender').subscribe((res: any) => {
      if (!res.body) {
        return
      }
      if (res.body) {
        this.data2 = res.body.data;
        this.renderChart2();
      }
    })
  }
  
  ngOnInit() {
    this.getCountGender1();
    this.getCountGender2();
    this.getTotalRevenueByMonth();
    this.getTop10Services()
  }

}
