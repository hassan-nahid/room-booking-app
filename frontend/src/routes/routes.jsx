import { createBrowserRouter } from 'react-router'
import ErrorPage from '../pages/ErrorPage'
import MainLayouts from '../Layouts/MainLayouts'
import DashboardLayout from '../Layouts/DashboardLayout'
import Home from '../pages/Home'
import PropertyDetails from '../pages/PropertyDetails'
import SearchResults from '../pages/SearchResults'
import Profile from '../pages/Profile'
import Dashboard from '../pages/Dashboard'
import Properties from '../pages/dashboard/Properties'
import CreateProperty from '../pages/dashboard/CreateProperty'
import UpdateProperty from '../pages/dashboard/UpdateProperty'
import Trips from '../pages/dashboard/Trips'
import Settings from '../pages/dashboard/Settings'
import Wishlists from '../pages/dashboard/Wishlists'
import Messages from '../pages/dashboard/Messages'
import Reviews from '../pages/dashboard/Reviews'
import HelpSupport from '../pages/dashboard/HelpSupport'
import Help from '../pages/dashboard/Help'
import Bookings from '../pages/dashboard/Bookings'
import Analytics from '../pages/dashboard/Analytics'
import Earnings from '../pages/dashboard/Earnings'
import ProfileSwitcher from '../components/ProfileSwitcher'



export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayouts />,
    errorElement: <ErrorPage />,
    children:[
      {
        path:'/',
        element: <Home/>
      },
      {
        path:'/search',
        element: <SearchResults/>
      },
      {
        path:'/property/:id',
        element: <PropertyDetails/>
      },
      {
        path:'/profile',
        element: <Profile/>
      },    
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/dashboard/properties',
        element: <Properties />
      },
      {
        path: '/dashboard/properties/create',
        element: <CreateProperty />
      },
      {
        path: '/dashboard/properties/edit/:id',
        element: <UpdateProperty />
      },
      {
        path: '/dashboard/trips',
        element: <Trips />
      },
      {
        path: '/dashboard/settings',
        element: <Settings />
      },
      {
        path: '/dashboard/wishlists',
        element: <Wishlists />
      },
      {
        path: '/dashboard/messages',
        element: <Messages />
      },
      {
        path: '/dashboard/reviews',
        element: <Reviews />
      },
      {
        path: '/dashboard/help-support',
        element: <HelpSupport />
      },
      {
        path: '/dashboard/help',
        element: <Help />
      },
      {
        path: '/dashboard/bookings',
        element: <Bookings />
      },
      {
        path: '/dashboard/analytics',
        element: <Analytics />
      },
      {
        path: '/dashboard/earnings',
        element: <Earnings />
      },
      {
        path: '/dashboard/profile-switcher',
        element: <ProfileSwitcher />
      },
    ],
  },
//   {
//     path:'/login',
//     element: <Login/>
//   },
//   {
//     path:'/signup',
//     element: <SignUp/>
//   },
//   {
//     path:'/dashboard',
//     element: <PrivateRoute><DashboardLayout/></PrivateRoute>,
//     children:[
//       {
//         path: '/dashboard',
//         element: <MyBookings/>,
//       },
//       {
//         path: '/dashboard/add-room',
//         element: <AddRoom/>,
//       },
//       {
//         path: '/dashboard/my-bookings',
//         element: <MyBookings/>,
//       },
//       {
//         path: '/dashboard/my-listings',
//         element: <MyListings/>,
//       },
//       {
//         path: '/dashboard/manage-bookings',
//         element: <ManageBookings/>,
//       },
//     ]
//   }
])