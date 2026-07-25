import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import ECommerce from './pages/Dashboard/ECommerce';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import PublicLayout from './layout/PublicLayout';
import Home from './pages/Public/Home';
import About from './pages/Public/About';
import Contact from './pages/Public/Contact';


import { Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ContactMessages from './pages/ContactMessages';
import CreateTracking from './pages/Tracking/CreateTracking';
import UpdateTracking from './pages/Tracking/UpdateTracking';
import ViewTracking from './pages/Tracking/ViewTracking';


function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const isAuthRoute =
    pathname === '/' ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/home') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/blog') ||
    pathname.startsWith('/support') ||
    pathname.startsWith('/partner-solutions') ||
    pathname.startsWith('/partner');
  return loading ? (
    <Loader />
  ) : isAuthRoute && !pathname.includes('/blog/create') && !pathname.includes('/blog/list') ? (
    <PublicLayout>
      <ToastContainer position="top-right" />
      <Routes>
        <Route index element={<Navigate to="/home" replace />} />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | Sales Force Automation App for your Field Employees." />
              <SignIn />
            </>
          }
        />
       
        <Route
          path="/home"
          element={
            <>
              <PageTitle title="Home" />
              <Home />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <PageTitle title="About Us" />
              <About />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <PageTitle title="Contact Us" />
              <Contact />
            </>
          }
        />
      </Routes>
    </PublicLayout>
  ) : (
    <DefaultLayout>
      <ToastContainer position="top-right" />
      <Routes>
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <>
                <PageTitle title="Dashboard" />
                <ECommerce />
              </>
            </RequireAuth>
          }
        />
       
      
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <>
                <PageTitle title="Profile" />
                <Profile />
              </>
            </RequireAuth>
          }
        />
       
        <Route
          path="/forms/form-layout"
          element={
            <RequireAuth>
              <>
                <PageTitle title="Form Layout" />
                <FormLayout />
              </>
            </RequireAuth>
          }
        />
        
       
      
       
        
       
      
       
        <Route
          path="/admin/contact-messages"
          element={
            <RequireAuth>
              <>
                <PageTitle title="Contact Messages" />
                <ContactMessages/>
              </>
            </RequireAuth>
          }
        />
        <Route
          path="/admin/create-tracking"
          element={
            <RequireAuth>
              <>
                <PageTitle title="Create Tracking ID" />
                <CreateTracking />
              </>
            </RequireAuth>
          }
        />
        <Route
          path="/admin/update-tracking"
          element={
            <RequireAuth>
              <>
                <PageTitle title="Update Tracking" />
                <UpdateTracking />
              </>
            </RequireAuth>
          }
        />
        <Route
          path="/admin/view-tracking"
          element={
            <RequireAuth>
              <>
                <PageTitle title="View All Tracking" />
                <ViewTracking />
              </>
            </RequireAuth>
          }
        />
      </Routes>
    </DefaultLayout>
  );
}

function RequireAuth({ children }: { children: React.ReactElement }) {
  const isAuthed = typeof window !== 'undefined' && localStorage.getItem('authToken');
  if (!isAuthed) {
    return <Navigate to="/auth/signin" replace />;
  }
  return children;
}

export default App;
