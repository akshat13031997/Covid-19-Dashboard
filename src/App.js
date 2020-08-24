import React,{useState, useEffect} from 'react';
import "./App.css";
import
{
  MenuItem,
  FormControl,
  Card,
  CardContent,
  Select,
}from '@material-ui/core';
import Map from './Map';
import InfoBox from './InfoBox' 
import Table from './Table';
import {sortData,prettyinfostat} from './util';
import Linegraph from './Linegraph';
import "leaflet/dist/leaflet.css";

function App(){
  const [countries, setCountries] = useState([]);
  const [country,setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setmapCenter] = useState({lat:34.80746, lng:-40.4796});
  const [mapZoom, setmapZoom] = useState(3); 
  const [mapCountries, setmapCountries] = useState([]);
  const [casesType,setcasesType] = useState('cases');
  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data=>{
      setCountryInfo(data);
    });
  },[])

  useEffect(() => {
    const getCountries = async()=>{
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then((response)=>response.json())
      .then((data)=>{
        const countries = data.map((country)=>({
            name:country.country,
            value:country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries); 
          setmapCountries(data);
        });
      };

      getCountries();
  }, []);

  const onCountryChange = async(event)=>{
    const countryCode = event.target.value;
    const url = countryCode==='worldwide' ? "https://disease.sh/v3/covid-19/all" :`https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then(response =>response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
      setmapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setmapZoom(4);
    });
  };

  return (
    <div className='app'>
      <div className="app_left">
      <div className="app_header">
      <h1>COVID-19 Tracker</h1>
      <FormControl className="app_dropdown">
        <Select variant='outlined' 
        onChange={onCountryChange}
        value={country}>
          <MenuItem value="worldwide">Worldwide</MenuItem>
          {countries.map((country)=>(
            <MenuItem value={country.value}>{country.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      </div>
      
      <div className="app_stats"> 
        <InfoBox active={casesType==='cases'} onClick={(e)=>setcasesType('cases')} title='Coronavirus Cases' cases={prettyinfostat(countryInfo.todayCases)} total={prettyinfostat(countryInfo.cases)}/>
        
        <InfoBox active={casesType==='recovered'} onClick={(e)=>setcasesType('recovered')} title='Recovered' cases={prettyinfostat(countryInfo.todayRecovered)} total={prettyinfostat(countryInfo.recovered)}/>

        <InfoBox active={casesType==='deaths'} onClick={(e)=>setcasesType('deaths')} title='Deaths' cases={prettyinfostat(countryInfo.todayDeaths)} total={prettyinfostat(countryInfo.deaths)}/>
      </div>
      <div className="Map">
      <Map casesType={casesType} countries = {mapCountries} center={mapCenter} zoom={mapZoom}/>
      </div>
      
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>
          <h3>WorldWide new Cases</h3>
          <div className="graph"><Linegraph casestype={casesType}/></div>
        </CardContent>
      </Card>
      </div>
  );
}

export default App;