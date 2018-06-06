let restaurants,
  neighborhoods,
  cuisines
var map
var markers = []


let _registerServiceWorker = function() {
    if (!navigator.serviceWorker) return;

    var indexController = this;

    navigator.serviceWorker.register('/sw.js').then(function(reg) {
        if (!navigator.serviceWorker.controller) {
            return;
        }

        if (reg.waiting) {

            return;
        }

        if (reg.installing) {

            return;
        }

        reg.addEventListener('updatefound', function() {

        });
    }).catch(function(error) {
        // registration failed
        console.log('Registration failed with ' + error);
    });
};




/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.在页面加载的时候获取街区信息和餐馆类型
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
  _registerServiceWorker();
});

/**
 * Fetch all neighborhoods and set their HTML.获取所有街区信息并将值传入fillNeighborhoodsHTML（）
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML. 将街区信息逐条传入select中，形成下拉列表
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.fillCuisinesHTML（）获取所有餐馆类型并将值传入fillNeighborhoodsHTML（）
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.将餐馆类型逐条传入select中，形成下拉列表
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.初始化谷歌地图
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
}

/**
 * Update page and map for current restaurants. 更新当前地图上的餐厅
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;//当前选中的餐厅类型值
  const neighborhood = nSelect[nIndex].value;//当前选中的街区类型值

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.删除所有餐厅删除所有地图标记
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants 删除所有餐厅
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');//从页面上获取ul列表
  ul.innerHTML = '';//清空目前所有的ul子元素

  // Remove all map markers 删除所有地图标记
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;//令self.restaurants 等于当前选中项目筛选出来的数组
}

/**
 * Create all restaurants HTML and add them to the webpage.创建所有餐厅页面并添加到页面上
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.创建餐厅的信息页面
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
  li.className = 'col-2';

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = "A picture of the restaurant in action";
  image.setAttribute("tabindex",0);
  li.append(image);

  const name = document.createElement('h1');
  name.innerHTML = restaurant.name;
  name.setAttribute("tabindex",0);
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  neighborhood.setAttribute("tabindex",0);
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  address.setAttribute("tabindex",0);
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  more.setAttribute("aria-label","View Details");
  more.setAttribute("role","button");
  li.append(more)

  return li
}

/**
 * Add markers for current restaurants to the map.在地图上添加当前餐厅的标记。
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    //为marker标记添加点击事件，跳转到marker标记的url地址。
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}
