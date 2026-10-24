import { Department } from "../models/department.model.js";

const addDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Department name is required" });
    }

    const exists = await Department.findOne({ name });
    if (exists) { 
      return res.status(400).json({ message: "Department already exists" });
    }

    const department = await Department.create({ name, description });
    res.status(201).json({ message: "Department added successfully", department });
  } catch (error) {
    console.error("Add Department Error:", error);
    res.status(500).json({ message: "Error adding department" });
  }
};

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({name: 1})
    res.json({ departments });
  } catch (error) {
    console.error("Get Departments Error:", error);
    res.status(500).json({ message: "Error fetching departments" });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    if (name) {
      const exists = await Department.findOne({ name });
      if (exists && exists._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "Another department with this name already exists" });
      }
      department.name = name;
    }

    if (description !== undefined) department.description = description;

    const updatedDepartment = await department.save();
    res.json({ message: "Department updated successfully", department: updatedDepartment });
  } catch (error) {
    console.error("Update Department Error:", error);
    res.status(500).json({ message: "Error updating department" });
  }
};


const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    await department.deleteOne();
    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Delete Department Error:", error);
    res.status(500).json({ message: "Error deleting department" });
  }
};

export default {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
}