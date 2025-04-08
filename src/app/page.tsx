import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Title */}
      <header className="text-center py-4">
        <h1 className="text-4xl font-bold">Digital Recipe Book</h1>
      </header>

      {/* Recipes Section */}
      <main className="p-8">
        <div className="text-center">
          <p className="text-lg">Here is where your recipes will be displayed.</p>
          {/* Add your recipes here */}
        </div>
      </main>

      {/* Floating Add Recipe Button */}
      <button
        className="fixed bottom-8 right-8 rounded-full bg-blue-500 text-white text-3xl w-16 h-16 flex items-center justify-center shadow-lg hover:bg-blue-600 transition"
        aria-label="Add Recipe"
      >
        +
      </button>
    </div>
  );
}