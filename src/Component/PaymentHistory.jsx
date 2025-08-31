import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Auth/AuthContext";
import axiosInstance from "../Api/axios";

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user?.email) {
      setMessage("User not logged in");
      setLoading(false);
      return;
    }

    axiosInstance
      .get(`/payments/${user.email}`)
      .then((res) => {
        if (res.data.payments?.length) {
          setPayments(res.data.payments);
          setMessage("");
        } else {
          setMessage("No payment history found");
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to fetch payment history");
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-700 dark:text-gray-300 text-lg">
        Loading payment history...
      </div>
    );
  }

  if (message) {
    return (
      <div className="flex justify-center items-center py-20 text-red-600 dark:text-red-400 text-lg font-semibold text-center px-4">
        {message}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-10 rounded-xl shadow-lg bg-gray-100 dark:bg-gray-900">
      <h2 className="text-3xl font-bold mb-8 text-center md:text-left text-gray-900 dark:text-gray-100">
        Payment History
      </h2>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-indigo-600 dark:bg-indigo-500 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold border-r border-indigo-500 dark:border-indigo-400 whitespace-nowrap">
                Package Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-r border-indigo-500 dark:border-indigo-400 whitespace-nowrap">
                Amount (USD)
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-r border-indigo-500 dark:border-indigo-400 whitespace-nowrap">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                Purchased At
              </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {payments.map((payment) => (
              <tr
                key={payment._id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-4 py-3 text-gray-900 dark:text-gray-100 font-medium whitespace-nowrap">
                  {payment.packageName}
                </td>
                <td className="px-4 py-3 text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  ${(payment.amount / 100).toFixed(2)}
                </td>
                <td
                  className={`px-4 py-3 font-semibold whitespace-nowrap ${
                    payment.status === "succeeded"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {new Date(payment.purchasedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
