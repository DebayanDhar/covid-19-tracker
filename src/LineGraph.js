import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from "numeral";


const options = {
    legend:
    {
        display: false,
    },
    elements : {
        point : {
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
                    display: true,
                },
                ticks: {
                    callback: function (value, index, values){
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
}
const buildChartData = (data, casesType) => {
    let chartData = [];
    let lastDataPoint;
    for(let date in data.cases) {
        if(lastDataPoint) 
        {
            const newDataPoint ={
                x: date,
                y: data[casesType][date] - lastDataPoint
            }
           chartData.push(newDataPoint) ;
        }
        lastDataPoint = data[casesType][date];
    }
    return chartData;
}

function LineGraph({ country,casesType = "cases" })
{
    const [data, setData] = useState({});

    
    useEffect(() => {
        const fetchData = async () =>{
        let url = country === 'worldwide' ? 'https://disease.sh/v3/covid-19/historical/all?lastdays=120' : `https://disease.sh/v3/covid-19/historical/${country}?lastdays=120`
        await fetch(url)
        .then((response) => {return response.json()})
        .then((data) => {
            let newData = country === 'worldwide' ? data : data.timeline;

            let chartData = buildChartData(newData, casesType);
            setData(chartData);

        });
    };
        fetchData();
    }, [casesType,country]);



    return(
        <div>
            {data?.length > 0 && (
            <Line 
                options={options}
                data ={{
                    datasets: [{
                        backgroundColor : casesType === 'recovered' ? "rgba(125,215,29,0.5)" : "rgba(204, 16, 52, 0.5)",
                        borderColor : casesType === 'recovered' ? "#7dd71d" : "#CC1034",
                        data: data,
                    }]
                }}
                
            />
            )}

        </div>
    ) 
}

export default LineGraph;