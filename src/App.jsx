import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import ComingSoon from './pages/ComingSoon.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coffee" element={<Home scrollTo="coffee" />} />
        <Route path="/merch" element={<ComingSoon page="Merch" />} />
        <Route path="/subscriptions" element={<ComingSoon page="Subscriptions" />} />
        <Route path="/our-story" element={<ComingSoon page="Our Story" />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
