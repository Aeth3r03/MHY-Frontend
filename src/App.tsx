import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
import { Header } from "./components/Header"
import { Home } from "./pages/Home/Home"
import { TermsPage } from "./pages/Terms/TermsPage"
import { CategoriesPage } from "./pages/Categories/CategoriesPage"
import { Footer } from "./components/Footer"
import { ScrollToTop } from "./components/SrollToTop"

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
    const show = location.pathname !== "/terms";

    return (
        <>
        {show && <Header /> }
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/terms" element={<TermsPage /> } />
            <Route path="/categories" element={<CategoriesPage /> } />
        </Routes>
        {show && <Footer />}
        </>
    )
}

export default App
