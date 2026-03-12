'use client'

import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          richColors
          closeButton
        />
      </ThemeProvider>
    </Provider>
  )
}
