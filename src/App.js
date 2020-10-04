import React,{useEffect,useState} from 'react';
import './App.css';
import axios from 'axios'
import {MenuItem,FormControl,Select, CardContent} from '@material-ui/core'
import CaseInfo from './components/Information/info.component';
import MapInfo from './components/Map/map';
import Table from './components/CasesTable/Table'
import {sotringData} from './utils';

function App() {

   // This state is for dropdown
   const [countries,setCountries] = useState([]);
   // for dropdown default value
   const [country,setCountry] = useState('worldwide');
   //  for handling informations
   const [caseInfo,setCaseInfo] = useState({});
   //  for Table data
   const [tabledata,setTabledata] = useState([]);

  useEffect(()=>{
    const url = `https://disease.sh/v3/covid-19/all`;
    axios.get(url).then(({data}) => {
      console.log(data);
      setCaseInfo(data)
    }).catch(err => console.log(`get all cases data, ${err}`));
  },[])

   useEffect(()=>{
       axios.get('https://disease.sh/v3/covid-19/countries').then(({data})=>{
         console.log(data)
          const country = data.map(({country,countryInfo})=>({
              name:country,
              value:countryInfo.iso2
          }))

          let sorted = sotringData(data);
          setTabledata(sorted);
          setCountries(country)

       }).catch(err => console.log(`Error at receiving countries, ${err}`));
   },[])


   const countryChange = (e) => {
       const value = e.target.value;
       setCountry(value);

       const url = value === 'worldwide' ? `https://disease.sh/v3/covid-19/all`:`https://disease.sh/v3/covid-19/countries/${value}`

       axios.get(url).then(({data})=>{
        setCaseInfo(data);
       }).catch(err=>`error at information,${err}`)
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
            <CaseInfo title="CoronaVirus Cases" cases={caseInfo.todayCases} total={caseInfo.active}/>

          {/* recovered */}
            <CaseInfo title="Recovered People" cases={caseInfo.todayRecovered} total={caseInfo.recovered}/>
          
          {/* Deaths */}
            <CaseInfo title="Deaths" cases={caseInfo.todayDeaths} total={caseInfo.deaths}/>
        </div>

        <div className="app__map">
          <MapInfo />
        </div>
      
      </div>

      

      <div className="app__right">
          <CardContent>
            {/* cases table */}

               <Table countries={tabledata}/>
          
            {/* Chart.js */}
            <h1>WorldWide new Cases</h1>
          </CardContent>
      </div>
    </div>
  

  );
}

export default App;
