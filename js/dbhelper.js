/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.将此更改为服务器上的RealthAsjsJSON文件位置
   */
  static get DATABASE_URL() {
    const port = 8000 // Change this to your server port将此更改为服务器端口
    return `http://localhost:${port}/data/restaurants.json`;
  }

  /**
   * Fetch all restaurants.获取所有的餐馆
   */
  static fetchRestaurants(callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL);
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!从服务器获得成功的响应！
        const json = JSON.parse(xhr.responseText);
        const restaurants = json.restaurants;
        callback(null, restaurants);
      } else { // Oops!. Got an error from server.哎呀！从服务器中出错。
        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    xhr.send();
  }

  /**
   * Fetch a restaurant by its ID.凭id获取餐馆。
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.通过正确的错误处理来获取所有餐馆。
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database餐厅不存在数据库中
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.通过适当的错误处理来烹饪餐厅。
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling通过正确的错误处理来获取所有餐馆
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type过滤餐厅只有菜肴类型
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.通过适当的错误处理从附近的餐馆取走
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants 获取所有的餐馆
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood 过滤餐厅只有给定的邻域
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.通过餐厅类型和街区信息来获取一个餐馆的。
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants 获取所有的餐馆
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine 过滤返回当前选中的餐厅类型
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood 过滤返回当前选中的街区信息
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);//返回一个符合餐厅类型和街区信息的数组组合
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.通过正确的错误处理来获取所有的街区。
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants 获取所有的餐馆
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants从所有的餐馆获取全部的邻居
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods删除邻居的复制品
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.通过正确的错误处理来获取所有菜肴。
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants 获取所有的餐馆
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants 从所有的餐馆获取全部的菜肴
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines 删除菜肴的复制品
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.餐馆页面地址
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.餐馆图片地址
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}`);
  }

  /**
   * Map marker for a restaurant.地图标记为餐馆
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}
