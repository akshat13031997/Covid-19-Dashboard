import React,{useState, useEffect} from 'react'
import {Line} from 'react-chartjs-2'
import numeral from "numeral";
import './Linegraph.css';
const options={
    legend:{
        display:false,
    },
    elements:{
        point:{
            radius:0,
        },
    },
    responsive : true,
    maintainAspectRatio: false,
    tooltips:{
        mode : "index",
        intersect: false,
        callbacks:{
            label: function(tooltipItem, data){
                return numeral(tooltipItem.value).format('+0,0');
            },
        },
    },
    scales:{
        xAxes:[
            {
                type: 'time',
                time:{
                    format:'MM/DD/YY',
                    tooltipFormat:'ll',
                },
            },
        ],
        yAxes :[
            {
                gridLines:{
                    display: false
                },
                ticks:{
                    callback: function(value, index, values){
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
}
const buildchartdata = (data, casestype)=>{
    const chardata = [];
    let lastdatapoint ;
    for(let date in data.cases)
    {
        if (lastdatapoint){
            let newdatapoint ={
                x:date,
                y: data[casestype][date]-lastdatapoint,
            };
            chardata.push(newdatapoint);
        }
        lastdatapoint = data[casestype][date];
    }
    return chardata;
}

function Linegraph({casestype='cases'}) {
    const [data,setData] = useState({});

    useEffect(() => {
        const fetchdata= async()=>{
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response)=>{
            return response.json();
        })
        .then((data)=>{
            let chartdata = buildchartdata(data,casestype);
            setData(chartdata);
            console.log(chartdata);
        });
    };
        fetchdata();
    }, [casestype]);
        
    return (
        <div className='graph'>
            {data?.length>0 &&(
            <Line
            options={options}
            data = {{
                datasets:[
                    {
                        backgroundColor: "rgba(204,16,52,0.5)", 
                        borderColor: "#CC1034",
                        data:data,
                    },
                ],
            }}
            />)}
        </div>
    )
}

export default Linegraph
