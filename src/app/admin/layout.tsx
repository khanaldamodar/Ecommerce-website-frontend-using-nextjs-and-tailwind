import React from "react";
import { Metadata } from "next";
import "../../app/globals.css";
import Logout from "@/components/global/Logout";

// Define props interface for the layout
interface AdminLayoutProps {
  children: React.ReactNode;
}

// Metadata for admin pages
export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin panel for managing the application",
  robots: "noindex, nofollow", // Prevent search engines from indexing admin pages
};
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {/* Admin-specific styles and structure */}
        <div className="admin-layout">
          {/* Optional: Admin Header/Topbar */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-full px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-gray-900">
                    Admin Dashboard
                  </h1>
                </div>

                {/* Optional: Admin Navigation or User Menu */}
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Welcome, Admin</span>
                  <Logout />
                </div>
              </div>
            </div>
          </header>

          {/* Admin Sidebar (Optional) */}
          <div className="flex">
            <aside className="w-64 bg-white shadow-sm h-screen sticky top-0 border-r border-gray-200">
              <nav className="mt-8 px-4">
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/admin/dashboard"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                        />
                      </svg>
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <details className="group">
                      <summary className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <svg
                          className="w-5 h-5 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                          />
                        </svg>
                        Products
                      </summary>
                      <ul className="ml-8 mt-2 space-y-1">
                        <li>
                          <a
                            href="/admin/products"
                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition"
                          >
                            All Products
                          </a>
                        </li>
                        <li>
                          <a
                            href="/admin/products/add"
                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition"
                          >
                            Add Product
                          </a>
                        </li>
                      </ul>
                    </details>
                  </li>

                  <li>
                    <a
                      href="/admin/orders"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      Orders
                    </a>
                  </li>
                  <li>
                    <a
                      href="/admin/users"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                      Users
                    </a>
                  </li>
                  <li>
                    <a
                      href="/admin/settings"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Settings
                    </a>
                  </li>
                </ul>
              </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6">
              <div className="max-w-full">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
};

export default AdminLayout;
