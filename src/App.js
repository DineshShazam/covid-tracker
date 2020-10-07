import React,{useEffect,useState} from 'react';
import './App.css';
import axios from 'axios'
import {MenuItem,FormControl,Select, CardContent} from '@material-ui/core'
import CaseInfo from './components/Information/info.component';
import MapInfo from './components/Map/map';
import Table from './components/CasesTable/Table'
import {sotringData,roundingCounts} from './utils';
import LineGraph from './components/Charts/Line/LineGraph';
import "leaflet/dist/leaflet.css";

function App() {

   // This state is for dropdown
   const [countries,setCountries] = useState([]);
   // for dropdown default value
   const [country,setCountry] = useState('worldwide');
   // for handling informations
   const [caseInfo,setCaseInfo] = useState({});
   // for Table data
   const [tabledata,setTabledata] = useState([]);
   // for map location
   const [mapCenter,setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
   const [mapZoom,setMapZoom] = useState(2);
   const [mapCountries,setMapCountries] = useState([]);
  //  caseType state
   const[casesType,setCasesType] = useState('cases');


  useEffect(()=>{
    const url = `https://disease.sh/v3/covid-19/all`;
    axios.get(url).then(({data}) => {
      
      setCaseInfo(data)
    }).catch(err => console.log(`error at get all countries, ${err}`));
  },[])

   useEffect(()=>{
       axios.get('https://disease.sh/v3/covid-19/countries').then(({data})=>{
         
         setMapCountries(data);
          const country = data.map(({country,countryInfo})=>({
              name:country,
              value:countryInfo.iso2
          }))

          let sorted = sotringData(data);
          setTabledata(sorted);
          setCountries(country)

       }).catch(err =>  console.log(`error at dropdown countries, ${err}`));
   },[])


   const countryChange = (e) => {
     
       const value = e.target.value;
       console.log(value);
       setCountry(value);

       if(value === 'worldwide') {
         setMapCenter({ lat: 34.80746, lng: -40.4796 });
         setMapZoom(2);
       }

       const url = value === 'worldwide' ? `https://disease.sh/v3/covid-19/all`:`https://disease.sh/v3/covid-19/countries/${value}`
      
       axios.get(url).then(({data})=>{

        console.log(value);

        if(value === 'worldwide') {
          setMapCenter([34.80746,-40.4796]);
          setMapZoom(2);
        } else {
          setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
          setMapZoom(4);
        }
        
        setCaseInfo(data);

       }).catch(err=> console.log(`error at information,${err}`));
   }

  return (
    <div className="app">

      <div className="app__left">

        <div className="app__header">
            <h1>SDK-COVID-TRACKER</h1>

            {/* material design formControls */}
            <FormControl className="app__dropdown">
                <Select variant="outlined" value={country} onChange={countryChange}>
                    <MenuItem value="worldwide">WorldWide</MenuItem>
                    {
                        countries.map(({name,value})=>(
                        <MenuItem value={value}>{name}</MenuItem>
                        ))
                    }
                    
                </Select>
            </FormControl>
        </div>

        <div className="app__stats">
          {/* cases */}
            <CaseInfo onClick={e => {setCasesType('cases')}} isRed active={casesType === 'cases'} title="CoronaVirus Cases" cases={roundingCounts(caseInfo.todayCases)} total={roundingCounts(caseInfo.active)}/>

          {/* recovered */}
            <CaseInfo onClick={e => {setCasesType('recovered')}} active={casesType === 'recovered'} title="Recovered People" cases={roundingCounts(caseInfo.todayRecovered)} total={roundingCounts(caseInfo.recovered)}/>
          
          {/* Deaths */}
            <CaseInfo onClick={e => {setCasesType('deaths')}} isRed active={casesType === 'deaths'} title="Deaths" cases={roundingCounts(caseInfo.todayDeaths)} total={roundingCounts(caseInfo.deaths)}/>
        </div>

        <div className="app__map">
          <MapInfo casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
        </div>
      
      </div>

      

      {/* <div className="app__right"> */}
          <CardContent className="app__right">
            {/* cases table */}
            <h2>Live Cases by Country</h2>
               <Table countries={tabledata}/>
          <br/>
            {/* Chart.js */}
            <h2>WorldWide new Cases</h2>
                
            <LineGraph casesType={casesType} className="app__graph" />

          </CardContent>
      {/* </div> */}
    </div>
  

  );
}

export default App;
