class UI {
  constructor() {
    this.searchResults = document.getElementById('search-results');
  }

  createCountries(list) {
    //Clear results
    this.clearResults();

    // Append search results
    for(let i = 0; i < list.response.length; i++){
      const currentCountry = list.response[i];
      const country = document.createElement('div');
      country.className = 'country';
      country.innerHTML =
      `<div class="col s12 m6 l4">
        <div class="card">
          <div class="card-image">
            <img name="${currentCountry.alpha3Code}" src="${currentCountry.flag}"/>
            <span class="card-title flow-text">${currentCountry.name}</span>
          </div>
        </div>
      </div>`;

      const countryCard = country.firstChild.childNodes[1]

      searchResults.appendChild(country);

      country.addEventListener('click', countrySelection);
    }
  }

  async countryInfoPage(countryRes) {
    //Clear results
    this.clearResults();

    // Create country info page
    const country = countryRes.response;
    const countryPage = document.createElement('div');
    countryPage.className = 'country-page';
    countryPage.innerHTML =
    `
    <h3>${country.name}</h3>
    <div class='row'>

      <div class='col s12 l4'>
        <div class='col s12'>
          ${this.namesInfo(country.name, country.nativeName, country.altSpellings)}
        </div>
        <div class='col s12'>
          ${this.codesInfo(country.topLevelDomain, country.alpha2Code, country.alpha3Code, country.callingCodes)}
        </div>
        <div class='col s12'>
          ${this.langInfo(country.languages)}
        </div>
      </div>

      <div class='col s12 l4'>
        <div class='col s12'>
          ${this.geographyInfo(country.capital, country.region, country.subregion, country.population, country.latlng, country.demonym, country.area)}
        </div>
        <div class='col s12'>
          ${this.currencyInfo(country.currencies)}
        </div>
      </div>

      <div class='col s12 l4'>
        <div class='col s12'>
          <img class="responsive-img" src="${country.flag}"/>
        </div>
        <div class='col s12'>
          <div id="mapid"></div>
        </div>
      </div>

    </div>
    `;

    searchResults.appendChild(countryPage);
  }

  namesInfo(countryName, nativeName, altSpellings) {
    const tableTitle = 'Names';
    const countryTableList = [['Common', countryName], ['Native', nativeName], ['Alternative Spellings', altSpellings]];

    return this.createTable(tableTitle, countryTableList);
  }

  langInfo(languages) {
    const tableTitle = 'Languages';
    const langTableList = [];

    // loop through langauages push array of iso2 and name
    languages.forEach(function(lang) {
      // create lang array
      const langArray = [lang.name, lang.iso639_2];

      // push langArray to langTableList
      langTableList.push(langArray);
    });

    // call createTable with info and return it;
    return this.createTable(tableTitle, langTableList);
  }

  codesInfo(domain, alpha2, alpha3, calling) {
    const tableTitle = 'Codes';
    const codeTableList = [ ['Domain', domain], ['Alpha 2', alpha2], ['Alpha 3', alpha3], ['Calling', calling] ];
    return this.createTable(tableTitle, codeTableList);
  }

  currencyInfo(currencies) {
    const tableTitle = 'Currencies';
    const currencyTableList = [];

    // loop through currencies push array of name, code and symbol
    currencies.forEach(function(currency) {
      // create currencyArray
      const currencyArray = [currency.symbol, currency.name, currency.code];

      // push currencyArray to langTableList
      currencyTableList.push(currencyArray);
    });

    // call createTable with info and return it;
    return this.createTable(tableTitle, currencyTableList);
  }

  geographyInfo(capital, region, subregion, population, latlng, demonym, area) {
    const tableTitle = 'Geography';
    const geoTableList = [ ['Capital', capital], ['Region', region], ['Subregion', subregion], ['Lat/Lng', latlng], ['Demonym', demonym], ['Area', `${area}km²`], ['Population', population] ];

    // calculate pop density
    const popDensityCalc = (population / area).toFixed(2);
    // create popdensity arr
    const popDensity = ['Population Density', popDensityCalc];

    // push to geotable
    geoTableList.push(popDensity);

    return this.createTable(tableTitle, geoTableList);
  }

  createTable(title, tableList) {
    // define our elements
    const table = document.createElement('table');
    const tableHead = document.createElement('thead');
    const tableBody = document.createElement('tbody');

    // assign title to table head
    tableHead.innerHTML =
    `
      <tr>
        <th>
          <h5>${title}</h5>
        </th>
        <th></th>
        ${title === 'Currencies' ? '<th></th>' : ''}
      </tr>
    `;

    // loop through table list create tr for every index and assign the values within
    for(let i = 0; i < tableList.length; i++){
      const tableRow = document.createElement('tr');

      // forEach index in tableList[i] create a td and append to table row
      tableList[i].forEach(function(tableData) {
        const td = document.createElement('td');
        td.innerHTML = tableData;
        tableRow.appendChild(td);
      })

      // append table row to table body
      tableBody.appendChild(tableRow)
    }

    // append table head and body
    table.appendChild(tableHead);
    table.appendChild(tableBody);

    // return the outerHTML of the table so it can be used in
    // innerHTML template string where it's called;
    return table.outerHTML;
  }

  mapInit(countryData) {
    // receive coordinates
    const coordinates = countryData.response.latlng;

    // init map
    const mymap = L.map('mapid').setView(coordinates, 7);

    const mapKey = process.env.MAP_KEY;

    L.tileLayer(`https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=${mapKey}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: `${mapKey}`
    }).addTo(mymap);
  }

  showAlert() {
    // clear all search results
    this.clearResults();

    // create alert
    const alert = document.createElement('div');
    alert.className = 'col s12';
    alert.innerHTML = "<h1 class='center-align'>No results found</h1>";

    // append alert
    this.searchResults.appendChild(alert);
  }

  clearResults() {
    // Clear search results while loop is actually faster than this.searchResults.innerHTML = '';
    while (this.searchResults.firstChild) {
      this.searchResults.removeChild(searchResults.firstChild);
    }
  }
}
