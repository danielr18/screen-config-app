import React, { Component, PropTypes } from 'react'
import { StyleSheet, View, Button, Dimensions, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import Header from '../../components/Header'

const screenWidth = Dimensions.get('window').width

export default class HomeScreen extends Component {
  static propTypes = {
    setWifi: PropTypes.func
  }

  render () {
    return (
      <View style={styles.outerContainer}>
        <Header rightIcon="sign-out" onRightIconPress={this.props.logout} title="Inicio" />
        <View style={styles.innerContainer}>
          <Button title="Agregar Pantalla" onPress={this.props.setupScreen}/>
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
  continueButton: {
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    fontSize: 26,
    color: '#1976D2'
  },
  headerContainer: {
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    height: 64,
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    flex: 1,
    textAlign: 'center'
  },
  headerButton: {
    width: 30
  }
})
