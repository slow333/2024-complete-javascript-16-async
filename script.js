'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

// <h3 className="country__name">${Object.values(data.name).slice(0, 1).join('')}</h3>
///////////////////////////////////////
const renderCountry = function(data, className = '') {
  const cntName = Object.values(data.name);
  const language = Object.values(data.languages);
  const currency = Object.values(data.currencies);

  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flags.svg}" />
    <div class="country__data">
      <h3 class="country__name">${cntName[0]}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
    +data.population / 1000000
  ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${language
    .slice(0, 3)
    .join(', ')}</p>
      <p class="country__row"><span>💰</span>${currency[0].name} ${
    currency[0].symbol
  }</p>
    </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = msg =>
  countriesContainer.insertAdjacentText('beforeend', msg);
countriesContainer.style.opacity = 1;

const getJSON = function(url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};

const getPosition = function() {
  return new Promise(function(resolve, reject) {
    /*    navigator.geolocation.getCurrentPosition(
          position => resolve(position),
          err => reject(err)
        )*/
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
const apiKey = '389071105374065544409x88138';


const whereAmIByLatLng = function(lat, lng) {
  getJSON(
    `https://geocode.xyz/${lat},${lng}?geoit=json&auth=${apiKey}`,
    'Geocode 문제'
  )
    .then(data => {
      const country = data.country;
      return getJSON(
        `https://restcountries.com/v3.1/name/${country}`,
        'Rest Countries 문제 '
      );
    })
    .then(data => {
      renderCountry(data[0]);

      const neighbour = data[0].borders;

      if (!neighbour) throw new Error('no neighbour country');
      return getJSON(`https://restcountries.com/v3.1/alpha?codes=${neighbour}`);
    })
    .then(data => data.forEach(d => renderCountry(d, 'neighbour')))
    .catch(err => {
      // console.log(err.message);
      renderError(err.message);
    })
    .finally((countriesContainer.style.opacity = 1));
};
const whereAmIByMyLocation = function() {
  getPosition()
    .then(pos => {
      console.log(pos.coords);
      // latitude: 36.4045923, longitude: 127.3940633
      const { latitude: lat, longitude: lng } = pos.coords;

      return getJSON(
        `https://geocode.xyz/${lat},${lng}?geoit=json&auth=${apiKey}`,
        'Geocode 문제'
      );
    })
    .then(data => {
      const country = data.country;
      return getJSON(
        `https://restcountries.com/v3.1/name/${country}`,
        'Rest Countries 문제 '
      );
    })
    .then(data => {
      renderCountry(data[0]);

      const neighbour = data[0].borders;

      if (!neighbour) throw new Error('no neighbour country');
      return getJSON(`https://restcountries.com/v3.1/alpha?codes=${neighbour}`);
    })
    .then(data => data.forEach(d => renderCountry(d, 'neighbour')))
    .catch(err => {
      // console.log(err.message);
      renderError(err.message);
    })
    .finally((countriesContainer.style.opacity = 1));
};

const whereAmIByMyLocationAsync = async function() {
  try {
    const geoLocation = await getPosition();
    const { latitude: lat, longitude: lng } = await geoLocation.coords;

    const resLocation = await fetch(
      `https://geocode.xyz/${lat},${lng}?geoit=json&auth=${apiKey}`
    );
    const dataLocation = await resLocation.json();

    const country = dataLocation.country;
    const resCountry = await fetch(
      `https://restcountries.com/v3.1/name/${country}`
    );
    const dataCountry = await resCountry.json();
    renderCountry(dataCountry[0]);
  } catch (err) {
    renderError(err.message);
  } finally {
    countriesContainer.style.opacity = 1;
  }
};


// TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
// TEST COORDINATES 2: 19.037, 72.873
// TEST COORDINATES 2: -33.933, 18.474
/*console.log('start');
setTimeout(() => console.log('zero time'), 0);

Promise.resolve('promise 1').then(res => console.log(res));
Promise.resolve('promise 2').then(res => {
  for(let i =0 ; i< 10000000000; i++){}
  console.log(res);
});
console.log('end');*/
// const lotteryPromise = new Promise(function(resolve, reject) {
//   console.log('Lottery draw is going on !!!');
//   setTimeout(function() {
//     if (Math.random() >= 0.5) {
//       resolve('You WIN 👌👌👌👌');
//     } else {
//       reject(new Error('You lost your money 💥💥💥💥'));
//     }
//   }, 2000);
// });
// lotteryPromise.then(res => console.log(res))
//   .catch(err => console.log(err));

// const wait = (seconds) =>
//   new Promise((resolve) =>
//     setTimeout(resolve, seconds * 1000));
// wait(2)
//   .then(() => {
//     console.log('I waited for 2 seconds');
//     return wait(1);
//   }).then(() => console.log('I waited for 1 second'));
// const wait = function (seconds) {
//   return new Promise(resolve => setTimeout(resolve, seconds * 1000));
// };
//
// const imageContainer = document.querySelector('.images');
// const loadImg = function (imgPath) {
//   return new Promise(function (resolve, reject) {
//     const img = document.createElement('img');
//     img.src = imgPath;
//     img.addEventListener('load', function () {
//       imageContainer.append(img);
//       resolve(img);
//     });
//     img.addEventListener('error', function () {
//       reject(new Error('image not found'));
//     });
//   });
// };
// let currentImg;
// loadImg('img/img-1.jpg')
//   .then(img => {
//     currentImg = img;
//     console.log(`${img.src} loaded`);
//     return wait(3);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//     return loadImg('img/img-2.jpg');
//   })
//   .then(img => {
//     currentImg = img;
//     console.log(`${img.src} loaded`);
//     return wait(3);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//     return loadImg('img/img-3.jpg');
//   })
//   .catch(err => console.error(err));
// async await 는 then return 대신 사용
// const loadImgAsync = async function () {
//   try {
//     const img = await loadImg('img/img-1.jpg');
//     currentImg = img;
//     await wait(2);
//     currentImg.style.display = 'none';
//     const img2 = await loadImg('img/img-2.jpg');
//     currentImg = img2;
//     await wait(2);
//     currentImg.style.display = 'none';
//     const img3 = await loadImg('img/img-3.jpg');
//   } catch (err) {
//     console.error(err);
//   }
// };
// loadImgAsync();

// Promise.all은 전체를 동시에 진행함
const getRenderCountry = async function(country) {
  const fetched = await fetch(`https://restcountries.com/v3.1/name/${country}`);
  if (!fetched.ok) throw new Error(`${country} not found : ${fetched.status}`);
  const data = await fetched.json();
  return renderCountry(data[0]);
};
const getMultiCountries = async function(search) {
  const cns = [...search];
  try {
    // 전체 promise를 동시에 진행함.. 순서 없음
    await Promise.all([
      cns.forEach((country) => getRenderCountry(country))]
    );
  } catch (error) {
    renderError(error);
    console.error(error);
  }
};
// Promise.race 는 여러 fetch를 동시에 진행해서 가장 빠른 것을 출력함.
(async function() {
  const res = await Promise.race([
    getJSON(`https://restcountries.com/v3.1/name/mexico`),
    getJSON(`https://restcountries.com/v3.1/name/egypt`),
    getJSON(`https://restcountries.com/v3.1/name/italy`),
    getJSON(`https://restcountries.com/v3.1/name/usa`)
  ]);
  console.log(res[0]);
})();

// 특정 시간이 지나면 연결을 종료하는 방법
const timeout = function(sec) {
  return new Promise(function(_, reject) {
    setTimeout(function() {
      reject(new Error('Connection took too long 💥💥'));
    }, sec);
  });
};
// Promise.race => 먼저 끝나는 promise return
Promise.race([
  getJSON(`https://restcountries.com/v3.1/name/italy`),
  timeout(19)
])
  .then(res => console.log(res))
  .catch(err => console.log(err));

// Promise.allSettled => 애러와 상관 없이 모든 결과를 출력해줌...
Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('Error'),
  Promise.resolve('Another success')]
)
  .then(res => console.log("promise allSettled ==> ", res));

// Promise.all => 전체 promise를 동시에 진행함.. 순서 없음
Promise.all([
  Promise.resolve('Success'),
  Promise.reject('Error'),
  Promise.resolve('Another success')]
)
  .then(res => console.log('promise all ==> ', res))
  .catch(err => console.log('promise all err ==> ', err));

// Promise.any => reject를 무시하고 성공한 것 까지만 ..[es2021]
Promise.any([
  Promise.resolve('Success'),
  Promise.reject('Error'),
  Promise.resolve('Another success')]
)
  .then(res => console.log("promise any ==> ", res))
  .catch(err => console.log("promise any err ==> ", err));






btn.addEventListener('click', function() {
  // whereAmI(-33.933, 18.474);
  // whereAmIByMyLocationAsync();
  getMultiCountries(['germany', 'usa', 'south korea', 'portugal', 'china']);
});


const imageContainer = document.querySelector('.images');

const loadImg = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;
    img.addEventListener('load', function () {
      imageContainer.append(img);
      resolve(img);
    });
    img.addEventListener('error', function () {
      reject(new Error('image not found'));
    });
  });
};

const wait = function(sec) {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, sec*1000)
  });
}

let currentImg;
const loadImgAsync = async function () {
  try {
    currentImg = await loadImg('img/img-1.jpg');
    await wait(2);
    currentImg.style.display = 'none';
    currentImg = await loadImg('img/img-2.jpg');
    await wait(2);
    currentImg.style.display = 'none';
    const img3 = await loadImg('img/img-3.jpg');
  } catch (err) {
    console.error(err);
  }
};
// loadImgAsync();
const createImg = async function (imgPath) {
  return new Promise(function (resolve, reject) {

    const img = document.createElement('img');
    img.src = imgPath;
    img.addEventListener('load', function () {
      imageContainer.append(img);
      resolve(img);
    });
    img.addEventListener('error', function () {
      reject(new Error("Image not found!!"))
    });
  });
};
const imgArr = ['img/img-1.jpg','img/img-2.jpg','img/img-3.jpg'];

const loadAllImages = async function(imgArr) {
  try {
    const images =  imgArr.map(async img =>await createImg(img));
    const imgsEl = await Promise.all(images)
    imgsEl.forEach(el => el.classList.add('parallel'))
  } catch (err) {
    console.log(err)
  }
}
loadAllImages(imgArr)