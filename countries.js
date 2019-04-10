class Country {
  constructor() {
    this.base_url = 'https://restcountries.eu/rest/v2/';
  }

  async getAllCountries() {
    const getAllResponse = await fetch(`${this.base_url}all`);

    const response = await getAllResponse.json();
    return {
      response
    }
  }

  async getCountry(category, searchParam) {
    const getNamesResponse = await fetch(`${this.base_url}${category}/${searchParam}`);

    const response = await getNamesResponse.json();
    return {
      response
    }
  }
}
