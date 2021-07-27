import React, { useEffect, useState } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
  
} from "@material-ui/core";
import Table from "./Table";
import InfoBox from "./InfoBox";
import Map from "./Map"; 
import { sortData } from "./util";
import LineGraph from "./LineGraph";
import {prettyPrintStat} from "./util.js";
import "leaflet/dist/leaflet.css";
import './App.css';

function App() {

  const [countries, setCountries] = useState([]);
  const [countryName, setCountryName] = useState("Worldwide");
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");


  useEffect(() => {//for the worldwide data on the very first load
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  }, []);



  useEffect(() => {//for the list of countries on the very first load

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));

        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };

    getCountriesData();


  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    


    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;//backticks for string concatination
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
      if (countryCode === 'worldwide') 
      setMapCenter({ lat: 34.80746, lng: -40.4796 });
      else
      {
        setMapCenter({lat: data.countryInfo.lat, lng: data.countryInfo.long});
        setCountryName(data.country);
      }
      setMapZoom(4);

    })




  }


  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country,i) => (
                <MenuItem key={i} value={country.value}>{country.name}</MenuItem>
              ))}



            </Select>
            
            
          </FormControl>


        </div>
        <div className="app__stats">
          <InfoBox 
            isRed
            active={casesType ==="cases"}
            onClick={e => setCasesType("cases")}
            title="Coronavirus Cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox 
            active={casesType ==="recovered"}
            onClick={e => setCasesType("recovered")}
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)} 
          />
          <InfoBox 
            isRed
            active={casesType ==="deaths"}
            onClick={e => setCasesType("deaths")}
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)}
          />


        </div>
        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>


      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
          <h3>Live Cases By Country</h3>
          <Table countries={tableData}/>
          <h3>{countryName} new {casesType}</h3>
          
          <LineGraph country={country} className="app__graph" casesType={casesType}/>
          
          </div>
        </CardContent>

      </Card>
          
     
    </div>
  );
}

export default App;
