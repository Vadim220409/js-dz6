const countryInput = document.querySelector('.countryInput');
const countryListContainer = document.querySelector('.countryList');
const countryInfoContainer = document.querySelector('.countryInfo');
let debounceTimer;

countryInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const countryName = countryInput.value.trim();

    if (countryName) {
      fetch(`https://restcountries.com/v2/name/${encodeURIComponent(countryName)}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Country not found');
          }
          return response.json();
        })
        .then(data => {
          if (data.length > 10) {
            showErrorNotification('Make the search more specific.');
          } else if (data.length >= 2 && data.length <= 10) {
            showCountryList(data);
          } else if (data.length === 1) {
            showCountryInfo(data[0]);
          } else {
            showErrorNotification('No matching countries found.');
          }
        })
        .catch(error => {
          console.error('Error fetching country data:', error);
          showErrorNotification('Country not found or an error occurred.');
        });
    } else {
      clearContainers();
    }
  }, 500);
});

function showErrorNotification(message) {
  alert(message); // Замініть на власний спосіб показу повідомлень
}

function showCountryList(countries) {
  const countryNames = countries.map(country => country.name);
  countryListContainer.innerHTML = `<p>Found countries: ${countryNames.join(', ')}</p>`;
  clearCountryInfo();
}

function showCountryInfo(country) {
    const { name, capital, population, languages, flags } = country;
    let flagSrc = '';
    if (flags && flags.length > 0) {
      flagSrc = flags[0];
    } else if (country.hasOwnProperty('flag')) {
      flagSrc = country.flag;
    }
  
    countryInfoContainer.innerHTML = `
      <h2>${name}</h2>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${languages.map(lang => lang.name).join(', ')}</p>
      ${flagSrc ? `<img src="${flagSrc}" alt="Flag of ${name}" style="max-width: 200px;">` : 'No flag available'}
    `;
  
    clearCountryList();
}


function clearContainers() {
  clearCountryList();
  clearCountryInfo();
}

function clearCountryList() {
  countryListContainer.innerHTML = '';
}

function clearCountryInfo() {
  countryInfoContainer.innerHTML = '';
}