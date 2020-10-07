import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {Line} from 'react-chartjs-2'
import numeral from 'numeral'

const LineGraph = ({casesType,...props})=>{

    const options = {
        legend: {
          display: false,
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        maintainAspectRatio: false,
        tooltips: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function (tooltipItem, data) {
              return numeral(tooltipItem.value).format("+0,0");
            },
          },
        },
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                format: "MM/DD/YY",
                tooltipFormat: "ll",
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                callback: function (value, index, values) {
                  return numeral(value).format("0a");
                },
              },
            },
          ],
        },
      };

    const [value,setValue] = useState({});

    useEffect(() => {

        axios.get('https://disease.sh/v3/covid-19/historical/all?lastdays=30').then(({data}) => {

        
        let newData = lineData(data,casesType);
        
        setValue(newData);

        }).catch(err => console.log(`error at line graph, ${err}`))

    },[casesType])

   

    const lineData = (data,caseType) => {
        console.log(caseType);
        let chartData = [];
        let lastDatePoint;

        for(let date in data.cases) {
            if(lastDatePoint) {
                let newDataPoint = {
                    x:date,
                    y: data[caseType][date] - lastDatePoint
                }
                chartData.push(newDataPoint);
            }
            lastDatePoint = data[caseType][date];
        }
        
        return chartData;
    }

    

    return (
        <div className={props.className}>
            {
                value?.length > 0 && 
                (
                <Line data={{
                    datasets: [{
                        backgroundColor: "rgba(204, 16, 52, 0.5)",
                        borderColor: "#CC1034",
                        data:value
                    }],
                    }} 
                    
                    options={options}/>
                )
            }
            
        </div>
    )
}

export default LineGraph