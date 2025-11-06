const axios = require('axios');

// Cache for cities data to avoid repeated API calls
let citiesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Fetch Indian cities from API
async function fetchIndianCities() {
  // Check if cache is valid
  if (citiesCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    return citiesCache;
  }

  try {
    // Using CountryStateCity API - Free, no API key required
    const response = await axios.post(
      'https://countriesnow.space/api/v0.1/countries/cities',
      { country: 'India' },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.data) {
      citiesCache = response.data.data;
      cacheTimestamp = Date.now();
      console.log(`✅ Fetched ${citiesCache.length} cities from API`);
      return citiesCache;
    }
    
    // Fallback to basic list if API fails
    console.log('⚠️ API response invalid, using fallback cities');
    return getFallbackCities();
  } catch (error) {
    console.error('❌ Error fetching cities from API:', error.message);
    console.log('⚠️ Using fallback cities');
    // Return fallback cities if API fails
    return getFallbackCities();
  }
}

// Fallback city list (in case API fails)
function getFallbackCities() {
  return [
    'Ahmedabad', 'Bangalore', 'Chandigarh', 'Chennai', 'Delhi', 'Goa', 'Hyderabad', 'Kolkata', 'Mumbai', 'Pune',
    'Agra', 'Agartala', 'Ajmer', 'Akola', 'Aligarh', 'Allahabad', 'Alwar', 'Ambala', 'Amravati', 'Amritsar',
    'Bareilly', 'Belgaum', 'Bhavnagar', 'Bhopal', 'Bhubaneswar', 'Bikaner', 'Bilaspur',
    'Coimbatore', 'Cuttack', 'Dehradun', 'Dhanbad', 'Durgapur', 'Erode', 'Faridabad',
    'Gandhinagar', 'Ghaziabad', 'Gorakhpur', 'Guntur', 'Gurgaon', 'Guwahati', 'Gwalior',
    'Haridwar', 'Hisar', 'Hubli', 'Imphal', 'Indore', 'Jabalpur', 'Jaipur', 'Jalandhar',
    'Jammu', 'Jamnagar', 'Jamshedpur', 'Jodhpur', 'Kanpur', 'Kochi', 'Kolhapur', 'Kota',
    'Lucknow', 'Ludhiana', 'Madurai', 'Mangalore', 'Meerut', 'Mysore', 'Nagpur', 'Nashik',
    'Noida', 'Patna', 'Raipur', 'Rajkot', 'Ranchi', 'Salem', 'Shimla', 'Siliguri', 'Surat',
    'Thane', 'Thiruvananthapuram', 'Tiruchirappalli', 'Tirupati', 'Udaipur', 'Vadodara',
    'Varanasi', 'Vijayawada', 'Visakhapatnam', 'Warangal'
  ];
}

// Get all cities grouped by first letter
exports.getAllCities = async (req, res) => {
  try {
    // Fetch cities from API
    const indianCities = await fetchIndianCities();

    // Group cities by first letter
    const groupedCities = indianCities.reduce((acc, city) => {
      const letter = city[0].toUpperCase();
      if (!acc[letter]) {
        acc[letter] = [];
      }
      acc[letter].push(city);
      return acc;
    }, {});

    // Sort cities within each group
    Object.keys(groupedCities).forEach(letter => {
      groupedCities[letter].sort();
    });

    res.status(200).json({
      success: true,
      data: {
        cities: indianCities.sort(),
        groupedCities: groupedCities,
        count: indianCities.length
      }
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cities',
      error: error.message
    });
  }
};

// Get current location city from coordinates
exports.getCurrentLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Call BigDataCloud reverse geocoding API
    const response = await axios.get(
      `https://api.bigdatacloud.net/data/reverse-geocode-client`,
      {
        params: {
          latitude,
          longitude,
          localityLanguage: 'en'
        }
      }
    );

    const data = response.data;
    const city = data.city || data.locality || data.principalSubdivision || 'Unknown Location';

    res.status(200).json({
      success: true,
      data: {
        city: city,
        state: data.principalSubdivision || '',
        country: data.countryName || '',
        fullAddress: data.localityInfo?.administrative || [],
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      }
    });
  } catch (error) {
    console.error('Error fetching current location:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch current location',
      error: error.message
    });
  }
};

// Search cities by query
exports.searchCities = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Fetch cities from API
    const indianCities = await fetchIndianCities();

    const searchTerm = query.toLowerCase();
    const filteredCities = indianCities.filter(city =>
      city.toLowerCase().includes(searchTerm)
    );

    res.status(200).json({
      success: true,
      data: {
        cities: filteredCities,
        count: filteredCities.length
      }
    });
  } catch (error) {
    console.error('Error searching cities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search cities',
      error: error.message
    });
  }
};

// Get popular cities
exports.getPopularCities = async (req, res) => {
 try {
  const popularCities = [
    { name: 'Ahmedabad', icon: '🕍' },      // Sabarmati Ashram / heritage city
    { name: 'Bangalore', icon: '💻' },      // Silicon Valley of India
    { name: 'Chandigarh', icon: '🏞️' },     // Rock Garden / planned city
    { name: 'Chennai', icon: '🌊' },        // Marina Beach / coastal city
    { name: 'Delhi NCR', icon: '🕌' },       // India Gate / Red Fort
    { name: 'Goa', icon: '🏖️' },            // Beaches
    { name: 'Hyderabad', icon: '🕋' },       // Charminar
    { name: 'Kolkata', icon: '🌉' },         // Howrah Bridge
    { name: 'Mumbai', icon: '🕍' },          // Gateway of India
    { name: 'Pune', icon: '🏰' }             // Shaniwar Wada
  ];


    res.status(200).json({
      success: true,
      data: {
        cities: popularCities
      }
    });
  } catch (error) {
    console.error('Error fetching popular cities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular cities',
      error: error.message
    });
  }
};
