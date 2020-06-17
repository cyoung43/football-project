import React from 'react'
import * as bs from 'react-bootstrap'
import { Formik, Form, Field} from 'formik'
import AppContext from './context'
import axios from 'axios'


function Predictor(props) {
    let context = React.useContext(AppContext)
    let myError = ''

    return (        
        <Formik
            initialValues={{
                defense_play: 'Utah',
                def_rank: 12,
                down: 3,
                running_avg_drive_rushing_yards: 4.7,
                zone: 'red',
                Under_two: 1,
                drive_rush_count: 11,
                month: 'September',
                distance: '7',
                previous_yards_gained: 3,
                yards_to_goal: 14,
                // success_rate: 0.76,
                score_diff: 5,
            }}
            validateOnChange={false}
            validateOnBlur={false}
            validate={values => {
                const errors = {}

                if (values.defense_play === '') {
                    errors.defense_play = 'Please enter a Team Name'
                }
                if (values.def_rank === '') {
                    errors.def_rank = 'Please enter a Defensive Ranking'
                }
                if (values.down === '') {
                    errors.down = 'Please enter the Down'
                }
                if (values.running_avg_drive_rushing_yards === '') {
                    errors.running_avg_drive_rushing_yards = 'Please enter a number'
                }
                if (values.zone === '') {
                    errors.zone = 'Please select zone'
                }
                if (values.Under_two === '') {
                    errors.Under_two = 'Please select option'
                }
                if (values.drive_rush_count === '') {
                    errors.drive_rush_count = 'Please enter a valid number'
                }
                if (values.month === '') {
                    errors.month = 'Please select month'
                }
                if (values.distance === '') {
                    errors.distance = 'Please enter distance'
                }
                if (values.previous_yards_gained === '') {
                    errors.previous_yards_gained = 'Please enter valid number'
                }
                if (values.yards_to_goal === '') {
                    errors.yards_to_goal = 'Please enter valid number 0 to 101'
                }
                //if (values.success_rate === '') {
                //    errors.success_rate = 'Please enter proper fg% 0 to 1'
                //}
                if (values.score_diff === '') {
                    errors.score_diff = 'Please enter valid number'
                }
                return errors // This is the way
            }}
            onSubmit={async (values, actions) => {
                //console.log('submit', values)             

                let dict = {
                    def_rank: values.def_rank,
                    drive_rush_count: values.drive_rush_count,
                    Under_two: values.Under_two,
                    down: values.down,
                    distance: parseFloat(values.distance),                    
                    zone: values.zone,
                    // success_rate: parseFloat(values.success_rate),
                    month: values.month,
                    running_avg_drive_rushing_yards: parseFloat(values.running_avg_drive_rushing_yards),
                    score_diff: values.score_diff,
                    previous_yards_gained: values.previous_yards_gained,
                    yards_to_goal: values.yards_to_goal,
                }

                // console.log(dict)
                // console.log('player_first ', dict.player_first, typeof dict.player_first)
                // console.log('player_last ', dict.player_last, typeof dict.player_last)
                // console.log('location ', dict.location, typeof dict.location)
                // console.log('shot_number ', dict.shot_number, typeof dict.shot_number)
                // console.log('period ', dict.period, typeof dict.period)
                // console.log('shot_clock ', dict.shot_clock, typeof dict.shot_clock)
                // console.log('shot_distance ', dict.shot_distance, typeof dict.shot_distance)
                // console.log('pts_type ', dict.pts_type, typeof dict.pts_type)
                // console.log('close_def_dist ', dict.close_def_dist, typeof dict.close_def_dist)
                // console.log('game_clock ', dict.game_clock, typeof dict.game_clock)
                // console.log('fg ', dict.fg, typeof dict.fg)
                // console.log('experience ', dict.experience, typeof dict.experience)


                // Put axios call to API here:
                let calcResp
                try {
                    calcResp = await axios.post(`http://ec2-18-234-190-213.compute-1.amazonaws.com:8000/api/getShotPrediction/`, JSON.stringify(dict))
                }
                catch(err) {
                    console.log(err)
                }
                
                console.log('RESPONSE 1:', calcResp.data)
                let results = ''
                if (calcResp.data.result > 0.5) {
                    results = 'success'
                }
                else {
                    results = 'danger'
                }

                let dict2 = {
                    result: calcResp.data.result,
                    type: results
                }
                //console.log(dict2)
                context.addShot(dict2)

                await new Promise(resolve => {
                    setTimeout(() => {  // wait 2 seconds, then set the form as "not submitting"
                        resolve()
                    }, 2000)
                })
            }}
        >{form => (
            <CalculatorForm form={form} error={myError} results={context.shot}/>            
        )}</Formik>        
    )
}
export default Predictor


/**
 * The form layout/html.
 * This component needs finishing.
 */
const CalculatorForm = props => (

    <bs.Container>
        <h1 className="pt-4" style={{display: 'inline-block'}}>
            Rushing Yards Predictor
        </h1>
        <hr />
        <h6 className="text-danger">{props.error}</h6> 
        <Form>
            <bs.Row className="mb-4">
                <bs.Col md="6">
                    <bs.Row>
                        <bs.Col>
                            <Input title="Opponent's Team Name:" name="defense_play" type="text" />
                        </bs.Col>
                        <bs.Col>
                            <Input title="Defensive Rank:" name="def_rank" type="text" />
                        </bs.Col>
                    </bs.Row>
                    <InputQuarter title="What Down is it?" name="down" type="select" val0="" lab0="Select One"
                        val1="1" val2="2" val3="3" val4="4" lab1="1st" lab2="2nd" lab3="3rd" lab4="4th"
                    />
                    <Input title="Average rushing yards in the drive:" name="running_avg_drive_rushing_yards" type="number" />
                    <bs.Row>
                        <bs.Col>
                            <InputDrop title="Current Zone" name="zone" type="select" val0='' lab0='Select Zone'
                                val1='red' lab1='Red (0-20 yardline)' val2='blue' lab2='Blue (20-60 yardline)' val3='green' lab3='Green (60-100 yardline)'
                            />
                        </bs.Col>
                        <bs.Col>
                            
                        </bs.Col>
                    </bs.Row>
                    <Input title="Number of Rushes in Drive" name="drive_rush_count" type="number" min="1" max="24.0" step="1"/>                    
                </bs.Col>
                <bs.Col md="6">
                    <InputQuarter title="Month:" name="month" type="select" val0="" lab0="Select Month" 
                        val1="September" lab1="September" val2="October" lab2="October" val3="November" lab3="November" val4="December" lab4="December" 
                    />                    
                    <bs.Row>
                        <bs.Col>
                            <Input title="Distance to 1st down:" name="distance" type="number" min='0' max='100' step='0.5'/>
                        </bs.Col>    
                        <bs.Col>
                            <Input title="Yards gained on previous play:" name="previous_yards_gained" type="number" />
                        </bs.Col>
                    </bs.Row>
                    <Input title="Yards to goal:" name="yards_to_goal" type="number" min="0" max="101" step="0.1" />
                    
                    <InputDrop title="Less Than Two Minutes?" name="Under_two" type="select" val0='' lab0='Select one'
                                val1='1' lab1='Yes' val2='0' lab2='No' 
                            />
                    <Input title="Score difference (BYU - Opponent)" name="score_diff" type="number" min="-94" max="94" step="1" />                    
                </bs.Col>
            </bs.Row>
            <bs.Row className="mb-4">
                <bs.Col>
                    <bs.Container className="text-center">
                        <bs.Button className="btn btn-lg btn-primary" type="submit" disabled={props.form.isSubmitting}>
                            {props.form.isSubmitting &&
                                <bs.Spinner as="span" animation="grow" size="lg" role="status" aria-hidden="true" />                     
                            } Predict Yards Gained
                        </bs.Button>
                    </bs.Container>
                </bs.Col>
            </bs.Row>
            <bs.Row className="mb-4">
                <bs.Col className="text-center">
                    {props.results.map((p) => {
                        if (p.type === 'success') {                            
                            return(
                                <bs.Alert variant="success" key={p.result}>
                                    <bs.Alert.Heading>Buckets! It went in!</bs.Alert.Heading>
                                    <p className="mb-1">The player that you have described taking this shot is probably going to make it!</p> 
                                    <p>Now try and mix up the stats to see if you can improve your percentage!</p>
                                    <hr />
                                    <p>This shot has a <strong>{(p.result * 100).toFixed(2)}%</strong> chance to be a make!</p>
                                </bs.Alert>
                            )
                        }
                        if (p.type === 'danger') {
                            return(
                                <bs.Alert variant="danger" key={p.result}>
                                    <bs.Alert.Heading>Brick! This shot missed...</bs.Alert.Heading>
                                    <p className="mb-1">This is a really tough shot and it will probably be a miss. But dont give up!</p>
                                    <p>Change up the situation and the stats and maybe you can find the right combination!</p>
                                    <hr />
                                    <p>This shot only has a <strong>{(p.result * 100).toFixed(2)}%</strong> chance to be a make.</p>
                                </bs.Alert>
                            )
                        }
                        
                        return(
                            <bs.Alert variant="info" key={p.result}>
                                <bs.Alert.Heading>Enter the Info Above to View Results</bs.Alert.Heading>
                                <p className="mb-1">We will display your results here!</p> 
                                <hr />
                                <p>This shot has a <strong>{(p.result * 100).toFixed(2)}%</strong> chance to be a make!</p>
                            </bs.Alert>
                        )
                    })}
                </bs.Col>
            </bs.Row>
        </Form>       
    </bs.Container>
)

/**
 * A form input.
 *   props.title - the title that shows above the input box
 *   props.type - the type of input (see React Bootstrap Form.Control)
 *   props.placeholder - placeholder text in the input.
 * This component is finished and doesn't need additional work.
 */
const Input = (props) => (
    <Field name={props.name}>{rProps => (
        <bs.Form.Group>
            {props.title &&
                <bs.Form.Label>{props.title}</bs.Form.Label>
            }
            <bs.Form.Control
                type={props.type}
                placeholder={props.placeholder}
                disabled={rProps.form.isSubmitting}
                value={props.value}
                min={props.min}
                max={props.max}
                step={props.step}
                {...rProps.field}
            />
            {rProps.meta.touched && rProps.meta.error &&
                <div className="text-danger">{rProps.meta.error}</div>
            }
        </bs.Form.Group>
    )}</Field>
)

/*
const InputYN = (props) => (
    <Field name={props.name}>{rProps => (
        <bs.Form.Group>
            {props.title &&
                <bs.Form.Label>{props.title}</bs.Form.Label>
            }        
            <br />
            <bs.Form.Control as={props.type}
                placeholder={props.placeholder}
                disabled={rProps.form.isSubmitting}
                {...rProps.field}
            >
                <option value={props.val0} label={props.lab0}/>
                <option value={props.val1} label={props.lab1}/>
                <option value={props.val2} label={props.lab2}/>
            </bs.Form.Control>
            {rProps.meta.touched && rProps.meta.error &&
                <div className="text-danger">{rProps.meta.error}</div>
            }
        </bs.Form.Group>
    )}</Field>
)
*/

const InputQuarter = (props) => (
    <Field name={props.name}>{rProps => (
        <bs.Form.Group>
            {props.title &&
                <bs.Form.Label>{props.title}</bs.Form.Label>
            }        
            <br />
            <bs.Form.Control as={props.type}
                placeholder={props.placeholder}
                disabled={rProps.form.isSubmitting}
                {...rProps.field}
            >
                <option value={props.val0} label={props.lab0}/>
                <option value={props.val1} label={props.lab1}/>
                <option value={props.val2} label={props.lab2}/>
                <option value={props.val3} label={props.lab3}/>
                <option value={props.val4} label={props.lab4}/>
            </bs.Form.Control>
            {rProps.meta.touched && rProps.meta.error &&
                <div className="text-danger">{rProps.meta.error}</div>
            }
        </bs.Form.Group>
    )}</Field>
)

const InputDrop = (props) => (
    <Field name={props.name}>{rProps => (
        <bs.Form.Group>
            {props.title &&
                <bs.Form.Label>{props.title}</bs.Form.Label>
            }
            <br />
            <bs.Form.Control as={props.type}
                placeholder={props.placeholder}
                disabled={rProps.form.isSubmitting}
                {...rProps.field}
            >
                <option value={props.val0} label={props.lab0}/>
                <option value={props.val1} label={props.lab1}/>
                <option value={props.val2} label={props.lab2}/>
                <option value={props.val3} label={props.lab3}/>
                
            </bs.Form.Control>
            {rProps.meta.touched && rProps.meta.error &&
                <div className="text-danger">{rProps.meta.error}</div>
            }
        </bs.Form.Group>
    )}</Field>
)