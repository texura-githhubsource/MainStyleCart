import React from "react";

const AboutUs = ({ isDarkMode }) => {
  return (
    <section
      className={`min-h-screen flex flex-col justify-center items-center px-6 py-20 transition-all duration-500 ${
        isDarkMode ? "bg-[#080808] text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h2 className="text-3xl md:text-4xl font-semibold mb-6">About Us</h2>
      <p className="max-w-2xl text-center opacity-90 leading-relaxed text-base md:text-lg">
        We are passionate about delivering the best quality products with
        affordable pricing. Our goal is to create a smooth and enjoyable shopping
        experience for every customer.
      </p>
    </section>
  );
};

export default AboutUs;
