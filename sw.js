var staticCacheName = 'mws-static-v1';

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
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('wittr-') && cacheName != staticCacheName;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});
let requestNum=0;
self.addEventListener('fetch', function(event) {
    requestNum++;
    let modetype;
    if(event.request.url.indexOf(".html")==-1){
        event.respondWith(
            caches.match(event.request).then(function (response_cache) {
                console.log("back",response_cache,event.request.url);
                if(response_cache){
                    return response_cache;
                }
                else{
                    if(event.request.url.indexOf("https://maps.gstatic.com")==0 ||
                        event.request.url.indexOf("https://maps.googleapis.com")==0 ||
                        event.request.url.indexOf("https://fonts.googleapis.com")==0){
                        modetype='no-cors';
                    }else{
                        modetype='cors';
                    }
                    console.log("没找到重新去下载",modetype);
                    return fetch(event.request,{mode:modetype}).then(function (response) {
                        caches.open(staticCacheName)
                            .then(function(cache) {
                                console.log("save",response.type,event.request.url);
                                cache.put(event.request, response);

                            });
                        return response.clone();
                    });
                }
            })
        );
    }
})