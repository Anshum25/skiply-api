# Skiply API - Backend Server

Backend API for the Skiply queue management platform with location services.

## Features

- **Location Services**
  - Get all Indian cities (200+ cities)
  - Popular cities with icons
  - Alphabetically grouped cities
  - City search functionality
  - Current location detection using geolocation + reverse geocoding

## Tech Stack

- Node.js
- Express.js
- Axios (for external API calls)
- BigDataCloud API (for reverse geocoding)

## Project Structure

```
skiply-api/
├── controllers/
│   └── locationController.js   # Location API logic
├── routes/
│   └── locationRoutes.js       # API routes
├── server.js                   # Main server file
├── package.json                # Dependencies
├── .env                        # Environment variables
└── README.md                   # This file
```

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   The `.env` file is already created with default values:
   ```
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

## Running the Server

### Development Mode (with auto-restart):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

### Get All Cities
```
GET /api/location/cities
```
Returns all cities in both flat array and grouped by alphabet.

**Response:**
```json
{
  "success": true,
  "data": {
    "cities": ["Ahmedabad", "Bangalore", ...],
    "groupedCities": {
      "A": ["Ahmedabad", "Agra", ...],
      "B": ["Bangalore", "Bhopal", ...],
      ...
    },
    "count": 200
  }
}
```

### Get Popular Cities
```
GET /api/location/cities/popular
```
Returns top 10 popular cities with icons.

**Response:**
```json
{
  "success": true,
  "data": {
    "cities": [
      { "name": "Mumbai", "icon": "🏙️" },
      { "name": "Delhi NCR", "icon": "🏙️" },
      ...
    ]
  }
}
```

### Search Cities
```
GET /api/location/cities/search?query=mumbai
```
Search cities by query string.

**Response:**
```json
{
  "success": true,
  "data": {
    "cities": ["Mumbai"],
    "count": 1
  }
}
```

### Get Current Location
```
GET /api/location/current?latitude=19.0760&longitude=72.8777
```
Get city name from coordinates using reverse geocoding.

**Response:**
```json
{
  "success": true,
  "data": {
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "latitude": 19.0760,
    "longitude": 72.8777
  }
}
```

## CORS Configuration

The server is configured to accept requests from:
- `http://localhost:3000` (React development server)
- Any URL specified in `FRONTEND_URL` environment variable

## Error Handling

All endpoints return errors in the following format:
```json
{
  "success": false,
  "message": "Error message",
  "error": {} // Only in development mode
}
```

## External APIs Used

- **CountriesNow Cities API**
  - Endpoint: `https://countriesnow.space/api/v0.1/countries/cities`
  - Free tier, no API key required
  - Provides **4,000+ Indian cities** dynamically
  - Data cached for 24 hours to improve performance

- **BigDataCloud Reverse Geocoding API**
  - Endpoint: `https://api.bigdatacloud.net/data/reverse-geocode-client`
  - Free tier, no API key required
  - Used for converting GPS coordinates to city names

## Development Notes

- The server logs all incoming requests with method and path
- CORS is enabled for frontend communication
- All responses include proper error handling
- **Cities are fetched from external API** and cached for 24 hours
- **Automatic fallback** to local city list if API fails
- First request may be slightly slower while fetching from API
- Subsequent requests use cached data for instant response

## Next Steps

To connect with MongoDB for storing user data and businesses:
1. Add mongoose to dependencies
2. Create database connection
3. Add business and user models
4. Create additional controllers and routes

## Support

For issues or questions, please contact the development team.
