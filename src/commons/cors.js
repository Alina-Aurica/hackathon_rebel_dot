// api.js
const BASE_URL = "https://9796-5-14-146-87.ngrok-free.app/"; // Your backend IP address

// Function to search for tourist sights
export const searchTouristSights = async (query) => {
    try {
        const response = await fetch(`${BASE_URL}/query/3`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ query: query }), // Send the query as JSON
        });

        // Check if the response is okay (status code in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON from the response
        const data = await response.json();
        return data; // Return the data for further processing
    } catch (error) {
        console.error('Error fetching tourist sights:', error);
        throw error; // Rethrow error for handling in the calling component
    }
};
