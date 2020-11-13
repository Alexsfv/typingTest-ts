import React from 'react'
import './Loader.scss'

type OwnProps = {
  classes: Array<string> | string
}

class Loader extends React.Component<OwnProps, {}> {

  render() {
    let classes = ['lds-ring']
    classes = classes.concat(this.props.classes)

    return (
        <div className={classes.join(' ')}>
            <div></div><div></div><div></div><div></div>
        </div>
    )
  }
}

export default Loader