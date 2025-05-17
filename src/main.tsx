import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import React from 'react'
import { Provider } from 'react-redux'
import { store } from './redux/store'

import App from './App.tsx'
import './index.css'
import Channel from './components/pages/channel/Channel.tsx'
import Home from './components/pages/home/Home.tsx'
import Search from './components/pages/search/Search.tsx'
import Login from './components/pages/login/Login.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'channels',
        element: <Channel />,
      },
      {
        path: 'search',
        element: <Search />,
      },
      {
        path: 'mood',
        element: <div className="text-white">Mood Page Coming Soon</div>,
      },
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
