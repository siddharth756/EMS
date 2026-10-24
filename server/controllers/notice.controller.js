import { Notice } from "../models/notice.model.js";

// Create Notice
export const createNotice = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const notice = new Notice({ title, description });

    await notice.save();
    res.status(201).json({ message: "Notice created successfully", notice });
  } catch (error) {
    res.status(500).json({ message: "Failed to create notice", error: error.message });
  }
};

// Get All Notices
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json({ notices });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notices", error: error.message });
  }
};

// Delete Notice
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.json({ message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete notice", error: error.message });
  }
};
