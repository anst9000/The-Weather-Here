// Geo Locate
let lat, lon
const api_key = '70306e9f4fca0aea51eed6afb74a75cd'
const weather = 'https://api.darksky.net/forecast'
const route = 'weather'
const button = document.querySelector('#check-in')

button.onclick = () => {
	console.log('Button clicked')
	if ('geolocation' in navigator) {
		console.log('geolocation available')
		navigator.geolocation.getCurrentPosition(async position => {
			try {
				lat = position.coords.latitude.toFixed(2)
				lon = position.coords.longitude.toFixed(2)
				document.getElementById('latitude').textContent = lat
				document.getElementById('longitude').textContent = lon
				const api_url = `${route}/${lat},${lon}`
				// const api_url = '/weather'
				console.log(api_url)
				const response = await fetch(api_url)
				console.log('Waiting...')
				console.log(response)
				const json = await response.json()
				const weather = json.weather.currently
				const air = json.air_quality.results[0].measurements[0]

				document.getElementById('summary').textContent = weather.summary
				document.getElementById('temperature').textContent = weather.temperature

				document.getElementById('aq_parameter').textContent = air.parameter
				document.getElementById('aq_value').textContent = air.value
				document.getElementById('aq_unit').textContent = air.unit
				document.getElementById('aq_date').textContent = air.lastUpdated.substring(0, 10)

				const data = { lat, lon, weather, air }
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				}

				const db_response = await fetch('/api', options)
				const db_json = await db_response.json()

				console.log(db_json)
			} catch (error) {
				console.error(error)
				document.getElementById('aq_value').textContent = '__NO VALUE__'
				// console.log('Something went wrong.')

			}
		})
	} else {
		console.log('geolocation not available')
	}
}

