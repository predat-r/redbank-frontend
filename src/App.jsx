import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router.jsx';
import { ToastProvider } from './components/ui';

function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App;
