import React, { useEffect, useState } from "react";
import axiosInstance from "../Api/axios";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/users", {
        params: { search, page, limit },
      });
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, page]);

  const makeAdmin = async (id, email) => {
    const confirm = await Swal.fire({
      title: "Make Admin?",
      text: `Are you sure you want to make ${email} an admin?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, make admin!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosInstance.patch(`/users/${id}/make-admin`);
      if (res.data.success) {
        Swal.fire("Success", "User is now an admin!", "success");
        fetchUsers();
      } else {
        Swal.fire("Error", res.data.message || "Could not update user", "error");
      }
    } catch (err) {
      console.error("Error making admin:", err);
      Swal.fire("Error", "Could not update user", "error");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md mt-10 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center md:text-left">
        Manage Users
      </h2>

      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="mb-4 px-4 py-2 border rounded-md w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 transition"
      />

      {loading ? (
        <p className="text-center text-gray-700 dark:text-gray-300 py-6">
          Loading users...
        </p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-auto">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Username</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Subscription</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Role</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-600 dark:text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user, idx) => (
                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">{(page - 1) * limit + idx + 1}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">{user.displayName || "N/A"}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">{user.email}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">{user.badge || "Bronze"}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">{user.role}</td>
                      <td className="px-4 py-2 text-center text-sm whitespace-nowrap">
                        {user.role === "admin" ? (
                          <span className="text-green-500 font-semibold">Admin</span>
                        ) : (
                          <button
                            onClick={() => makeAdmin(user._id, user.email)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md transition"
                          >
                            Make Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition"
              >
                Prev
              </button>
              <span>
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageUsers;
