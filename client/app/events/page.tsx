import Link from "next/link";
import EventForm from "../../components/EventForm";
import EventList from "../../components/EventList";

export default function EventsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">Events</h1>

        <Link
          href="/profiles"
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm font-medium"
        >
          ← Go to Profiles
        </Link>
      </div>

      <div className="space-y-8">
        <EventForm />
        <EventList />
      </div>
    </div>
  );
}
