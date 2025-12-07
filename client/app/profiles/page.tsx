import ProfileForm from "@/components/ProfileForm";
import ProfileList from "@/components/ProfileList";

export default function ProfilesPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profiles</h1>
      <ProfileForm />
      <ProfileList />
    </div>
  );
}
