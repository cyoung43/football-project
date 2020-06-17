import React from 'react'
import * as bs from 'react-bootstrap'
import Pic from './media/BYU_2.jpg'
import { useRouteMatch } from 'react-router-dom'

function HeaderContainer(props) {
    let match = useRouteMatch('/:page')
    let text = ''
    //console.log(match)

    if (match === null) {
        text = ''
    }
    else if (match.params.page === 'recommender') {
        text = ''
    }
    else {
        text = ''
    }    

    return (        
        <bs.Jumbotron fluid style={{backgroundImage: `url(${Pic})`, backgroundSize: 'cover', backgroundPosition: 'center', marginTop: "76px", paddingTop: '175px', paddingBottom: '200px'}}>
            <bs.Row>
                <bs.Col md='1' />
                <bs.Col md='3'>
                    <bs.Container style= {{paddingTop: 300}}>
                        <h1 style={{color: '#fff', fontSize: '100px'}}>{text}</h1>
                    </bs.Container>
                </bs.Col>
                <bs.Col md='8' />
            </bs.Row>            
        </bs.Jumbotron>                   
    )
}

export default HeaderContainer