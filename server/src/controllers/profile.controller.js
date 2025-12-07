import Profile from "../models/profile.model.js";

/**
 * POST /api/profiles
 * Create a profile
 */
export const createProfile = async (req, res) => {
  try {
    const { name, timezone } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const profile = await Profile.create({
      name,
      timezone: timezone || "UTC",
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/profiles
 * List all profiles
 */
export const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
