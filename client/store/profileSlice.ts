import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../services/api";

export interface Profile {
  _id: string;
  name: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfilesState {
  items: Profile[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfilesState = {
  items: [],
  loading: false,
  error: null,
};


// GET /api/profiles
export const fetchProfiles = createAsyncThunk(
  "profiles/fetchProfiles",
  async () => {
    const res = await api.get<Profile[]>("/profiles");
    return res.data;
  }
);

// POST /api/profiles
export const createProfile = createAsyncThunk(
  "profiles/createProfile",
  async (data: { name: string; timezone: string }) => {
    const res = await api.post<Profile>("/profiles", data);
    return res.data;
  }
);

const profileSlice = createSlice({
  name: "profiles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Profiles
      .addCase(fetchProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProfiles.fulfilled,
        (state, action: PayloadAction<Profile[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch profiles";
      })

      // Create Profile
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createProfile.fulfilled,
        (state, action: PayloadAction<Profile>) => {
          state.loading = false;
          state.items.unshift(action.payload);
        }
      )
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create profile";
      });
  },
});

export default profileSlice.reducer;
