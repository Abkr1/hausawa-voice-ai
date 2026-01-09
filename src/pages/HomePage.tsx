import Chat from "@/components/Chat";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-2 sm:p-4">
        <div className="w-full max-w-4xl mx-auto">
            <header className="text-center mb-6">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white">Sautin AI</h1>
                <p className="text-md sm:text-lg text-gray-600 dark:text-gray-300 mt-2">Mai taimaka maka da murya a harshen Hausa</p>
            </header>
            <Chat />
        </div>
    </div>
  );
}