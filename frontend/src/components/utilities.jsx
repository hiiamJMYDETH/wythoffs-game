async function fetching() {
    const apiUrl = 'http://localhost:3000/api';  // Default to localhost during dev
    const response = await fetch(`${apiUrl}/hello`);  
  
    if (response.ok) {
      const data = await response.json();
      console.log(data);  // Should log the parsed JSON
    } else {
      console.error('API request failed:', response.status, response.statusText);
    }
  }

export {fetching};