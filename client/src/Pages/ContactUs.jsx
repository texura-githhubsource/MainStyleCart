import React, { useState } from "react";
import axiosInstance from "../../api/axios";

const ContactUs = ({ isDarkMode }) => {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !name.trim() || !email.trim()) {
      alert("Please fill out all fields before submitting.");
      return;
    }
    
    try {
      setLoading(true);

      const payload = { name, email, message };
      const result = await axiosInstance.post("/auth/sendMessage", payload);

      if (result?.data?.success) {
        alert("Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        alert(result?.data?.message || "Something went wrong while sending the message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert(error.response?.data?.message || " Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 md:px-20 py-20 transition-all duration-500 ${
        isDarkMode ? "bg-[#0a0a0a]" : "bg-gray-50"
      }`}
    >
      <h2
        className={`text-4xl md:text-5xl font-extrabold mb-6 text-center ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Get in Touch
      </h2>
      <p
        className={`text-center mb-10 max-w-xl ${
          isDarkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Have questions or want to collaborate? Fill out the form below and we’ll get back to you soon!
      </p>

      <form
        className={`flex flex-col gap-4 w-full max-w-lg p-8 rounded-2xl shadow-lg transition ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`p-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />

        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`p-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />

        <textarea
          rows="5"
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`p-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className={`mt-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
            loading
              ? "bg-gray-500 text-white cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>

      <footer
        className={`w-full text-center py-6 mt-12 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-200"
        }`}
      >
        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
          © 2025 Keshav Singhania. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default ContactUs;
