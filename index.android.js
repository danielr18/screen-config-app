import { AppRegistry } from 'react-native'
import PiScreenConfig from './src/app'

if (__DEV__) {
  window.requestIdleCallback = null
  window.cancelIdleCallback = null
}

AppRegistry.registerComponent('PiScreenConfig', () => PiScreenConfig)
