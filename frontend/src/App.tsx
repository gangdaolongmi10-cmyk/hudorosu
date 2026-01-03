import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css'
import { AdminTopPage } from './pages/admin/AdminTop';
import { CategoryIndexPage } from './pages/admin/category/CategoryIndex';
import { CategoryCreatePage } from './pages/admin/category/CategoryCreate';
import { CategoryEditPage } from './pages/admin/category/CategoryEdit';
import { FoodIndexPage } from './pages/admin/food/FoodIndex';
import { FoodCreatePage } from './pages/admin/food/FoodCreate';
import { FoodEditPage } from './pages/admin/food/FoodEdit';
import { AllergenIndexPage } from './pages/admin/allergen/AllergenIndex';
import { AllergenCreatePage } from './pages/admin/allergen/AllergenCreate';
import { AllergenEditPage } from './pages/admin/allergen/AllergenEdit';
import { LoginLogIndexPage } from './pages/admin/loginLog/LoginLogIndex';
import { UserIndexPage } from './pages/admin/user/UserIndex';
import { UserCreatePage } from './pages/admin/user/UserCreate';
import { UserEditPage } from './pages/admin/user/UserEdit';
import { RoleIndexPage } from './pages/admin/role/RoleIndex';
import { SettingsIndexPage } from './pages/admin/settings/SettingsIndex';
import { RecipeIndexPage } from './pages/admin/recipe/RecipeIndex';
import { RecipeCreatePage } from './pages/admin/recipe/RecipeCreate';
import { RecipeEditPage } from './pages/admin/recipe/RecipeEdit';
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
                    path="/admin/food/create" 
                    element={
                        <ProtectedRoute>
                            <FoodCreatePage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/food/:id/edit" 
                    element={
                        <ProtectedRoute>
                            <FoodEditPage />
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
                    path="/admin/category/create" 
                    element={
                        <ProtectedRoute>
                            <CategoryCreatePage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/category/:id/edit" 
                    element={
                        <ProtectedRoute>
                            <CategoryEditPage />
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
                    path="/admin/user/create" 
                    element={
                        <ProtectedRoute>
                            <UserCreatePage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/user/:id/edit" 
                    element={
                        <ProtectedRoute>
                            <UserEditPage />
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
                <Route 
                    path="/admin/settings" 
                    element={
                        <ProtectedRoute>
                            <SettingsIndexPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/allergen" 
                    element={
                        <ProtectedRoute>
                            <AllergenIndexPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/allergen/create" 
                    element={
                        <ProtectedRoute>
                            <AllergenCreatePage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/allergen/:id/edit" 
                    element={
                        <ProtectedRoute>
                            <AllergenEditPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/login-logs" 
                    element={
                        <ProtectedRoute>
                            <LoginLogIndexPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/recipe" 
                    element={
                        <ProtectedRoute>
                            <RecipeIndexPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/recipe/create" 
                    element={
                        <ProtectedRoute>
                            <RecipeCreatePage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/recipe/:id/edit" 
                    element={
                        <ProtectedRoute>
                            <RecipeEditPage />
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
