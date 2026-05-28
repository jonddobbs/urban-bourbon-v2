import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import JackScrollGuide from './components/JackScrollGuide.jsx'
import BasketDrawer from './components/BasketDrawer.jsx'
import Home from './pages/Home.jsx'
import Coffee from './pages/Coffee.jsx'
import Origins from './pages/Origins.jsx'
import OurStory from './pages/OurStory.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import Waitlist from './pages/Waitlist.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import Lounge from './pages/Lounge.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coffee" element={<Coffee />} />
          <Route path="/origins" element={<Origins />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/merch" element={<ComingSoon page="Merch" />} />
          <Route path="/subscriptions" element={<ComingSoon page="Subscriptions" />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/lounge" element={<ProtectedRoute><Lounge /></ProtectedRoute>} />
        </Routes>
        <Footer />
        <JackScrollGuide />
        <BasketDrawer />
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
