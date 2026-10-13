const CACHE_NAME = 'nptel-studyroom-v6'
const APP_BASE_URL = new URL('./', self.registration.scope)
const APP_SHELL_URL = new URL('index.html', APP_BASE_URL)
const APP_ROOT_URL = new URL('./', APP_BASE_URL)

async function cacheJavaScriptTree(cache, assetUrl, seen = new Set()) {
  if (seen.has(assetUrl.href)) return
  seen.add(assetUrl.href)

  const response = await fetch(assetUrl)
  if (!response.ok) throw new Error(`Failed to cache app asset: ${assetUrl.pathname}`)
  if (!response.headers.get('content-type')?.includes('javascript')) {
    throw new Error(`App asset did not return JavaScript: ${assetUrl.pathname}`)
  }
  const source = await response.clone().text()
  await cache.put(assetUrl, response)

  const childAssets = [...source.matchAll(/["']([^"']+\.js(?:\?[^"']*)?)["']/g)]
    .map((match) => {
      const path = match[1]
      return /^(?:\.\/)?assets\//.test(path)
        ? new URL(path.replace(/^\.\//, ''), APP_BASE_URL)
        : new URL(path, assetUrl)
    })
    .filter((url) => url.origin === APP_BASE_URL.origin && url.pathname.startsWith(APP_BASE_URL.pathname))
  await Promise.all(childAssets.map((url) => cacheJavaScriptTree(cache, url, seen)))
}

async function cacheApplicationShell(response) {
  if (!response.ok) throw new Error('Failed to fetch the application shell.')
  const html = await response.clone().text()
  const cache = await caches.open(CACHE_NAME)
  await cache.put(APP_SHELL_URL, response.clone())
  await cache.put(APP_ROOT_URL, response)

  const stylesheetUrls = [...html.matchAll(/href=["']([^"']+\.css(?:\?[^"']*)?)["']/g)]
    .map((match) => new URL(match[1], APP_BASE_URL))
  const entryScriptUrls = [...html.matchAll(/src=["']([^"']+\.js(?:\?[^"']*)?)["']/g)]
    .map((match) => new URL(match[1], APP_BASE_URL))

  await Promise.all([
    ...stylesheetUrls.map((url) => cache.add(url)),
    ...entryScriptUrls.map((url) => cacheJavaScriptTree(cache, url)),
  ])
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    fetch(APP_SHELL_URL)
      .then((response) => cacheApplicationShell(response))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith('nptel-studyroom-') && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      ))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  const requestUrl = new URL(request.url)
  if (
    request.method !== 'GET' ||
    requestUrl.origin !== APP_BASE_URL.origin ||
    !requestUrl.pathname.startsWith(APP_BASE_URL.pathname)
  ) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            try {
              await cacheApplicationShell(response.clone())
            } catch (error) {
              console.error('Could not refresh the offline app cache.', error)
            }
          }
          return response
        })
        .catch(async () => (await caches.match(APP_SHELL_URL)) || (await caches.match(APP_ROOT_URL))),
    )
    return
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse
      return fetch(request)
        .then((response) => {
          if (!response.ok) return response
          const responseCopy = response.clone()
          return caches.open(CACHE_NAME)
            .then((cache) => cache.put(request, responseCopy))
            .then(() => response)
        })
        .catch(async () =>
          (await caches.match(request, { ignoreSearch: true })) ||
          (await caches.match(requestUrl.pathname)),
        )
    }),
  )
})
