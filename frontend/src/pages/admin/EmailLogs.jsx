// src/pages/admin/EmailLogs.jsx
import React, { useEffect, useState } from "react";
import { useAdminApi } from "../../api/adminApi";

export default function EmailLogs() {
  const { getEmailLogs } = useAdminApi();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getEmailLogs();
        setLogs(res.data || []);
      } catch (err) {
        console.error("Fetch email logs error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
          Email Logs
        </h1>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div>
              <div className="h-12 w-12 border-4 border-orange-500 border-r-transparent animate-spin rounded-full mx-auto"></div>
              <p className="text-center text-orange-800 mt-4 font-semibold">Loading email logs...</p>
            </div>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-16 bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-xl border border-amber-200 text-center">
            <div className="text-6xl mb-2">📭</div>
            <p className="text-xl font-bold text-amber-700">No email logs found</p>
          </div>
        ) : (
          <div className="bg-white/90 rounded-3xl shadow-xl border border-amber-200 overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-amber-100 to-orange-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-amber-800">Email</th>
                  <th className="px-6 py-4 text-left font-bold text-amber-800">Password</th>
                  <th className="px-6 py-4 text-left font-bold text-amber-800">Status</th>
                  <th className="px-6 py-4 text-left font-bold text-amber-800">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-amber-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-amber-50 transition-all">
                    <td className="px-6 py-4 text-gray-700">{log.email}</td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-600">{log.temporary_password}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          log.status === "sent"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}
