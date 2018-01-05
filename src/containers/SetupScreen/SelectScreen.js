import React, { Component, PropTypes } from 'react'
import axios from 'axios'
import { StyleSheet, View, Text, Image, TouchableOpacity, Button, Dimensions } from 'react-native'
import wifi from 'react-native-android-wifi'
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog'

import API from '../../api'
import logo from '../../images/logo.png'
/**
 * Just a centered logout button.
 */

const screenWidth = Dimensions.get('window').width
const slideAnimation = new SlideAnimation({
  slideFrom: 'bottom'
})

export default class SelectScreen extends Component {
  state = {
    connecting: false,
    connected: false,
    dialogError: null,
    screenCode: null
  }

  static propTypes = {
    logout: PropTypes.func,
    setupWiFi: PropTypes.func
  }

  componentDidMount () {
    API.getUsers()
      .then(console.log)
      .catch(e => console.log(e.response))

    wifi.isEnabled((isEnabled) => {
      if (!isEnabled) {
        wifi.setEnabled(true)
      }
    })

    this.scanWifiInterval = setInterval(() => {
      wifi.reScanAndLoadWifiList((wifiStringList) => {
        const wifiList = JSON.parse(wifiStringList)
        this.setState({ screens: wifiList.filter(network => network.SSID === 'DigitalPignage') })
      }, () => {})
    }, 5000)
  }

  componentWillUnmount () {
    clearInterval(this.scanWifiInterval)
  }

  showScreenCode = () => {
    axios.get('http://192.168.0.1:8080/api/screen')
      .then(res => {
        this.setState({
          screenCode: res.data.code
        })
      })
      .catch(e => {
        console.log(e)
        this.setState({
          dialogError: 'Hubo un error al conectarse a esta pantalla. Intente de nuevo'
        })
      })
  }

  connectToScreen (screen) {
    this.setState({
      connecting: true,
      connected: false,
      screenCode: null
    })
    wifi.findAndConnect(screen.SSID, '', () => {
      this.connectingTimeout = setTimeout(() => {
        clearInterval(this.connectionInterval)
        this.setState({
          connecting: false
        })
        this.popupDialog.dismiss()
      }, 8000)
      this.connectionInterval = setInterval(() => {
        wifi.getSSID((ssid) => {
          if (ssid === screen.SSID) {
            clearInterval(this.connectionInterval)
            clearTimeout(this.connectingTimeout)
            this.setState({
              connecting: false,
              connected: true
            })
            setTimeout(this.showScreenCode, 10000)
          }
        })
      }, 2000)
    })
    this.popupDialog.show()
  }

  setupScreen = () => {
    console.log({ token: this.props.token })
    axios.post('http://192.168.0.1:8080/api/init/auth', { token: this.props.token })
      .then((res) => {
        this.props.setupWiFi()
      })
      .catch(console.log)
  }

  renderScreens () {
    const { screens } = this.state
    if (!screens) {
      return null
    }

    return (
      screens.map((screen, i) => (
        <TouchableOpacity
          key={`${screen.SSID}-${i}`}
          style={styles.screenNetwork}
          activeOpacity={0.7}
          onPress={() => this.connectToScreen(screen)}
        >
          <Image source={logo} style={styles.screenImage} />
          <Text style={styles.screenName}>{screen.SSID}</Text>
        </TouchableOpacity>
      ))
    )
  }

  handleDialogDismiss = () => {
    wifi.disconnect()
    this.setState({
      connected: false
    })
  }

  render () {
    let status = ''
    let hintText = ''

    if (!this.state.screens || this.state.screens.length === 0) {
      status = 'Escaneando en busqueda de pantallas'
    } else {
      status = 'Pantallas'
      hintText = 'Toca una de las pantallas para agregarla'
    }
    return (
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.statusText}>{status}</Text>
          <View style={styles.screensContainer}>
            {this.renderScreens()}
          </View>
          <Text style={styles.hintText}>{hintText}</Text>
        </View>
        <PopupDialog
          ref={(popupDialog) => { this.popupDialog = popupDialog }}
          dialogAnimation={slideAnimation}
          onDismissed={this.handleDialogDismiss}
          dialogStyle={styles.dialogContainer}
        >
          <View style={styles.dialogContent}>
            {this.state.connecting && (
              <Text style={styles.dialogStatusText}>Conectando</Text>
            )}
            {this.state.connected && (
              !this.state.screenCode ? (
                <Text style={styles.dialogStatusText}>Iniciando</Text>
              ) : (
                <View style={styles.centerContainer}>
                  <Text style={styles.hintText}>Asegurate de que el codigo debajo sea igual al mostrado en pantalla</Text>
                  <Text style={styles.screenCode}>{this.state.screenCode}</Text>
                  <Button title="Configurar" onPress={this.setupScreen} />
                </View>
              )
            )}
          </View>
        </PopupDialog>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  outerContainer: {
    flex: 1
  },
  innerContainer: {
    flex: 1,
    marginHorizontal: 30
  },
  screensContainer: {
    flex: 1,
    marginTop: 25
  },
  screenNetwork: {
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d6d7da',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    padding: 8
  },
  screenName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2'
  },
  screenImage: {
    width: 40,
    height: 40,
    marginRight: 10
  },
  statusText: {
    fontSize: 18,
    marginTop: 50,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  hintText: {
    fontSize: 16,
    marginBottom: 50,
    textAlign: 'center',
    color: '#1976D2'
  },
  dialogContainer: {
    width: screenWidth * 0.8,
    height: 250
  },
  dialogContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15
  },
  dialogStatusText: {
    fontSize: 32,
    textAlign: 'center',
    color: '#1976D2'
  },
  screenCode: {
    fontSize: 42,
    color: '#1976D2',
    borderWidth: 2,
    borderColor: '#1976D2',
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginBottom: 40
  }
})
