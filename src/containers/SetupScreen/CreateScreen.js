import React, { Component, PropTypes } from 'react'
import axios from 'axios'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  Button
} from 'react-native'
import { Hideo } from 'react-native-textinput-effects'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'

import API from '../../api'

const screenWidth = Dimensions.get('window').width

export default class HomeScreen extends Component {
  state = {
    screenName: '',
    screenToken: null,
    loading: false
  }

  static propTypes = {
    setWifi: PropTypes.func
  }

  handleNameChange = screenName => {
    this.setState({
      screenName
    })
  }

  getScreenToken = () => {
    this.setState({ loading: true })
    API.createDevice(this.state.screenName)
      .then(res => {
        this.props.setToken(res.data.token)
        this.props.pickDevice()
      })
      .catch(console.log)
  }

  render () {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Asignale un nombre a esta pantalla</Text>
          <Text style={styles.subtitle}>
            Este es el nombre por el cual identificaras la pantalla en el panel
            de administración de publicidad
          </Text>
          {!this.state.loading ? (
            <View style={{ flex: 1 }}>
              <Hideo
                iconClass={FontAwesomeIcon}
                iconName={'desktop'}
                iconColor={'#FFF'}
                iconBackgroundColor={'#1976D2'}
                inputStyle={{ color: '#464949' }}
                iconSize={20}
                placeholder="Nombre"
                value={this.state.screenName}
                onChangeText={this.handleNameChange}
              />
              <Button
                title="Continuar"
                style={styles.continueButton}
                onPress={this.getScreenToken}
              />
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Guardando...</Text>
            </View>
          )}
        </View>
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
  }
})
