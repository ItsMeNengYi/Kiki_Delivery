import { AppRegistry } from 'react-native';
import {createRoot} from 'react-dom/client';
import {Platform} from 'react-native';
import App from './App';

AppRegistry.registerComponent('HelloWorld', () => App);

if (Platform.OS === 'web') {
    const root = createRoot(document.getElementById('root'));
    root.render(<App />);
  }

