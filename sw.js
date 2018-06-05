var staticCacheName = 'mws-static-v1';
var _cache;
console.log("check")
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            _cache=cache;
            return cache.addAll([
                '/',
                'restaurant.html',
                'js/main.js',
                'js/dbhelper.js',
                'js/iscroll.js',
                'js/restaurant_info.js',
                'css/styles.css',
                'img/1.jpg',
                'img/2.jpg',
                'img/3.jpg',
                'img/4.jpg',
                'img/5.jpg',
                'img/6.jpg',
                'img/7.jpg',
                'img/8.jpg',
                'img/9.jpg',
                'img/10.jpg',
                'data/restaurants.json'
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    console.log()
    /*event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('wittr-') &&
                        cacheName != staticCacheName;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );*/
});

self.addEventListener('fetch', function(event) {
    //console.log(event.request);
    let checkURL=event.request.url.indexOf("maps.googleapis.com");
    if(!event.request.url)console.log(event.request);
    //if(checkURL==-1) {
        event.respondWith(
            caches.match(event.request)
                .then(function (response) {
                    //if (response.url) console.log(response.url, "matchOK")
                    if (response) {
                        return response;
                    }
                })
                .catch(function (response) {
                    console.log(response)
                    if(checkURL==-1){
                        fetch(event.request).then(function (response_2) {
                            //console.log(response_2);
                            _cache.put(event.request, response_2);
                            return response_2
                        })
                    }else{
                        fetch(event.request,{mode:'no-cors'}).then(function (response_3) {
                           // console.log(response_3);
                            _cache.put(event.request, response_3);
                            return response_3
                        })
                    }

                })
        )
    //}
})