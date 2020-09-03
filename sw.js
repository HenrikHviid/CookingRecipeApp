

self.addEventListener('install', event => {
    // fires when the browser installs the app
    // here we're just logging the event and the contents
    // of the object passed to the event. 
    // the purpose of this event is to give the service worker
    // a place to setup the local environment after the installation completes.
    console.log(`Event fired: ${event.type}`);
    console.dir(event);
});

self.addEventListener('activate', event => {
    // fires after the service worker completes its installation. 
    // It's a place for the service worker to clean up from previous 
    // service worker versions
    console.log(`Event fired: ${event.type}`);
    console.dir(event);
});

self.addEventListener('fetch', event => {
    // Fires whenever the app requests a resource (file or data)
    // Normally this is where the service worker would check to see
    // if the requested resource is in the local cache before going
    // to the server to get it. 
    console.log(`Fetching ${event.request.url}`);
    // Go get the requested resource from the network
    event.respondWith(fetch(event.request));
});