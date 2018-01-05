import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class Header extends Component {
  render () {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.headerButton} onPress={this.props.onLeftIconPress}>
          {this.props.leftIcon && (
            <Icon name={this.props.leftIcon} size={25} color='#FFF' />
          )}
        </TouchableOpacity>
        <Text style={styles.headerText}>{this.props.title}</Text>
        <TouchableOpacity style={styles.headerButton} onPress={this.props.onRightIconPress}>
          {this.props.rightIcon && (
            <Icon name={this.props.rightIcon} size={25} color='#FFF' />
          )}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
