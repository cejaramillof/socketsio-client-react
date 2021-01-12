import React from 'react';
import { UiProvider } from './context/UiContext';
import { RouterPage } from './pages/RouterPage';

const TicketApp = () => {
  return (
    <UiProvider>
      <RouterPage />
    </UiProvider>
  )
}

export default TicketApp;
