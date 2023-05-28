import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.tsx'
import '/static/css/index.css'
import ContextWrap from './context/ContextWrapper.tsx'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ContextWrap>
      <App />
    </ContextWrap>
  </React.StrictMode>
)
