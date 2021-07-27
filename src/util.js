import React from "react";
import numeral from "numeral";
import {Circle, Popup} from "react-leaflet";



const casesTypeColors = {
    cases:{
        hex: "#CC1034",
        multiplier: 600,
    },
    recovered:{
        hex: "#7dd71d",
        multiplier: 900,
    },
    deaths: {
        hex: "#fb4443",
        multiplier: 1500,
    },
}
export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";


export const sortData = (data) => {
    const sortedData = [...data];
    sortedData.sort((a,b) => (a.cases > b.cases ? -1 : 1));
    return sortedData;
}

//draws circles on map 
export const showDataOnMap = (data, casesType='cases') => {
    
    return data.map((country,i) => {
       
        return (
            <Circle
            key={i}
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.2}
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            radius={
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
            }
            >
                <Popup>
                    <div className="info-container">
                        <div
                            className="info-flag"
                            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
                        />
                        <div className="info-name">{country.country}</div>
                        <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                        <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                        <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                    </div>

                </Popup>


            </Circle>
        );

    });
}