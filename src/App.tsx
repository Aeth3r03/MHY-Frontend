import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
import { Header } from "./components/Header"
import { Home } from "./pages/Home/Home"
import { TermsPage } from "./pages/Terms/TermsPage"
import { CategoriesPage } from "./pages/Categories/CategoriesPage"
import { Footer } from "./components/Footer"
import { ScrollToTop } from "./utils/SrollToTop"
import { ProductDetail } from "./pages/ProductDetail/ProductDetail"
import { AboutUs } from "./pages/AboutUs/AboutUs"
import { Products } from "./pages/Products/Products"
import { FAQ } from "./pages/FAQ/FAQ"

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop>
                <AppWithLayout />
            </ScrollToTop>
        </BrowserRouter>
    )
    
}

function AppWithLayout() {
    const location = useLocation();
    const show = location.pathname !== "/terms" && location.pathname !== "/about" && location.pathname !== "/faq";

    return (
        <>
        {show && <Header /> }
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/terms" element={<TermsPage /> } />
            <Route path="/categories" element={<CategoriesPage /> } />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/products" element={<Products /> } />
            <Route path="/faq" element={<FAQ />} />
        </Routes>
        {show && <Footer />}
        </>
    )
}

export default App
