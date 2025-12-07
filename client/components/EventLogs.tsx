"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventLogs } from "../store/eventSlice";
import type { RootState, AppDispatch } from "../store";

export default function EventLogs({
  eventId,
  timezone,
  onClose,
}: {
  eventId: string;
  timezone: string;
  onClose: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { logs, logsLoading } = useSelector((state: RootState) => state.events);

  useEffect(() => {
    dispatch(fetchEventLogs({ eventId, timezone }));
  }, [dispatch, eventId, timezone]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-slate-800 p-6 rounded w-[500px]">
        <h2 className="text-lg font-semibold mb-4">Event Update Logs</h2>

        {logsLoading && <p>Loading logs...</p>}

        {!logsLoading && logs.length === 0 && (
          <p className="text-slate-400">No update logs found.</p>
        )}

        <ul className="space-y-3 max-h-72 overflow-y-auto">
          {logs.map((log: any) => (
            <li key={log._id} className="bg-slate-900 p-3 rounded">
              <p className="text-sm text-slate-400">
                Updated at: {log.createdAt}
              </p>
              {log.changes.map((c: any, i: number) => (
                <p key={i} className="text-sm">
                  <strong>{c.field}</strong>: {String(c.oldValue)} →{" "}
                  {String(c.newValue)}
                </p>
              ))}
            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
