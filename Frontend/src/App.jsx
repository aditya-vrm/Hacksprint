import { Provider } from 'react-redux';
import { store } from './app/store/store';
import AppRoutes from './app/routes/AppRoutes';
import GlobalError from './shared/components/GlobalError';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen w-full bg-background text-text-main flex flex-col">
        <AppRoutes />
        <GlobalError />
      </div>
    </Provider>
  );
}

export default App;
