import {store} from './redux';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import RootStack from './routes';
import {ImageBackground} from './components';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <ImageBackground />
        <RootStack />
      </NavigationContainer>
    </Provider>
  );
}
