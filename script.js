'use strict';

// In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.
//
// Here are your tasks:
// PART 1
// 1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
// key 389071105374065544409x88138

// 2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
// The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉

// 3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
// 4. Chain a .catch method to the end of the promise chain and log errors to the console
// 5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.
//
// PART 2
// 6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
const renderCountries = function (data, className = '') {
  let currencies = Object.values(data.currencies)[0];
  let langugae = Object.values(data.languages)
    .toString()
    // .split(',')
    // .slice(0,2).join(',');

  const html = `
    <article class="country ${className}">
      <img class="country__img" src=${data.flags.svg} />
      <div class="country__data">
        <h3 class="country__name">${data.name.official}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>
           ${(+data.population / 1_000_000).toFixed(1)} millions people</p>
        <p class="country__row" ><span>🗣️</span>${langugae}</p>
        <p class="country__row"><span>💰</span>${currencies.name} ${currencies.symbol} </p>
      </div>
    </article>
    `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
};
const renderError = function (msg) {
  countriesContainer.insertAdjacentHTML('beforeend', `
  <div class="error">${msg}  ==> 문제가 발생했습니다.</div>
  `)
};
const whereAmIByCity = function (city) {
  fetch(`https://geocode.xyz/${city}?json=1&auth=389071105374065544409x88138`)
    .then(response => response.json())
    .then(data => fetch(`https://geocode.xyz/${data.latt},${data.longt}?geoit=json&auth=389071105374065544409x88138`))
    .then(response => {
      if(response.status === 403) throw new Error(`횟수 초과`);
      if(!response.ok) throw new Error(`${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log(`You are in ${data.city}, ${data.country}`)
      return data;
    })
    .then(data => fetch(`https://restcountries.com/v3.1/name/${data.country}`))
    .then(response => {
      if (!response.ok)  throw Error(`${response.status} ==> 나라 찾기`)
      return response.json()
    })
    .then(data => {
      if (!data) return;
      renderCountries(data[0]);

      const neighbour = data[0].borders;
      if (!neighbour) throw new Error('No neighbour@@@@');
      return fetch(`https://restcountries.com/v3.1/alpha?codes=${neighbour}`)
    })
    .then(response => {
      if (!response.ok)  throw Error(`${response.status} ==> 나라 찾기`)
      return response.json()
    })
    .then(data => data.forEach(d => renderCountries(d, 'neighbour')))
    .catch(err => {
      console.log(`😎😎😎 ${err} 애러 애러 😎😎😎`)
      renderError(`${err.message}`)
    })
    .finally(() => countriesContainer.style.opacity = 1)
};

const whereAmIByLatLng = function (lat, lng) {
  fetch(`https://geocode.xyz/${lat},${lng}?geoit=json&auth=389071105374065544409x88138`)
    .then(response => {
      if(response.status === 403) throw new Error(`횟수 초과`);
      if(!response.ok) throw new Error(`${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log(`You are in ${data.city}, ${data.country}`)
      return fetch(`https://restcountries.com/v3.1/name/${data.country}`)
    })
    .then(response => {
      if (!response.ok)  throw Error(`${response.status} ==> 나라 찾기`)
      return response.json()
    })
    .then(data => {
      if (!data) return;
      renderCountries(data[0]);

      const neighbour = data[0].borders;
      if (!neighbour) throw new Error('No neighbour@@@@');
      return fetch(`https://restcountries.com/v3.1/alpha?codes=${neighbour}`)
    })
    .then(response => {
      if (!response.ok)  throw Error(`${response.status} ==> 나라 찾기`)
      return response.json()
    })
    .then(data => data.forEach(d => renderCountries(d, 'neighbour')))
    .catch(err => {
      console.log(`😎😎😎 ${err} 애러 애러 😎😎😎`)
      renderError(`${err.message}`)
    })
    .finally(() => countriesContainer.style.opacity = 1)
};
const getLocation = function () {
  return new Promise((resolve, reject) => {
    return navigator.geolocation.getCurrentPosition(resolve, reject)
    // position => console.log(position),
    // err => console.log(err))
  })
};

const whereAmIByLocation = function () {
  getLocation().then(res => {
    const {latitude: lat, longitude: lng} = res.coords;
    return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json&auth=389071105374065544409x88138`)
  })
    .then(response => {
      if(response.status === 403) throw new Error(`횟수 초과`);
      if(!response.ok) throw new Error(`${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log(`You are in ${data.city}, ${data.country}`)
      return fetch(`https://restcountries.com/v3.1/name/${data.country}`)
    })
    .then(response => {
      if (!response.ok)  throw Error(`${response.status} ==> 나라 찾기`)
      return response.json()
    })
    .then(data => {
      if (!data) return;
      renderCountries(data[0]);

      const neighbour = data[0].borders;
      if (!neighbour) throw new Error('No neighbour@@@@');
      return fetch(`https://restcountries.com/v3.1/alpha?codes=${neighbour}`)
    })
    .then(response => {
      if (!response.ok)  throw Error(`${response.status} ==> 나라 찾기`)
      return response.json()
    })
    .then(data => data.forEach(d => renderCountries(d, 'neighbour')))
    .catch(err => {
      console.log(`😎😎😎 ${err} 애러 애러 😎😎😎`)
      renderError(`${err.message}`)
    })
    .finally(() => countriesContainer.style.opacity = 1)
};



// fetch('https://geocode.xyz/Hauptstr.,+57632+Berzhausen?json=1&auth=389071105374065544409x88138')
// fetch('https://geocode.xyz/seoul?json=1&auth=389071105374065544409x88138')
//   .then(response => response.json())
//   .then(data => console.log(data))
// 7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)
//
// TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
// TEST COORDINATES 2: 19.037, 72.873
// TEST COORDINATES 2: -33.933, 18.474
//
// GOOD LUCK 😀

///////////////////////////////////////
// Coding Challenge #2

/*
Build the image loading functionality that I just showed you on the screen.

Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉

PART 1
1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path. When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. In case there is an error loading the image ('error' event), reject the promise.

If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Consume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);
5. After the second image has loaded, pause execution for 2 seconds again;
6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.

GOOD LUCK 😀
*/
/*const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

const container2 = document.querySelector('.images');

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;
    img.alt = imgPath;
    img.addEventListener('load', function () {
      container2.append(img);
      resolve(img);
    });
    img.addEventListener('error', function () {
      reject(new Error('image is not... '));
    });
  })
};
let currentImg;
createImage('/img/img-1.jpg')
  .then(res => {
    currentImg = res;
    return wait(2);
  })
  .then(() => {
    currentImg.remove();
    return createImage('/img/img-2.jpg')
  })
  .then(img => {
    currentImg = img;
    return wait(2);
  })
  .then(() => {
    currentImg.remove();
    return createImage('/img/img-3.jpg')
  })
  .catch(err => {
    console.log(err)
    container2.insertAdjacentText('beforeend', err)
  })*/

const whereAmIAsync = async function(country){
  await fetch(`https://restcountries.com/v3.1/name/${country}`);
}


btn.addEventListener('click', function () {
  // whereAmIByCity('berlin');
  // whereAmIByLatLng(52.508, 13.381);
  // whereAmIByLatLng(19.037, 72.873);
  // whereAmIByLatLng(-33.933, 18.474);
  whereAmIByLocation();
});

















