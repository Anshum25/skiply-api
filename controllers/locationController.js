const axios = require('axios');

// Indian cities data with popular cities
const indianCities = [
  // Popular cities
  'Ahmedabad', 'Bangalore', 'Chandigarh', 'Chennai', 'Delhi NCR', 'Goa', 'Hyderabad', 'Kolkata', 'Mumbai', 'Pune',
  
  // A
  'Agra', 'Agartala', 'Ajmer', 'Akola', 'Aligarh', 'Allahabad', 'Alwar', 'Ambala', 'Amravati', 'Amritsar', 'Anand', 'Asansol', 'Aurangabad',
  
  // B
  'Bareilly', 'Belgaum', 'Bhavnagar', 'Bhilai', 'Bhilwara', 'Bhopal', 'Bhubaneswar', 'Bikaner', 'Bilaspur', 'Bokaro', 'Burhanpur',
  
  // C
  'Coimbatore', 'Cuttack',
  
  // D
  'Davangere', 'Dehradun', 'Dhanbad', 'Dharwad', 'Durgapur',
  
  // E
  'Erode',
  
  // F
  'Faridabad', 'Firozabad',
  
  // G
  'Gandhinagar', 'Ghaziabad', 'Gorakhpur', 'Gulbarga', 'Guntur', 'Gurgaon', 'Guwahati', 'Gwalior',
  
  // H
  'Haridwar', 'Hisar', 'Hosur', 'Hubli',
  
  // I
  'Imphal', 'Indore', 'Itanagar',
  
  // J
  'Jabalpur', 'Jaipur', 'Jalandhar', 'Jalgaon', 'Jammu', 'Jamnagar', 'Jamshedpur', 'Jhansi', 'Jodhpur', 'Junagadh',
  
  // K
  'Kakinada', 'Kanpur', 'Karnal', 'Kochi', 'Kohima', 'Kolhapur', 'Kollam', 'Kota', 'Kozhikode',
  
  // L
  'Lucknow', 'Ludhiana',
  
  // M
  'Madurai', 'Mangalore', 'Mathura', 'Meerut', 'Moradabad', 'Mysore',
  
  // N
  'Nagpur', 'Nanded', 'Nashik', 'Nellore', 'Noida',
  
  // P
  'Panaji', 'Panipat', 'Patiala', 'Patna', 'Pondicherry',
  
  // R
  'Raipur', 'Rajahmundry', 'Rajkot', 'Ranchi', 'Ratlam', 'Rourkela',
  
  // S
  'Salem', 'Sangli', 'Shimla', 'Siliguri', 'Solapur', 'Srinagar', 'Surat',
  
  // T
  'Thane', 'Thanjavur', 'Thiruvananthapuram', 'Thrissur', 'Tiruchirappalli', 'Tirunelveli', 'Tirupati', 'Tiruppur', 'Trivandrum', 'Tumkur',
  
  // U
  'Udaipur', 'Ujjain',
  
  // V
  'Vadodara', 'Varanasi', 'Vellore', 'Vijayawada', 'Visakhapatnam',
  
  // W
  'Warangal',
  
  // Others
  'Abohar', 'Achampet', 'Adilabad', 'Adoni', 'Agar', 'Ahmednagar', 'Aizawl', 'Akbarpur', 'Akot', 'Alappuzha', 'Almora', 'Amalner', 'Ambarnath', 'Ambikapur', 'Amreli', 'Anakapalle', 'Anantapur', 'Anantnag', 'Arrah', 'Ashoknagar', 'Azamgarh'
];

// Get all cities grouped by first letter
exports.getAllCities = async (req, res) => {
  try {
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
      { name: 'Ahmedabad', icon: '🏙️' },
      { name: 'Bangalore', icon: '🏙️' },
      { name: 'Chandigarh', icon: '🏙️' },
      { name: 'Chennai', icon: '🏙️' },
      { name: 'Delhi NCR', icon: '🏙️' },
      { name: 'Goa', icon: '🏖️' },
      { name: 'Hyderabad', icon: '🏙️' },
      { name: 'Kolkata', icon: '🏙️' },
      { name: 'Mumbai', icon: '🏙️' },
      { name: 'Pune', icon: '🏙️' }
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
