import Sidebar from '../components/Sidebar';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function Calendar() {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-8">Calendar</h1>
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <CalendarIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 text-lg">Calendar view coming soon</p>
            <p className="text-neutral-400 text-sm mt-2">
              This will show your scheduled sessions and availability
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

