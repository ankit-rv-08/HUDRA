import React from "react";

function Hero() {
  return (
    <div className="text-center py-20 px-6">
      <h1 className="text-4xl font-bold mb-4">
        Professional Task Marketplace
      </h1>

      <p className="text-gray-400 mb-6">
        Post tasks, hire verified professionals, and handle payments securely.
      </p>

      <input
        className="w-full max-w-xl p-3 rounded-lg bg-gray-900 border border-gray-700 mb-4"
        placeholder="What do you need help with?"
      />

      <div className="flex justify-center gap-4">
        <button className="bg-white text-black px-6 py-2 rounded-lg font-semibold">
          Post a Task
        </button>

        <button className="border border-gray-600 px-6 py-2 rounded-lg">
          Browse Tasks
        </button>
      </div>
    </div>
  );
}

export default Hero;