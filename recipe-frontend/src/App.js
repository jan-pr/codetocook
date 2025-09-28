import React, { useState } from "react";
import axios from "axios";

function App() {
  const [mealType, setMealType] = useState("Any type");
  const [cuisine, setCuisine] = useState("Any cuisine");
  const [diet, setDiet] = useState("None");
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateRecipe = async () => {
    if (!ingredients.trim()) return alert("Please enter some ingredients!");
    setLoading(true);
    try {
      const res = await axios.post("/generate-recipe", {
        mealType,
        cuisine,
        diet,
        ingredients,
      });
      setRecipe(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch recipe!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen font-sans bg-orange-100">
      {/* Header with image */}
      <header className="relative h-64 md:h-80 w-full mb-10 overflow-hidden rounded-xl shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1560359614-870d1a7ea91d"
          alt="Sunset beach cafe"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 to-transparent flex flex-col justify-end p-6">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
            Sunset Cafe
          </h1>
          <p className="text-amber-100 text-lg">
            Discover Magical Recipes Inspired by Sunset Beaches
          </p>
        </div>
      </header>

      {/* Recipe Generator Form */}
      <main className="p-4 md:p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-md mb-10 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-bold text-amber-700 mb-6 flex items-center">
            <span className="material-symbols-outlined mr-2">auto_awesome</span>
            Recipe Generator
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <label className="block text-amber-700 font-medium">Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full p-3 border border-amber-200 rounded-lg bg-amber-50 focus:ring-2 focus:ring-amber-300 focus:border-amber-500 transition-all"
              >
                <option>Any type</option>
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Dessert</option>
                <option>Snack</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-amber-700 font-medium">Cuisine</label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full p-3 border border-amber-200 rounded-lg bg-amber-50 focus:ring-2 focus:ring-amber-300 focus:border-amber-500 transition-all"
              >
                <option>Any cuisine</option>
                <option>Japanese</option>
                <option>Mediterranean</option>
                <option>Italian</option>
                <option>French</option>
                <option>Asian Fusion</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-amber-700 font-medium">Dietary Restrictions</label>
              <select
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                className="w-full p-3 border border-amber-200 rounded-lg bg-amber-50 focus:ring-2 focus:ring-amber-300 focus:border-amber-500 transition-all"
              >
                <option>None</option>
                <option>Vegetarian</option>
                <option>Vegan</option>
                <option>Gluten-Free</option>
                <option>Dairy-Free</option>
              </select>
            </div>
          </div>

          <div className="mb-6 space-y-2">
            <label className="block text-amber-700 font-medium">Ingredients (comma separated)</label>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g., rice, eggs, seaweed..."
              className="w-full p-3 border border-amber-200 rounded-lg bg-amber-50 focus:ring-2 focus:ring-amber-300 focus:border-amber-500 transition-all"
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={generateRecipe}
              disabled={loading}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-8 rounded-full font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 flex items-center shadow-md hover:shadow-lg"
            >
              {loading ? "Generating..." : "Generate Recipe"}
            </button>
          </div>
        </div>

        {/* Generated Recipe */}
        {recipe && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-md mb-10">
            <h2 className="text-2xl font-bold text-amber-700 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2">restaurant_menu</span>
              {recipe.dish_name}
            </h2>

            <p className="text-amber-800 mb-4">
              ⏱ Prep: {recipe.prep_time} | 🍲 Cook: {recipe.cook_time} | 👨‍👩‍👧 Servings: {recipe.servings}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="font-bold text-amber-700 mb-3">Ingredients</h4>
                <ul className="space-y-2 text-amber-900">
                  {recipe.ingredients.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="material-symbols-outlined text-amber-500 mr-2 mt-0.5">
                        check_circle
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-amber-700 mb-3">Instructions</h4>
                <ol className="space-y-3 text-amber-900">
                  {recipe.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="bg-amber-200 text-amber-700 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
