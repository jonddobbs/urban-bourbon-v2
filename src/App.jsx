import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import JackScrollGuide from './components/JackScrollGuide.jsx'
import Home from './pages/Home.jsx'
import Coffee from './pages/Coffee.jsx'
import OurStory from './pages/OurStory.jsx'
import ComingSoon from './pages/ComingSoon.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coffee" element={<Coffee />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/merch" element={<ComingSoon page="Merch" />} />
        <Route path="/subscriptions" element={<ComingSoon page="Subscriptions" />} />
      </Routes>
      <Footer />
      <JackScrollGuide />
    </BrowserRouter>
  )
}
