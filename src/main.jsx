import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {ProductsProvider} from "./contexts/ProductsProvider"
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import {ExtrasProvider} from "./contexts/ExtrasProvider"

const queryClient = new QueryClient()


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ExtrasProvider>
        <ProductsProvider>
          <App />     
        </ProductsProvider>
      </ExtrasProvider>
    </QueryClientProvider>
  </StrictMode>
)
