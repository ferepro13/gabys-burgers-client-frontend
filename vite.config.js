import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import seoFiles from 'vite-plugin-seo-files';


export default defineConfig({
  plugins: [react(), tailwindcss(),
    seoFiles({
      siteUrl: 'https://gabys-burgers-client-frontend.onrender.com',
      //disallow: ['/admin/', '/private/'], 
    })
  ],

  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
