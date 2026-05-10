import { CardStack } from "./components/card-stack";
import { volunteerOpportunities } from "./data";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <main className="w-full flex flex-col items-center justify-center py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Good Match
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find volunteering opportunities that match your passion
          </p>
        </div>
        <CardStack opportunities={volunteerOpportunities} />
      </main>
    </div>
  );
}
