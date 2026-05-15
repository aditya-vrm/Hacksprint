import { Provider } from 'react-redux';
import { store } from './app/store/store';
import AppRoutes from './app/routes/AppRoutes';
import GlobalError from './shared/components/GlobalError';
import AppInitializer from './app/components/AppInitializer';
function App() {
  return (
    <Provider store={store}>
      <AppInitializer>
        <div className="min-h-screen w-full bg-background text-text-main flex flex-col">
          <AppRoutes />
          <GlobalError />
        </div>
      </AppInitializer>
    </Provider>
  );
}

export default App;
