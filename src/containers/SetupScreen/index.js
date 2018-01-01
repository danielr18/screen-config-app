import React, { Component } from 'react'

import NameScreen from './NameScreen'
import WifiScreen from './WifiScreen'

export class SetupScreen extends Component {
  state = {
    settingName: true,
    settingWifi: false
  }

  render () {
    if (this.state.settingName) {
      return (
        <NameScreen
          setWifi={() => this.setState({ settingWifi: true, settingName: false })}
        />
      )
    } else {
      return (
        <WifiScreen />
      )
    }
  }
}

export default SetupScreen
