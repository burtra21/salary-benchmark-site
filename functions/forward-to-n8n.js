const axios = require('axios');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    // Parse the form data
    let formData;
    try {
      formData = JSON.parse(event.body);
      console.log('Form data received:', formData);
    } catch (e) {
      console.log('Error parsing form data:', e);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid form data format' })
      };
    }
    
    // Forward the data to n8n
    console.log('Forwarding to n8n webhook...');
    const response = await axios.post(
      'YOUR_N8N_URL/webhook/salary-benchmark',
      formData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Response received from n8n');
    
    // Return the response from n8n
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html'
      },
      body: response.data
    };
  } catch (error) {
    console.error('Error in Netlify function:', error);
    
    // Detailed error response for debugging
    let errorBody = {
      message: 'Error generating report. Please try again.',
      error: error.message
    };
    
    // Include more details if available
    if (error.response) {
      errorBody.status = error.response.status;
      errorBody.data = error.response.data;
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify(errorBody)
    };
  }
}