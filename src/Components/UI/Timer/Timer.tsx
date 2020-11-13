import React from 'react'
import './Timer.scss'

type OwnProps = {
    seconds: number
    started: boolean
    finishedTimer: boolean
}

class Timer extends React.Component<OwnProps, {}> {

    render() {
        const classes = []
        if (this.props.finishedTimer) {
            classes.push('finished')
        }

        if (this.props.started) {
            classes.push('start')
        }

        return (
            <div className="Timer">
                <p className={classes.join(' ')}>
                    {this.props.seconds + 'c'}
                </p>
            </div>
        )
    }
}

export default Timer