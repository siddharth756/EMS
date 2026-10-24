import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useEMS } from "../context/EMSContext";
import { API_BASE_URL } from "../api/api";
import toast from "react-hot-toast";

function Profile() {
  const { user } = useAuth();
  const { EmployeeAPI, loading } = useEMS();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");

  useEffect(() => {
    setAvatarPreview(user?.avatar ? `${API_BASE_URL}/uploads/${user.avatar}` : "");
  }, [user]);

  if (!user) {
    return (
      <div className="text-center text-gray-600 mt-10">
        <h2 className="text-xl font-semibold">No profile data found</h2>
      </div>
    );
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      if (avatarFile) data.append("avatar", avatarFile);

      const updatedUser = await EmployeeAPI(user._id, data, "update");
      toast.success("Profile updated successfully!");
      setEditMode(false);
      if (updatedUser?.avatar) {
        setAvatarPreview(`${API_BASE_URL}${updatedUser.avatar.startsWith("/") ? "" : "/"}${updatedUser.avatar}`);
      }
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-20 h-20">
          <img
            src={
              avatarPreview
                ? avatarPreview
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="profile"
            className="w-20 h-20 rounded-full shadow object-cover"
          />

          {editMode && (
            <>
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white text-sm font-medium cursor-pointer">
                Change
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
              />
            </>
          )}
        </div>

        <div>
          {editMode ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border rounded px-2 py-1 w-full text-lg font-bold"
            />
          ) : (
            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
          )}
          <p className="text-gray-600">{user.role}</p>
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-500">Email</h3>
          <p className="text-gray-800">{user.email}</p>
        </div>

        {user.role !== "admin" && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Department</h3>
            <p className="text-gray-800">{user.department_id?.name || "N/A"}</p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-gray-500">Employee ID</h3>
          <p className="text-gray-800">{user._id || "N/A"}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500">Phone</h3>
          {editMode ? (
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border px-2 py-1 rounded w-full"
            />
          ) : (
            <p className="text-gray-800">{user.phone || "N/A"}</p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500">Joining Date</h3>
          <p className="text-gray-800">
            {user.join_date ? new Date(user.join_date).toLocaleDateString() : "N/A"}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500">Status</h3>
          <p
            className={`font-medium ${
              user.status === "active" ? "text-green-600" : "text-red-600"
            }`}
          >
            {user.status || "N/A"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6">
        {editMode ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md ${loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;
