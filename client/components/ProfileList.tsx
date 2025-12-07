"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfiles } from "../store/profileSlice";
import type { RootState, AppDispatch } from "../store";

export default function ProfileList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.profiles
  );

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  if (loading) return <p>Loading profiles...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Profiles</h2>

      {items.length === 0 && (
        <p className="text-slate-400">No profiles created yet.</p>
      )}

      <ul className="space-y-2">
        {items.map((profile) => (
          <li
            key={profile._id}
            className="flex justify-between bg-slate-900 p-2 rounded"
          >
            <span>{profile.name}</span>
            <span className="text-slate-400 text-sm">{profile.timezone}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
