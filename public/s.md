# 🏨 Hostel Management System

A full-featured hostel meal service and review platform built with the MERN stack. This system allows university hostel students to view, like, request, and review meals while giving admins full control over meals, reviews, users, and upcoming meals.

## 🔐 Admin Access
- **Admin Email:** admin@hostelhub.com
- **Admin Password:** Admin@1234

## 🌐 Live Website
🔗 [https://hostelhub.web.app](https://hostelhub.web.app)

## 📦 GitHub Repositories
- **Client:** [https://github.com/yourusername/hostelhub-client](https://github.com/yourusername/hostelhub-client)
- **Server:** [https://github.com/yourusername/hostelhub-server](https://github.com/yourusername/hostelhub-server)

---

## 🚀 Key Features

1. **Authentication & Authorization:**
   - Firebase authentication with email/password and social login.
   - JWT implementation with protected routes and Axios interceptor.

2. **User Dashboard:**
   - View profile with badges (Bronze/Gold/Platinum).
   - Requested Meals list with cancel functionality.
   - My Reviews section with edit/delete options.
   - Payment history display.

3. **Admin Dashboard:**
   - Manage all users with role and badge control.
   - Add, update, delete, and view meals.
   - View and delete reviews.
   - Serve requested meals with status updates.
   - Manage upcoming meals and publish after 10+ likes.

4. **Meals Page:**
   - Filter by category and price (server-side).
   - Infinite scroll for seamless UX.
   - Real-time search powered by MongoDB indexing.

5. **Meal Details Page:**
   - Includes distributor info, ingredients, ratings, likes, and reviews.
   - Users can like (1 per meal) and request meals (premium only).
   - Authenticated users can post and view reviews.

6. **Upcoming Meals:**
   - View planned meals.
   - Premium users can like upcoming meals (once per meal).
   - Admins can publish upcoming meals to main collection.

7. **Membership System:**
   - Bronze (default), Silver, Gold, Platinum.
   - Stripe checkout integration for package upgrade.
   - Badge assigned after successful payment.

8. **Modern UI & UX:**
   - Responsive design (mobile/tablet/desktop).
   - Clean layout with dropdowns, modals, and animated buttons.
   - Toasts and SweetAlerts for all operations (no browser alerts).

9. **Environment Config:**
   - Firebase config and MongoDB URI hidden using `.env`.
   - .env excluded from GitHub via `.gitignore`.

10. **Advanced Tools Used:**
    - TanStack Query for all GET requests.
    - React Hook Form for all forms.
    - React Infinite Scroll Component.
    - React Modal, React Select, React Awesome Button.

---

## 📸 Screenshots

*(Add a few screenshots here of your Home, Dashboard, Checkout, Meal Detail page, etc.)*

---

## 📁 Folder Structure (Client & Server)

