"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateEvent } from "../store/eventSlice";
import type { AppDispatch } from "../store";

export default function EventEditModal({
  event,
  profileId,
  onClose,
}: {
  event: any;
  profileId: string;
  onClose: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState(event.title);

  const handleUpdate = () => {
    dispatch(
      updateEvent({
        eventId: event._id,
        payload: {
          title,
          updatedByProfileId: profileId,
        },
      })
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-slate-800 p-6 rounded w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Event</h2>

        <input
          className="w-full p-2 mb-4 rounded bg-slate-900 border border-slate-700"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-slate-600 rounded">
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-green-600 rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
