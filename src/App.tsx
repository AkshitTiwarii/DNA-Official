import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { 
  BrowserRouter, 
  Routes, 
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Outlet
} from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Opportunities from "./pages/Opportunities";
import Projects from "./pages/Projects";
import DNAxOSCI from "./pages/DNAxOSCI";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import Rewards from "./pages/Rewards";
import Internships from "./pages/Internships";
import Hackathons from "./pages/Hackathons";
import JobOpenings from "./pages/JobOpenings";
import Mentorship from "./pages/Mentorship";
import Workshops from "./pages/Workshops";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSetup from "./pages/AdminSetup";
import ContentPage from "./pages/ContentPage";
import RoadmapPage from "./pages/RoadmapPage";

const queryClient = new QueryClient();

import { UserProvider } from './contexts/user-context';
import { AdminProvider } from './contexts/admin-context';

import MobileNav from './components/MobileNav';

const Layout = () => {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Outlet />
      <MobileNav />
    </div>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<Index />} />
      <Route 
        path="/events" 
        element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        } 
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/opportunities" element={<Opportunities />} />
      <Route path="/internships" element={<Internships />} />
      <Route path="/hackathons" element={<Hackathons />} />
      <Route path="/job-openings" element={<JobOpenings />} />
      <Route path="/free-resources" element={<ContentPage />} />
      <Route path="/mentorship" element={<Mentorship />} />
      <Route path="/workshops" element={<Workshops />} />
      <Route path="/content" element={<ContentPage />} />
      <Route path="/roadmap/:roadmapId" element={<RoadmapPage />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/dna-osci" element={<DNAxOSCI />} />
      <Route path="/admin-setup" element={<AdminSetup />} />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/rewards" 
        element={
          <ProtectedRoute>
            <Rewards />
          </ProtectedRoute>
        }
      />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <AdminProvider>
            {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
            <Toaster />
            <Sonner />
            <RouterProvider router={router} />
          </AdminProvider>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
