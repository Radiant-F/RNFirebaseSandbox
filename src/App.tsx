import {store} from './redux';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {ImageBackground} from './components';
import {Splash} from './screens';
import {StatusBar} from 'react-native';

export default function App() {
  return (
    <Provider store={store}>
      <ImageBackground />
      <NavigationContainer>
        <Splash />
      </NavigationContainer>
      <StatusBar
        barStyle={'light-content'}
        translucent
        backgroundColor={'transparent'}
      />
    </Provider>
  );
}
