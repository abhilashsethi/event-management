import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../services/api";

export interface Event {
  _id: string;
  title: string;
  description?: string;
  profileIds: string[];
  timezone: string;
  start: string;
  end: string;
  createdAt: string;
  updatedAt: string;
}
export interface EventLog {
  _id: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  createdAt: string;
}

interface EventsState {
  items: Event[];
  loading: boolean;
  error: string | null;

  logs: EventLog[];
  logsLoading: boolean;
}

const initialState: EventsState = {
  items: [],
  loading: false,
  error: null,

  logs: [],
  logsLoading: false,
};


export const fetchEventsForProfile = createAsyncThunk(
  "events/fetchForProfile",
  async (params: { profileId: string; timezone: string }) => {
    const res = await api.get<Event[]>("/events", { params });
    return res.data;
  }
);

// POST /api/events
export const createEvent = createAsyncThunk(
  "events/create",
  async (data: {
    title: string;
    description?: string;
    profileIds: string[];
    timezone: string;
    startDateTime: string;
    endDateTime: string;
  }) => {
    const res = await api.post<Event>("/events", data);
    console.log(res)
    return res.data;
  }
);

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearEvents(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEventsForProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchEventsForProfile.fulfilled,
        (state, action: PayloadAction<Event[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchEventsForProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch events";
      })

      // Create event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createEvent.fulfilled,
        (state, action: PayloadAction<Event>) => {
          state.loading = false;
          state.items.unshift(action.payload);
        }
      )
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to create event";
      });
  },
});

// PUT /api/events/:id
export const updateEvent = createAsyncThunk(
  "events/update",
  async (data: {
    eventId: string;
    payload: {
      title?: string;
      startDateTime?: string;
      endDateTime?: string;
      updatedByProfileId: string;
    };
  }) => {
    const res = await api.put(`/events/${data.eventId}`, data.payload);
    return res.data;
  }
);

// GET /api/events/:id/logs
export const fetchEventLogs = createAsyncThunk(
  "events/logs",
  async (params: { eventId: string; timezone: string }) => {
    const res = await api.get(`/events/${params.eventId}/logs`, {
      params: { timezone: params.timezone },
    });
    return res.data;
  }
);


export const { clearEvents } = eventSlice.actions;
export default eventSlice.reducer;
