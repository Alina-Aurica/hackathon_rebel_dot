import React from 'react';

import BackgroundImg from '../commons/images/images/background.jpg';

import {Container, Jumbotron} from 'reactstrap';

const backgroundStyle = {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: "100%",
    height: "1920px",
    backgroundImage: `url(${BackgroundImg})`
  };
  
  const textStyle = { color: 'white' };
  
  const Home = () => {
    
 

    return (
      <div>
        <Jumbotron fluid style={backgroundStyle}>
          <Container fluid>
            <h1 className="display-3" style={textStyle}>Travel Buddy</h1>
            <p className="lead" style={textStyle}><b>Welcome user</b></p>
            <hr className="my-2" />
            <p style={textStyle}><b>Use the drop down to navigate to the available menus!</b></p>
            {/* <p className="lead">
              <Button color="primary" onClick={() => window.open('/')}>
                Learn More
              </Button>
            </p> */}
          </Container>
        </Jumbotron>
      </div>
    );
  };
  
  export default Home;
