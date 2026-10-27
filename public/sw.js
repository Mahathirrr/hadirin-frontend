self.addEventListener('push', (event) => {
  let data = { title: 'Hadirin', body: '' }
  try {
    if (event.data) data = { ...data, ...event.data.json() }
  } catch {
    data.body = event.data?.text() ?? ''
  }
  event.waitUntil(self.registration.showNotification(data.title, { body: data.body }))
})
