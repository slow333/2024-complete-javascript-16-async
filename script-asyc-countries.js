'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
const renderCountries = function (data, className = '') {
  let currencies = Object.values(data.currencies)[0];
  let langugae = Object.values(data.languages).toString();

  const html = `
    <article class="country ${className}">
      <img class="country__img" src=${data.flags.svg} />
      <div class="country__data">
        <h3 class="country__name">${data.name.official}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>
           ${(+data.population / 1_000_000).toFixed(1)} millions people</p>
        <p class="country__row"><span>🗣️</span>${langugae}</p>
        <p class="country__row"><span>💰</span>${currencies.name} ${currencies.symbol} </p>
      </div>
    </article>
    `;
  countriesContainer.insertAdjacentHTML('beforeend', html);

};
//////////////////////////////////////
/*const newRequest = function (data) {
  const neighbour = data.borders;
  console.log(neighbour)
  const request2 = new XMLHttpRequest();
  request2.open('GET',
    `https://restcountries.com/v3.1/alpha?codes=${neighbour}`); // 코드 여러게
  request2.send();
  request2.addEventListener('load', function () {
    const data = JSON.parse(this.responseText);
    data.forEach(d => renderCountries(d, 'neighbour'))
  });
};*/
const newRequest = function (data) {
  const neighbour = data.borders;

  fetch(`https://restcountries.com/v3.1/alpha?codes=${neighbour}`)
    .then(response => response.json())
    .then(data =>
      data.forEach(d =>
        renderCountries(d, 'neighbour')
      ));
};
/*const getCountryAndNeighbor = function (country){
  const request = new XMLHttpRequest();
  request.open('GET',

    `https://restcountries.com/v3.1/name/${country}`); // 나라이름 포함
  request.send();

  request.addEventListener('load', function () {
    const data = JSON.parse(this.responseText);
    if(!data) return;
    data.forEach(d => {
      // Render countries
      renderCountries(d);
      newRequest(d);
      }
    );
  });
}*/

const renderError = function (msg) {
  countriesContainer.insertAdjacentHTML('beforeend', `
  <div class="error">${msg}  ==> 문제가 발생했습니다.</div>
  `)
};
const getJSON = function (url, errorMsg = '문제 발생!!!') {
  return fetch(url).then(
    response => {
      if (!response.ok)
        throw Error(`${errorMsg} ${response.status}`)
      return response.json()
    }
  )
};
/*const getCountryAndNeighbor = function (country) {

  fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`)
    .then(response => {
      if(!response.ok)
        throw Error(`입력한 나라는 없어용: ${country} => ${response.status}`)
      return response.json()
    })
    .then(data => {
      if (!data) return;
      renderCountries(data[0]);
      const neighbour = data[0].borders;
      if (!neighbour) return ;
      return fetch(`https://restcountries.com/v3.1/alpha?codes=${neighbour}`)
    })
    .then(response => response.json())
    .then(data => data.forEach(d => renderCountries(d, 'neighbour')))
    .catch(err => {
      console.log(`😎😎😎 ${err} 애러 애러 😎😎😎`)
      renderError(`${err.message}.`)
    })
    .finally(() => countriesContainer.style.opacity = 1)
}*/
const getCountryAndNeighbor = function (country) {

  getJSON(`https://restcountries.com/v3.1/name/${country}`,
    'country not found')
    .then(data => {
      if (!data) return;
      renderCountries(data[0]);

      const neighbour = data[0].borders;
      if (!neighbour) throw new Error('No neighbour@@@@');
      return getJSON(`https://restcountries.com/v3.1/alpha?codes=${neighbour}`,
        '이웃 나라가 없어용')
    })
    .then(data => data.forEach(d => renderCountries(d, 'neighbour')))
    .catch(err => {
      console.log(`😎😎😎 ${err} 애러 애러 😎😎😎`)
      renderError(`${err.message}`)
    })
    .finally(() => countriesContainer.style.opacity = 1)
}
// getCountryAndNeighbor('usa');

btn.addEventListener('click', function () {
  getCountryAndNeighbor('australia');
});








// api 간단 설명
// languages,capital 검색 , 다른거는 안됨
// 'https://restcountries.com/v3.1/independent?status=true&fields=languages,capital');
// 'https://restcountries.com/v3.1/all'); // name, flags 검색
// 'https://restcountries.com/v3.1/all?fields=name,flags'); // name, flags 검색
// 'https://restcountries.com/v3.1/name/south korea?fullText=true'); // 나라이름
// Search by cca2, ccn3, cca3 or cioc country code (yes, any!)
// 'https://restcountries.com/v3.1/alpha/col'); // code 이름으로 검색
// `https://restcountries.com/v3.1/alpha?codes=kr,180,no,est,pe`); // code 이름으로 검색
// `https://restcountries.com/v3.1/alpha?codes=${country}`); // code 이름으로 검색