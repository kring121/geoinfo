// Materialize inits
document.addEventListener('DOMContentLoaded', function() {
    var select = document.querySelectorAll('select');
    M.FormSelect.init(select);
});

// Init country and ui classes
const country = new Country;
const ui = new UI;

// Define DOM elements
const select = document.getElementById('select');
const search = document.getElementById('search');
const searchResults = document.getElementById('search-results');

// Define event listeners
select.addEventListener('change', searchCategory);
search.addEventListener('keyup', searchInfo);


// Define search and category at start
let searching = '';
let category = select.value;

// If nothing entered yet, search for all countries
country.getAllCountries()
.then(data => ui.createCountries(data))

// Define event functions
function searchCategory(e) {
  category = e.target.value;
}

function searchInfo(e) {
  searching = e.target.value;
  if(searching !== '') {
    country.getCountry(category, searching)
    .then(data => {
      if(data.response.message === 'Not Found' || data.response.message === 'Bad Request') {
        // if no response alert no results
        ui.showAlert()
      } else {
        ui.createCountries(data)
      }
    })
  } else {
    country.getAllCountries()
    .then(data => ui.createCountries(data))
  }
}

function countrySelection(e) {
  // return countryCode from event
  const countryCode = e.target.name;

  // search that country
  country.getCountry('alpha', countryCode)
  .then(
    data => ui.countryInfoPage(data)
    .then(ui.mapInit(data))
    );
}




