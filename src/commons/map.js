import React, { useState } from 'react';
import BackgroundImg from '../commons/images/images/background.jpg'; // Adjust the path as necessary
import { Container, Jumbotron, Input, Button, Spinner } from 'reactstrap'; // Added Spinner for loading state
import { searchTouristSights } from './cors'; // Adjust the path as necessary

const backgroundStyle = {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: "100%",
    height: "1920px",
    backgroundImage: `url(${BackgroundImg})`
};

const textStyle = { color: 'white' };

const Map = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // To handle loading state
    const [error, setError] = useState(null); // To handle errors

    const handleSearch = async () => {
        setIsLoading(true);  // Start the loading state
        setError(null);  // Clear any previous errors
        try {
            const data = await searchTouristSights(searchTerm);
            setResults(data); // Store the results for display
        } catch (error) {
            setError('Failed to fetch results. Please try again.');
            console.error('Failed to fetch results:', error);
        } finally {
            setIsLoading(false);  // End the loading state
        }
    };

    return (
        <div>
            <Jumbotron fluid style={backgroundStyle}>
                <Container fluid>
                    <h1 className="display-3" style={textStyle}>Explore Tourist Attractions</h1>
                    <p className="lead" style={textStyle}><b>Find your next adventure!</b></p>
                    <hr className="my-2" />
                    <p style={textStyle}><b>Enter a location to search for tourist sights.</b></p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                        <Input
                            type="text"
                            placeholder="Search for a tourist sight..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ marginRight: '10px' }}
                        />
                        <Button color="primary" onClick={handleSearch}>
                            Search
                        </Button>
                    </div>
                    
                    {/* Loading spinner */}
                    {isLoading && (
                        <div style={{ marginTop: '20px', color: 'white' }}>
                            <Spinner color="light" /> Searching...
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div style={{ marginTop: '20px', color: 'red' }}>
                            {error}
                        </div>
                    )}

                    {/* Display search results */}
                    {!isLoading && results.length > 0 && (
                        <div style={{ marginTop: '20px', color: 'white' }}>
                            <h5>Results:</h5>
                            <ul>
                                {results.map((sight, index) => (
                                    <li key={index}>{sight.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {/* No results found */}
                    {!isLoading && results.length === 0 && searchTerm && !error && (
                        <div style={{ marginTop: '20px', color: 'white' }}>
                            <p>No results found for "{searchTerm}".</p>
                        </div>
                    )}
                </Container>
            </Jumbotron>
        </div>
    );
};

export default Map;
