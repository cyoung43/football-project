import React from 'react'
import * as bs from 'react-bootstrap'

function FooterContainer(props) {
    return (
        <bs.Container bg="dark" className="text-center" style={{color: 'white'}}>            
            <h6>{'\u00A9'} BYU Sports Analytics</h6>
        </bs.Container>
    )
}

export default FooterContainer