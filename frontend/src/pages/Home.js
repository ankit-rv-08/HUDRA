import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import TaskCard from "../components/TaskCard";

function Home() {
  const dummyTasks = [
    {
      title: "Fix WiFi",
      description: "Need help setting up router",
      location: "Bangalore",
      budget: "₹1000",
    },
    {
      title: "Clean Apartment",
      description: "2BHK full cleaning",
      location: "Delhi",
      budget: "₹2000",
    },
    {
      title: "Move Furniture",
      description: "Help shifting sofa and table",
      location: "Mumbai",
      budget: "₹1500",
    },
  ];

  return (
    <div>
      <Navbar />
      <Hero />
      <Categories />

      <h2 className="text-2xl px-8 mt-10 mb-6">
        Available Tasks
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
        {dummyTasks.map((task, i) => (
          <TaskCard key={i} task={task} />
        ))}
      </div>
    </div>
  );
}

export default Home;