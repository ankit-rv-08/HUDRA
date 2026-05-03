import React from "react";

const categoryList = [
  "Moving",
  "Cleaning",
  "Pet Care",
  "Event Help",
  "Handyman",
  "Delivery",
  "Tech Help",
  "Errands",
];

function Categories() {
  return (
    <div className="px-8 py-10">
      <h2 className="text-2xl font-semibold mb-6">
        Browse by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categoryList.map((cat, i) => (
          <div
            key={i}
            className="bg-gray-900 p-4 rounded-lg text-center hover:bg-gray-800 cursor-pointer"
          >
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
