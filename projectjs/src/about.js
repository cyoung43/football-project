import React from 'react'
import * as bs from 'react-bootstrap'

function About(props) {
    return (
        <bs.Container>
            <bs.Row>
                <bs.Col>
                    <bs.Card.Body>
                        <bs.Card.Title className='text-center mt-3' style={{fontSize: '32pt'}}>
                            About Us
                        </bs.Card.Title>
                        <hr />
                        <bs.Card.Text className='text-center mb-3' style={{fontSize: '20pt'}}>
                            This app is designed to help BYU coaches in their playmaking decisions. It takes
                            play by play data and predicts the potential yards gained on a play depending on 
                            play situations and variables. NOTE: This is still in trial phase and has a lot of work to be considered game-ready!
                        </bs.Card.Text>
                    </bs.Card.Body>
                </bs.Col>
            </bs.Row>
        </bs.Container>
    )
}

export default About