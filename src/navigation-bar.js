import React from 'react'
import logo from './commons/images/images/icon.png';

import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand,
    NavLink,
    UncontrolledDropdown
} from 'reactstrap';


const textStyle = {
    color: 'white',
    textDecoration: 'none'
};

const NavigationBar = () => {




 return (
    <div>
        <Navbar color="dark" light expand="md">
            <NavbarBrand href="/home">
                <img src={logo} width={"50"}
                     height={"35"} alt="logo" />
            </NavbarBrand>
            <Nav className="mr-auto" navbar>

                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle style={textStyle} nav caret>
                       Menu
                    </DropdownToggle>
                    <DropdownMenu right >

                    { (
                        <DropdownItem>
                            <NavLink href="/user">Users</NavLink>
                        </DropdownItem>)}


                       { ( 
                        <DropdownItem>
                            <NavLink href="/chat">Chat</NavLink>
                        </DropdownItem>)}

                        { ( 
                        <DropdownItem>
                            <NavLink href="/map">Map</NavLink>
                        </DropdownItem>)}

                        <DropdownItem>
                            <NavLink href="/logout"> Logout</NavLink>
                        </DropdownItem>


                    </DropdownMenu>
                </UncontrolledDropdown>

            </Nav>
        </Navbar>
    </div>
 );
}

export default NavigationBar
