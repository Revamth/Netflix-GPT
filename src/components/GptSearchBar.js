const GptSearchBar = () => {
  return (
    <div className="fixed top-20 left-0 right-0 px-6 py-4 bg-gradient-to-b from-black to-transparent z-50 shadow-lg rounded-lg">
      <form className="flex items-center gap-4 max-w-4xl mx-auto">
        <input
          type="text"
          className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          placeholder="What would you like to watch?"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
          Search
        </button>
      </form>
    </div>
  );
};

export default GptSearchBar;
