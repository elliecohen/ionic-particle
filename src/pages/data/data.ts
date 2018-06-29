import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ThingspeakProvider } from '../../providers/thingspeak/thingspeak';
import { ParticleProvider } from '../../providers/particle/particle';
import { ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

/**
 * Generated class for the DataPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-data',
  templateUrl: 'data.html',
})
export class DataPage {

    @ViewChild('lineCanvas') lineCanvas;
    lineChart: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public thingspeak: ThingspeakProvider, public particle: ParticleProvider) {
    thingspeak.readKey = 'ETI646LKFVQNCAJY';
    thingspeak.channel = '529336';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DataPage');
  }

  refresh() {
    this.thingspeak.getChannel(240).subscribe(   //5760 per day, 240 per hour, 4 per minuite
    (data) => {
            var dataObj = JSON.parse(data.text());
            this.graph(dataObj);
        },

        (error) => { console.log("error", error); },
        () => { console.log("canceled"); }
    );
  }

  graph(data: any) {

            var dataLabels = [];
            var dataPoints = [];
            for (var i in data.feeds) {
                dataLabels.push( data.feeds[i].created_at );
                dataPoints.push( data.feeds[i].field1 );
            }
            this.lineChart = new Chart(this.lineCanvas.nativeElement, {

            type: 'line',
            data: {
                labels: dataLabels,
                datasets: [
                    {
                        label: data.channel.field1,
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: dataPoints,
                        spanGaps: false,
                    }
                ]
            }

        });
  }

}
