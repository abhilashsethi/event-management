"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEvent } from "../store/eventSlice";
import { fetchProfiles } from "../store/profileSlice";
import type { RootState, AppDispatch } from "../store";

const TIMEZONES = ["UTC", "Asia/Kolkata", "America/New_York", "Europe/London"];

export default function EventForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: profiles } = useSelector((state: RootState) => state.profiles);

  const [title, setTitle] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [profileIds, setProfileIds] = useState<string[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  const toggleProfile = (id: string) => {
    setProfileIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !start || !end || profileIds.length === 0) {
      alert("Please fill all required fields");
      return;
    }

    dispatch(
      createEvent({
        title,
        profileIds,
        timezone,
        startDateTime: start,
        endDateTime: end,
      })
    );

    setTitle("");
    setStart("");
    setEnd("");
    setProfileIds([]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-4 rounded-lg mb-6">
      <h2 className="text-lg font-semibold mb-4">Create Event</h2>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded bg-slate-900 border border-slate-700"
        />

        {/* Timezone */}
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="p-2 rounded bg-slate-900 border border-slate-700"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>

        {/* Date Time */}
        <div className="flex gap-2">
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="flex-1 p-2 rounded bg-slate-900 border border-slate-700"
          />
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="flex-1 p-2 rounded bg-slate-900 border border-slate-700"
          />
        </div>

        {/* Profiles */}
        <div className="border border-slate-700 rounded p-2">
          <p className="text-sm mb-2">Assign Profiles</p>
          {profiles.map((p) => (
            <label key={p._id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={profileIds.includes(p._id)}
                onChange={() => toggleProfile(p._id)}
              />
              {p.name}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-medium"
        >
          Create Event
        </button>
      </div>
    </form>
  );
}
