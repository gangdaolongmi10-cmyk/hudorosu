import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css'
import { AdminTopPage } from './pages/admin/AdminTop';
import { CategoryIndexPage } from './pages/admin/category/CategoryIndex';
import { FoodIndexPage } from './pages/admin/food/FoodIndex';
import { UserIndexPage } from './pages/admin/user/UserIndex';
import { RoleIndexPage } from './pages/admin/role/RoleIndex';
import { NotFoundPage } from './pages/admin/error/NotFound';
import { AuthLoginPage } from './pages/admin/auth/AuthLogin';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 認証不要のルート */}
                <Route path="/admin/login" element={<AuthLoginPage />} />
                
                {/* 認証が必要なルート */}
                <Route 
                    path="/admin" 
                    element={
                        <ProtectedRoute>
                            <AdminTopPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/food" 
                    element={
                        <ProtectedRoute>
                            <FoodIndexPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/category" 
                    element={
                        <ProtectedRoute>
                            <CategoryIndexPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/user" 
                    element={
                        <ProtectedRoute>
                            <UserIndexPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/role" 
                    element={
                        <ProtectedRoute>
                            <RoleIndexPage />
                        </ProtectedRoute>
                    } 
                />
                
                {/* ルートパスは管理画面トップにリダイレクト */}
                <Route path="/" element={<Navigate to="/admin" replace />} />
                
                {/* 404ページ */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
