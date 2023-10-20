export default function LendForm() {
  return (
    <form className="flex items-center justify-center space-x-4">
      <input
        type="number"
        placeholder="Amount to lend"
        className="w-1/3 px-4 py-2 text-gray-300 bg-gray-700 rounded focus:outline-none focus:border-orange-500"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-orange-500 rounded hover:bg-orange-600 focus:outline-none"
      >
        Lend sBTC
      </button>
    </form>
  );
}
