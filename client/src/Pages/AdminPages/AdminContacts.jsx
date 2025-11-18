import React, { useEffect, useState } from "react";
import { FaEnvelope, FaUser, FaCommentDots } from "react-icons/fa";
import axiosInstance from "../../../api/axios";

const AdminContacts = ({ isDarkMode }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const result = await axiosInstance.get("/auth/getMessages");
        if (result?.data?.success && Array.isArray(result?.data?.data)) {
          setContacts(result.data.data);
        } else {
          console.warn("Unexpected response:", result.data);
          setContacts([]);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Failed to load messages. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen text-lg ${
          isDarkMode ? "bg-[#111111] text-white" : "bg-white text-gray-800"
        }`}
      >
        Loading messages...
      </div>
    );
  }

  return (
    <div
      className={`w-full min-h-screen p-6 transition-all duration-500 ${
        isDarkMode ? "bg-[#111111] text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-2xl font-semibold mb-6 text-purple-500">
        Contact Messages
      </h2>

      {contacts.length === 0 ? (
        <p className="text-gray-400 text-center py-10">
          No messages yet. When users submit the contact form, they’ll appear here.
        </p>
      ) : (
        <div className="w-full">
          {/* --- Desktop Table --- */}
          <div className="hidden sm:block overflow-x-auto">
            <table
              className={`w-full border rounded-xl shadow-lg text-sm sm:text-base ${
                isDarkMode ? "border-gray-700" : "border-gray-300"
              }`}
            >
              <thead className={`${isDarkMode ? "bg-[#1a1a1a]" : "bg-gray-100"}`}>
                <tr>
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">
                    <div className="flex items-center gap-2">
                      <FaUser /> Name
                    </div>
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    <div className="flex items-center gap-2">
                      <FaEnvelope /> Email
                    </div>
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    <div className="flex items-center gap-2">
                      <FaCommentDots /> Message
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {contacts.map((contact, index) => (
                  <tr
                    key={index}
                    className={`border-t transition ${
                      isDarkMode
                        ? "border-gray-800 hover:bg-[#1a1a1a]"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{contact.name}</td>
                    <td className="px-4 py-3">{contact.email}</td>
                    <td className="px-4 py-3">{contact.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- Mobile Cards --- */}
          <div className="sm:hidden flex flex-col gap-4">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className={`border rounded-xl p-4 shadow-md transition ${
                  isDarkMode
                    ? "bg-[#1a1a1a] border-gray-700"
                    : "bg-white border-gray-300"
                }`}
              >
                <p className="font-semibold text-purple-500 mb-2">
                  #{index + 1} - {contact.name}
                </p>
                <p className="flex items-center gap-2 mb-1">
                  <FaEnvelope /> {contact.email}
                </p>
                <p className="flex items-center gap-2">
                  <FaCommentDots /> {contact.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
