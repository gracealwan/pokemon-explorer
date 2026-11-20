import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import './globals.css'
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    // The dataset only changes when fixtures are regenerated, so revisiting a
    // search reuses its cached pages instead of refetching every one of them.
    queries: { staleTime: 5 * 60 * 1000 }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
