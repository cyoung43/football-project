import React from 'react'
import * as bs from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Pic from './media/sailor-coug-logo.png'

function HeaderContainer(props) {

    return (
        <bs.Navbar expand="lg" bg="dark" variant="dark" fixed="top">
            <Link to='/' >
                <bs.Navbar.Brand>
                    <bs.Image  src={Pic} height="100" width="100" alt="Basketball Logo"/>
                    {'  '} Football Analytics
                </bs.Navbar.Brand>
            </Link>
            <bs.Navbar.Toggle aria-controls="basic-Navbar-Nav" />
            <bs.Navbar.Collapse id="basic-Navbar-Nav">
                <bs.Nav className="mr-auto">
                    <Link to="/" className="nav-link">Pass Predictor</Link>
                    <Link to="/run" className="nav-link">Run Predictor</Link>
                    <Link to="/about" className="nav-link">About</Link>                
                </bs.Nav>
                <bs.Form inline>
                <bs.FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <bs.Button variant="outline-light">Search</bs.Button>
                </bs.Form>
            </bs.Navbar.Collapse>
        </bs.Navbar>
    )
}

export default HeaderContainer