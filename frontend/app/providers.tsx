'use client';

import { ReactNode, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { QueryClient } from '@tanstack/react-query';

export function Providers({ children }: { children: ReactNode }) {
  const [qc] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 1000 * 60, retry: 1, refetchOnWindowFocus: false },
    },
  }));

  return (
    <QueryClientProvider client={qc}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '10px', fontSize: '14px' },
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
