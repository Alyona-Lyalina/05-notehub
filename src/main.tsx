import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "modern-normalize/modern-normalize.css";
import App from "./components/App/App";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a QueryClient instance for React Query
const queryClient = new QueryClient();


// Render the App component inside the root element
// Wrap App with QueryClientProvider to enable React Query
// ReactQueryDevtools helps debug React Query caches
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
