import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Roadmap from './pages/Roadmap'
import Login from './pages/Login'
import Dashboard from './components/dashboard/Dashboard'

type Page = 'home' | 'about' | 'roadmap' | 'login' | 'dashboard'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />
      case 'about':
        return <About />
      case 'roadmap':
        return <Roadmap />
      case 'login':
        return <Login />
      case 'dashboard':
        return <Dashboard />
      default:
        return <Home onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="main-content">
        {renderPage()}
      </main>
      <Footer />
    </div>
  )
}

export default App
