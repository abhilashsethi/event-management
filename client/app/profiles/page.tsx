import Link from "next/link";
import ProfileForm from "../../components/ProfileForm";
import ProfileList from "../../components/ProfileList";

export default function ProfilesPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">Profiles</h1>

        <Link
          href="/events"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium"
        >
          Go to Events →
        </Link>
      </div>

      <div className="space-y-8">
        <ProfileForm />
        <ProfileList />
      </div>
    </div>
  );
}
