import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/Home';
import CourseList from '../pages/Course/CourseList';
import CourseDetail from '../pages/Course/CourseDetail';
import Profile from '../pages/User/Profile';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/courses/:id',
        element: <CourseDetail />,
      },
      {
        path: '/courses',
        element: <CourseList />,
      },
      {
        path: '/user/profile',
        element: <Profile />,
      },
      {
        path: '/admin/profile',
        element: <Profile />,
      }
    ]
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  }
]);
