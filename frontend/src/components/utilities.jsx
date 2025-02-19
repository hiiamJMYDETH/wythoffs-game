async function fetching() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${apiUrl}/hello`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(data);  // Should log the parsed JSON object
    } else {
      console.error('API request failed:', response.status, response.statusText);
    }
    
  }

export {fetching};