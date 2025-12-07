"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { createProfile } from "../store/profileSlice";
import type { AppDispatch } from "../store";

const TIMEZONES = ["UTC", "Asia/Kolkata", "America/New_York", "Europe/London"];

export default function ProfileForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("UTC");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    dispatch(createProfile({ name, timezone }));
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-4 rounded-lg mb-6">
      <h2 className="text-lg font-semibold mb-4">Create Profile</h2>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Profile name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 rounded bg-slate-900 border border-slate-700"
        />

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

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium"
        >
          Create
        </button>
      </div>
    </form>
  );
}
