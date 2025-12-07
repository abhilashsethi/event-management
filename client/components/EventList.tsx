"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfiles } from "../store/profileSlice";
import { fetchEventsForProfile, clearEvents } from "../store/eventSlice";
import type { RootState, AppDispatch } from "../store";

export default function EventList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: profiles } = useSelector((state: RootState) => state.profiles);
  const { items: events, loading } = useSelector(
    (state: RootState) => state.events
  );

  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [timezone, setTimezone] = useState("UTC");

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  const handleProfileChange = (id: string) => {
    setSelectedProfileId(id);
    dispatch(clearEvents());

    const profile = profiles.find((p) => p._id === id);
    if (profile) {
      setTimezone(profile.timezone);
      dispatch(
        fetchEventsForProfile({
          profileId: id,
          timezone: profile.timezone,
        })
      );
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Events</h2>

      {/* Profile Selector */}
      <select
        value={selectedProfileId}
        onChange={(e) => handleProfileChange(e.target.value)}
        className="mb-4 w-full p-2 rounded bg-slate-900 border border-slate-700"
      >
        <option value="">Select Profile</option>
        {profiles.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name} ({p.timezone})
          </option>
        ))}
      </select>

      {loading && <p>Loading events...</p>}

      {!loading && events.length === 0 && selectedProfileId && (
        <p className="text-slate-400">No events for this profile.</p>
      )}

      <ul className="space-y-3">
        {events.map((event) => (
          <li key={event._id} className="bg-slate-900 p-3 rounded">
            <div className="flex justify-between">
              <h3 className="font-semibold">{event.title}</h3>
              <span className="text-sm text-slate-400">{timezone}</span>
            </div>

            <div className="text-sm text-slate-300 mt-1">
              <p>
                <strong>Start:</strong> {new Date(event.start).toLocaleString()}
              </p>
              <p>
                <strong>End:</strong> {new Date(event.end).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
