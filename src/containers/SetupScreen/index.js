import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'

import Header from '../../components/Header'
import CreateScreen from './CreateScreen'
import SelectScreen from './SelectScreen'
import WifiScreen from './WifiScreen'

export class SetupScreen extends Component {
  state = {
    settingName: true,
    pickingDevice: false,
    settingWifi: false,
    token: null
  }

  setToken = token => {
    this.setState({ token })
  }

  goBack = () => {
    if (this.state.settingName) {
      this.props.homeScreen()
    } else if (this.state.pickingDevice) {
      this.setState({
        settingWifi: false,
        pickingDevice: false,
        settingName: true
      })
    } else if (this.state.settingWifi) {
      this.setState({
        settingWifi: false,
        pickingDevice: true,
        settingName: false
      })
    }
  }

  renderScreen () {
    if (this.state.settingName) {
      return (
        <CreateScreen
          setToken={this.setToken}
          pickDevice={() =>
            this.setState({
              settingName: false,
              settingWifi: false,
              pickingDevice: true
            })
          }
        />
      )
    } else if (this.state.pickingDevice) {
      return (
        <SelectScreen
          token={this.state.token}
          setupWiFi={() =>
            this.setState({
              settingName: false,
              settingWifi: true,
              pickingDevice: false
            })
          }
        />
      )
    } else if (this.state.settingWifi) {
      return <WifiScreen />
    } else {
      return null
    }
  }

  render () {
    return (
      <View style={styles.outerContainer}>
        <Header
          onLeftIconPress={this.goBack}
          leftIcon="chevron-left"
          onLeftIconPress={this.goBack}
          leftIcon="chevron-left"
          title="Agregar Pantalla"
        />
        {this.renderScreen()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1
  }
})

export default SetupScreen
