import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { Providers } from "@/lib/providers";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OverviewLayout } from "@/components/layout/OverviewLayout";

// Auth pages
import { LoginPage } from "@/src/pages/auth/LoginPage";
import { RegisterPage } from "@/src/pages/auth/RegisterPage";
import { ForgotPasswordPage } from "@/src/pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/src/pages/auth/ResetPasswordPage";
import { VerifyEmailPage } from "@/src/pages/auth/VerifyEmailPage";

// Onboarding
import { OnboardingPage } from "@/src/pages/onboarding/OnboardingPage";

// Overview
import { OverviewPage } from "@/src/pages/overview/OverviewPage";

// Dashboard
import { DashboardPage } from "@/src/pages/dashboard/DashboardPage";

// Customers
import { CustomersPage } from "@/src/pages/customers/CustomersPage";
import { CustomerDetailPage } from "@/src/pages/customers/CustomerDetailPage";

// Orders
import { OrdersPage } from "@/src/pages/orders/OrdersPage";
import { NewOrderPage } from "@/src/pages/orders/NewOrderPage";
import { OrderDetailPage } from "@/src/pages/orders/OrderDetailPage";
import { PrintPage } from "@/src/pages/orders/PrintPage";

// Finance
import { IncomePage } from "@/src/pages/finance/IncomePage";
import { ExpensesPage } from "@/src/pages/finance/ExpensesPage";
import { ProfitPage } from "@/src/pages/finance/ProfitPage";

// Employees
import { EmployeesPage } from "@/src/pages/employees/EmployeesPage";

// Inventory
import { InventoryPage } from "@/src/pages/inventory/InventoryPage";
import { InventoryHistoryPage } from "@/src/pages/inventory/InventoryHistoryPage";

// Settings
import { OutletSettingsPage } from "@/src/pages/settings/OutletSettingsPage";
import { ServicesSettingsPage } from "@/src/pages/settings/ServicesSettingsPage";
import { StaffSettingsPage } from "@/src/pages/settings/StaffSettingsPage";
import { SubscriptionSettingsPage } from "@/src/pages/settings/SubscriptionSettingsPage";

function DashboardGroup() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AuthGuard>
  );
}

function OverviewGroup() {
  return (
    <AuthGuard>
      <OverviewLayout>
        <Outlet />
      </OverviewLayout>
    </AuthGuard>
  );
}

const router = createBrowserRouter([
  // Root redirect
  { index: true, element: <Navigate to="/login" replace /> },

  // Auth routes (no layout wrapper needed)
  {
    element: <Outlet />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
      { path: "/verify-email", element: <VerifyEmailPage /> },
    ],
  },

  // Onboarding (standalone)
  { path: "/onboarding", element: <OnboardingPage /> },

  // Overview (owner only)
  {
    element: <OverviewGroup />,
    children: [{ path: "/overview", element: <OverviewPage /> }],
  },

  // Dashboard (all authenticated users)
  {
    element: <DashboardGroup />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/customers", element: <CustomersPage /> },
      { path: "/customers/:id", element: <CustomerDetailPage /> },
      { path: "/orders", element: <OrdersPage /> },
      { path: "/orders/new", element: <NewOrderPage /> },
      { path: "/orders/:id", element: <OrderDetailPage /> },
      { path: "/orders/:id/print", element: <PrintPage /> },
      { path: "/finance/income", element: <IncomePage /> },
      { path: "/finance/expenses", element: <ExpensesPage /> },
      { path: "/finance/profit", element: <ProfitPage /> },
      { path: "/employees", element: <EmployeesPage /> },
      { path: "/inventory", element: <InventoryPage /> },
      { path: "/inventory/:id/history", element: <InventoryHistoryPage /> },
      { path: "/settings/outlet", element: <OutletSettingsPage /> },
      { path: "/settings/services", element: <ServicesSettingsPage /> },
      { path: "/settings/staff", element: <StaffSettingsPage /> },
      { path: "/settings/subscription", element: <SubscriptionSettingsPage /> },
    ],
  },

  // Fallback
  { path: "*", element: <Navigate to="/login" replace /> },
]);

export function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
