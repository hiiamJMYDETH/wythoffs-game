// api/hello.js
export default function handler(req, res) {
  // Add CORS headers to allow all domains for testing purposes
  res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');  // Allow methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  // Allow Content-Type header

  // Return the response
  res.status(200).json({ message: 'Hello, World!' });
}
