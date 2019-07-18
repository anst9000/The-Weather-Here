const express = require('express')
const Datastore = require('nedb')
const fetch = require('node-fetch')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`Starting server at ${port}`)
})

app.use(express.static('public'))
app.use(express.json({
	limit: '1mb'
}))

const database = new Datastore('database.db')
database.loadDatabase()

app.get('/api', (request, response) => {
	database.find({}, (err, data) => {
		if (err) {
			response.end()
			return
		}
		response.json(data)
	})
})

app.post('/api', (request, response) => {
	const data = request.body
	const timestamp = Date.now()
	data.timestamp = timestamp
	database.insert(data)
	response.json(data)
})

const weather_api_key = process.env.API_KEY_WX
const weather_pre_url = 'https://api.darksky.net/forecast'
const aq_pre_url = 'https://api.openaq.org/v1/latest?coordinates='
const units = 'units=si'

app.get('/weather/:latlon', async (request, response) => {
	const latlon = request.params.latlon.split(',')
	const lat = latlon[0]
	const lon = latlon[1]

	const weather_url = `${weather_pre_url}/${weather_api_key}/${lat},${lon}/?${units}`
	const weather_response = await fetch(weather_url)
	const weather_data = await weather_response.json()

	const aq_url = `${aq_pre_url}/${lat},${lon}`
	const aq_response = await fetch(aq_url)
	const aq_data = await aq_response.json()

	const data = {
		weather: weather_data,
		air_quality: aq_data
	}

	response.json(data)

	console.log(request.params)
	console.log(latlon)
	console.log(lat, lon)
	console.log(aq_url)
})