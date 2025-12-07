import Event from "../models/event.model.js";
import Profile from "../models/profile.model.js";
import { toUTC, toUserTZ } from "../utils/timezone.js";
import EventUpdateLog from "../models/eventLog.model.js";
import mongoose from "mongoose";


/**
 * POST /api/events
 * Create event for one or multiple profiles
 */
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      profileIds,
      timezone,
      startDateTime,
      endDateTime,
    } = req.body;

    // ✅ Basic validation
    if (!title || !profileIds?.length || !timezone || !startDateTime || !endDateTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Convert start/end from event timezone → UTC
    const startUTC = toUTC(startDateTime, timezone);
    const endUTC = toUTC(endDateTime, timezone);

    // ✅ End must be after start
    if (endUTC <= startUTC) {
      return res.status(400).json({
        message: "End date/time must be after start date/time",
      });
    }

    // ✅ Ensure profiles exist
    const profiles = await Profile.find({ _id: { $in: profileIds } });
    if (profiles.length !== profileIds.length) {
      return res.status(400).json({ message: "One or more profiles not found" });
    }

    const event = await Event.create({
      title,
      description,
      profileIds,
      timezone,
      start: startUTC,
      end: endUTC,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/events?profileId=...&timezone=...
 * Get events for a profile converted to user's timezone
 */
export const getEventsForProfile = async (req, res) => {
  try {
    const { profileId, timezone } = req.query;

    if (!profileId || !timezone) {
      return res
        .status(400)
        .json({ message: "profileId and timezone are required" });
    }

    const events = await Event.find({
      profileIds: profileId,
    }).sort({ start: 1 });

    // ✅ Convert times for user timezone
    const response = events.map((event) => ({
      ...event.toObject(),
      start: toUserTZ(event.start, timezone),
      end: toUserTZ(event.end, timezone),
      createdAt: toUserTZ(event.createdAt, timezone),
      updatedAt: toUserTZ(event.updatedAt, timezone),
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      profileIds,
      timezone,
      startDateTime,
      endDateTime,
      updatedByProfileId,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const changes = [];

    // ✅ Track field changes
    if (title && title !== event.title) {
      changes.push({ field: "title", oldValue: event.title, newValue: title });
      event.title = title;
    }

    if (description && description !== event.description) {
      changes.push({
        field: "description",
        oldValue: event.description,
        newValue: description,
      });
      event.description = description;
    }

    if (timezone && timezone !== event.timezone) {
      changes.push({
        field: "timezone",
        oldValue: event.timezone,
        newValue: timezone,
      });
      event.timezone = timezone;
    }

    if (profileIds && JSON.stringify(profileIds) !== JSON.stringify(event.profileIds.map(String))) {
      changes.push({
        field: "profileIds",
        oldValue: event.profileIds,
        newValue: profileIds,
      });
      event.profileIds = profileIds;
    }

    // ✅ Time updates (timezone-aware)
    if (startDateTime) {
      const newStartUTC = toUTC(startDateTime, event.timezone);
      if (newStartUTC.getTime() !== event.start.getTime()) {
        changes.push({ field: "start", oldValue: event.start, newValue: newStartUTC });
        event.start = newStartUTC;
      }
    }

    if (endDateTime) {
      const newEndUTC = toUTC(endDateTime, event.timezone);
      if (newEndUTC <= event.start) {
        return res.status(400).json({
          message: "End date/time must be after start date/time",
        });
      }
      if (newEndUTC.getTime() !== event.end.getTime()) {
        changes.push({ field: "end", oldValue: event.end, newValue: newEndUTC });
        event.end = newEndUTC;
      }
    }

    // ✅ Save only if something changed
    if (changes.length === 0) {
      return res.status(400).json({ message: "No changes detected" });
    }

    await event.save();

    // ✅ Create update log
    await EventUpdateLog.create({
      eventId: event._id,
      changedByProfileId: updatedByProfileId,
      changes,
    });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const { timezone } = req.query;

    if (!timezone) {
      return res.status(400).json({ message: "timezone is required" });
    }

    const logs = await EventUpdateLog.find({ eventId: id }).sort({
      createdAt: -1,
    });

    const response = logs.map((log) => ({
      ...log.toObject(),
      createdAt: toUserTZ(log.createdAt, timezone),
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
