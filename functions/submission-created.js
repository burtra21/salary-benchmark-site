const axios = require('axios');

// Function triggered by Netlify form submission event
exports.handler = async function(event, context) {
  console.log('Submission created function invoked.');

  try {
    // Parse the submission payload from the event body
    const { payload } = JSON.parse(event.body);
    const formData = payload.data; // Form data is under payload.data

    console.log('Form data received from Netlify submission:', JSON.stringify(formData, null, 2));

    // Forward the data to n8n
    const webhookUrl = 'https://getezpz.app.n8n.cloud/webhook/salary-benchmark';
    console.log('Calling n8n webhook URL:', webhookUrl);

    // Use the parsed form data directly
    const response = await axios.post(
      webhookUrl,
      formData, // Send the data object parsed from the event
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 
      }
    );

    console.log('Response received from n8n, status:', response.status);
    // Optional: Log n8n response data for debugging
    // console.log('n8n response data:', response.data);

    // Return a success status to Netlify
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data successfully forwarded to n8n' })
    };

  } catch (error) {
    console.error('Error in submission-created function:');
    console.error(error.message);
    if (error.response) {
      console.error('Error response status from n8n:', error.response.status);
      console.error('Error response data from n8n:', JSON.stringify(error.response.data));
    } else if (error.request) {
      console.error('No response received from n8n request');
    }

    // Return an error status to Netlify
    return {
      statusCode: 500,
      body: JSON.stringify({ 
          message: 'Error processing submission', 
          error: error.message 
      })
    };
  }
}
