import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'
import AuthScreen from './containers/AuthScreen'
import HomeScreen from './containers/HomeScreen'
import SetupScreen from './containers/SetupScreen'
import API from './api'

/**
 * The root component of the application.
 * In this component I am handling the entire application state, but in a real app you should
 * probably use a state management library like Redux or MobX to handle the state (if your app gets bigger).
 */
export class PiScreenConfig extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isSettingUp: false,
      isLoggedIn: false, // Is the user authenticated?
      isLoading: false, // Is the user loggingIn/signinUp?
      isAppReady: true // Has the app completed the login animation?
    }
  }

  componentWillMount () {
    // AsyncStorage.removeItem('jwt')
    AsyncStorage.getItem('jwt')
      .then((token) => {
        if (token) {
          this.setState({ isLoggedIn: true })
        }
      })
  }

  startLoading = () => {
    this.setState({ isLoading: true })
  }

  stopLoading = () => {
    this.setState({ isLoading: false })
  }

  handleSuccessLogin = () => {
    this.setState({
      isLoggedIn: true
    })
  }

  handleSuccessSignup = ({ email, password }) => {
    this.startLoading()
    API.login(email, password)
      .then(res => {
        AsyncStorage.setItem('jwt', res.data.token)
        this.setState({
          isLoading: false,
          isLoggedIn: true
        })
      })
      .catch(e => {
        this.stopLoading()
      })
  }

  /**
   * Simple routing.
   * If the user is authenticated (isAppReady) show the HomeScreen, otherwise show the AuthScreen
   */
  render () {
    if (this.state.isLoggedIn) {
      if (!this.state.isSettingUp) {
        return (
          <HomeScreen
            setupScreen={() => this.setState({ isSettingUp: true })}
            logout={() => this.setState({ isLoggedIn: false, isAppReady: false, isSettingUp: false })}
          />
        )
      } else {
        return (
          <SetupScreen />
        )
      }
    } else {
      return (
        <AuthScreen
          startLoading={this.startLoading}
          stopLoading={this.stopLoading}
          onSuccessLogin={this.handleSuccessLogin}
          onSuccessSignup={this.handleSuccessSignup}
          isLoggedIn={this.state.isLoggedIn}
          isLoading={this.state.isLoading}
          onLoginAnimationCompleted={() => this.setState({ isAppReady: true })}
        />
      )
    }
  }
}

export default PiScreenConfig
