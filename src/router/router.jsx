import { createBrowserRouter } from "react-router";
import Root from "../Root/Root";
import Home from "../Component/Home";
import Login from "../Component/Login";
import Register from "../Component/Register";
import UpcomingMeals from "../Component/UpcomingMeals";
import JoinUs from "../Component/JoinUs";
import Dashboard from "../Component/Dashboard";
import MyReviews from "../Component/MyReviews";
import PaymentHistory from "../Component/PaymentHistory";

import AddMeal from "../Component/AddMeal";
import AllReviews from "../Component/AllReviews";
import ServeMeals from "../Component/ServeMeals";
import Meals from "../Component/Meals";
import RequestedMeals from "../Component/RequestedMeals";
import MealDetails from "../Component/MealDetails";
import CheckoutPage from "../Component/CheckoutPage";
import MyProfile from "../Component/MyProfile";
import EditReview from "../Component/EditReview";
import AllMeals from "../Component/AllMeals";
import Unauthorized from "../Component/Unauthorized";
import UserRoute from "./UserRoute";
import AdminRoute from "./AdminRoute";
import ManageUsers from "../Component/ManageUsers";
import ViewMeals from "../Component/ViewMeals";
import { AdminProfile } from "../Component/AdminProfile";
import UpdateMeal from "../Component/UpdateMeal";
import UpcomingMealsAdmin from "../Component/UpcomingMealsManagement";
import Overview from "../Component/Overview"; 
import ErrorPage from "../Component/Error";
import FeaturedProducts from "../Component/FeaturedProducts";
import Newsletter from "../Component/Newsletter";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      // Public Meals routes
      { path: "meals", element: <Meals /> },
      { path: "meal/:id", element: <MealDetails /> },
      { path: "upcoming-meals", element: <UpcomingMeals /> },
      { path: "join-us", element: <JoinUs /> },
      { path: "checkout/:packageName", element: <CheckoutPage /> },
      { path: "unauthorized", element: <Unauthorized /> },

      // ✅ New public routes
      { path: "featured", element: <FeaturedProducts /> },
      { path: "newsletter", element: <Newsletter /> },

      // Dashboard routes - Protected
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          { path: "overview", element: <Overview /> },

          // User Routes
          {
            path: "my-profile",
            element: (
              <UserRoute>
                <MyProfile />
              </UserRoute>
            ),
          },
          {
            path: "requested-meals",
            element: (
              <UserRoute>
                <RequestedMeals />
              </UserRoute>
            ),
          },
          {
            path: "my-reviews",
            element: (
              <UserRoute>
                <MyReviews />
              </UserRoute>
            ),
          },
          {
            path: "payment-history",
            element: (
              <UserRoute>
                <PaymentHistory />
              </UserRoute>
            ),
          },
          {
            path: "edit-review/:id",
            element: (
              <UserRoute>
                <EditReview />
              </UserRoute>
            ),
          },

          // Admin Routes
          {
            path: "admin-profile",
            element: (
              <AdminRoute>
                <AdminProfile />
              </AdminRoute>
            ),
          },
          {
            path: "manage-users",
            element: (
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            ),
          },
          {
            path: "add-meal",
            element: (
              <AdminRoute>
                <AddMeal />
              </AdminRoute>
            ),
          },
          {
            path: "all-meals",
            element: (
              <AdminRoute>
                <AllMeals />
              </AdminRoute>
            ),
          },
          {
            path: "meals/update/:id",
            element: (
              <AdminRoute>
                <UpdateMeal />
              </AdminRoute>
            ),
          },
          {
            path: "view-meal/:id",
            element: (
              <AdminRoute>
                <ViewMeals />
              </AdminRoute>
            ),
          },
          {
            path: "all-reviews",
            element: (
              <AdminRoute>
                <AllReviews />
              </AdminRoute>
            ),
          },
          {
            path: "serve-meals",
            element: (
              <AdminRoute>
                <ServeMeals />
              </AdminRoute>
            ),
          },
          {
            path: "upcoming-meals",
            element: (
              <AdminRoute>
                <UpcomingMealsAdmin />
              </AdminRoute>
            ),
          },
        ],
      },

      // Catch-all for unknown routes
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);
