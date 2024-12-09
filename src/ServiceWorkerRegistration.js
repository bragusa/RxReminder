// src/serviceWorkerRegistration.ts
const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(\.\d{1,3}){3}$/));
export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
        if (publicUrl.origin !== window.location.origin) {
            return;
        }
        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
            if (isLocalhost) {
                // Check if we can find the service worker on localhost
                checkValidServiceWorker(swUrl, config);
            }
            else {
                // Register the service worker in production
                registerValidSW(swUrl, config);
            }
        });
    }
}
function registerValidSW(swUrl, config) {
    navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
        console.log('Service Worker registered with scope: ', registration.scope);
        if (config && config.onSuccess) {
            config.onSuccess(registration);
        }
    })
        .catch((error) => {
        console.error('Service Worker registration failed:', error);
        if (config && config.onError) {
            config.onError(error);
        }
    });
}
function checkValidServiceWorker(swUrl, config) {
    fetch(swUrl)
        .then((response) => {
        var _a;
        if (response.status === 404 ||
            ((_a = response.headers.get('content-type')) === null || _a === void 0 ? void 0 : _a.indexOf('javascript')) === -1) {
            // Service worker not found. We should unregister it and reload the page.
            navigator.serviceWorker.ready.then((registration) => {
                registration.unregister().then(() => {
                    window.location.reload();
                });
            });
        }
        else {
            registerValidSW(swUrl, config);
        }
    })
        .catch(() => {
        console.log('No internet connection found. App is running in offline mode.');
    });
}
export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => {
            registration.unregister();
        })
            .catch((error) => {
            console.error(error.message);
        });
    }
}
