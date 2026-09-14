import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "../components/layout/Layout.tsx";
import { AdminLayout } from "../components/admin/AdminLayout.tsx";
import { ProtectedRoute } from "../components/layout/ProtectedRoute.tsx";
import { LoadingScreen } from "../components/ui/Skeleton.tsx";

const Home = lazy(() => import("../pages/Home/Home.tsx"));
const Movies = lazy(() => import("../pages/Movies/Movies.tsx"));
const Anime = lazy(() => import("../pages/Anime/Anime.tsx"));
const Drama = lazy(() => import("../pages/Drama/Drama.tsx"));
const Series = lazy(() => import("../pages/Series/Series.tsx"));
const Search = lazy(() => import("../pages/Search/Search.tsx"));
const MediaDetail = lazy(() => import("../pages/Details/MediaDetail.tsx"));
const Watch = lazy(() => import("../pages/Watch/Watch.tsx"));
const Watchlist = lazy(() => import("../pages/Watchlist/Watchlist.tsx"));
const Profile = lazy(() => import("../pages/Profile/Profile.tsx"));
const Login = lazy(() => import("../pages/Auth/Login.tsx"));
const Register = lazy(() => import("../pages/Auth/Register.tsx"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword.tsx"));
const AdminDashboard = lazy(() => import("../pages/Admin/AdminDashboard.tsx"));
const AdminMovies = lazy(() => import("../pages/Admin/AdminMovies.tsx"));
const ApiKey = lazy(() => import("../pages/ApiKey.tsx"));
const AdminAnime = lazy(() => import("../pages/Admin/AdminAnime.tsx"));
const AdminUsers = lazy(() => import("../pages/Admin/AdminUsers.tsx"));
const AdminGenres = lazy(() => import("../pages/Admin/AdminGenres.tsx"));

const withSuspense = (node: React.ReactNode) => (
  <Suspense fallback={<LoadingScreen label="Loading..." />}>{node}</Suspense>
);

export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={withSuspense(<Home />)} />
        <Route path="/movies" element={withSuspense(<Movies />)} />
        <Route path="/anime" element={withSuspense(<Anime />)} />
        <Route path="/drama" element={withSuspense(<Drama />)} />
        <Route path="/series" element={withSuspense(<Series />)} />
        <Route path="/search" element={withSuspense(<Search />)} />
        <Route path="/movie/:id" element={withSuspense(<MediaDetail />)} />
        <Route path="/anime/:id" element={withSuspense(<MediaDetail />)} />
        <Route path="/drama/:id" element={withSuspense(<MediaDetail />)} />
        <Route path="/series/:id" element={withSuspense(<MediaDetail />)} />

        <Route path="/watch/:id" element={withSuspense(<Watch />)} />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apikey"
          element={
            <ProtectedRoute requireAdmin>
              <ApiKey />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/login" element={withSuspense(<Login />)} />
      <Route path="/register" element={withSuspense(<Register />)} />
      <Route
        path="/forgot-password"
        element={withSuspense(<ForgotPassword />)}
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={withSuspense(<AdminDashboard />)} />
        <Route path="movies" element={withSuspense(<AdminMovies />)} />
        <Route path="anime" element={withSuspense(<AdminAnime />)} />
        <Route path="users" element={withSuspense(<AdminUsers />)} />
        <Route path="genres" element={withSuspense(<AdminGenres />)} />
      </Route>

      <Route path="*" element={withSuspense(<Home />)} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
