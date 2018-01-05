import React, { Component } from 'react'
import axios from 'axios'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  Button,
  Picker
} from 'react-native'
import { Hideo } from 'react-native-textinput-effects'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import wifi from 'react-native-android-wifi'
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog'

const screenWidth = Dimensions.get('window').width
const slideAnimation = new SlideAnimation({
  slideFrom: 'bottom'
})

export default class WifiScreen extends Component {
  state = {
    screenName: '',
    screenToken: null,
    loading: false
  }

  componentDidMount () {
    wifi.reScanAndLoadWifiList(
      wifiStringList => {
        const wifiList = JSON.parse(wifiStringList)
        this.setState({ wifiNetworks: wifiList })
      },
      () => {}
    )
  }

  handleWifiPassword = wifiPassword => {
    this.setState({
      wifiPassword
    })
  }

  finishSetup = () => {
    const wifiCredentials = {
      ssid: this.state.network,
      password: this.state.wifiPassword
    }
    this.popupDialog.show()
    axios
      .post('http://192.168.0.1:8080/api/init/wifi', wifiCredentials)
      .then(console.log)
      .catch(console.log)
  }

  render () {
    const { wifiNetworks = [] } = this.state
    return (
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>
            Elije la red WiFi a la cual se conectara la pantalla
          </Text>
          {wifiNetworks.length === 0 ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text style={styles.subtitle}>Cargando</Text>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <Picker
                style={styles.wifiPicker}
                selectedValue={this.state.network}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ network: itemValue })
                }
              >
                {wifiNetworks.map(network => (
                  <Picker.Item
                    key={network.SSID}
                    label={network.SSID}
                    value={network.SSID}
                  />
                ))}
              </Picker>
              <Hideo
                iconClass={FontAwesomeIcon}
                iconName={'lock'}
                iconColor={'#FFF'}
                iconBackgroundColor={'#1976D2'}
                inputStyle={{ color: '#464949' }}
                iconSize={20}
                placeholder="Contraseña"
                secureTextEntry
                value={this.state.wifiPassword}
                onChangeText={this.handleWifiPassword}
              />
              <Button
                title="Finalizar"
                style={styles.continueButton}
                onPress={this.finishSetup}
                disabled={!this.state.network}
              />
            </View>
          )}
        </View>
        <PopupDialog
          ref={popupDialog => {
            this.popupDialog = popupDialog
          }}
          dialogAnimation={slideAnimation}
          dialogStyle={styles.dialogContainer}
        >
          <View style={styles.dialogContent}>
            <Text>Estableciendo conexión en la pantalla</Text>
          </View>
        </PopupDialog>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1
  },
  innerContainer: {
    flex: 1,
    marginHorizontal: 30,
    paddingBottom: 50,
    marginTop: 50
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 30,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 50,
    textAlign: 'center'
  },
  continueButton: {},
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    fontSize: 26,
    color: '#1976D2'
  },
  wifiPicker: {
    backgroundColor: '#FFF',
    marginBottom: 10
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
  }
})
