import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useEMS } from '../context/EMSContext';
import toast from "react-hot-toast";

function Notice() {
    const { user } = useAuth()
    const { notices, NoticeAPI } = useEMS()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });

    const handleAddNotice = async () => {
        if (!formData.title || !formData.description) {
            toast.error("All fields are required");
            return;
        }

        try {
            setLoading(true)
            await NoticeAPI(null, formData, "add");
            toast.success("Notice added successfully");
            setFormData({ title: "", description: "" });
        } catch (error) {
            toast.error("Failed to add notice");
        } finally {
            setLoading(false)
        }
    };

    const handleDeleteNoticeById = async (id) => {
        if (window.confirm("Are you sure you want to delete this notice?")) {
            try {
                await NoticeAPI(id, null, "delete");
                toast.success("Notice deleted successfully");
            } catch (error) {
                toast.error("Failed to delete notice");
            }
        }
    }

    return (
        <div className="p-4">

            {/* Admin Add Notice Form */}
            {user?.role === "admin" && (
                <div className="mb-6 p-4 border rounded-lg shadow-sm bg-white">
                    <h2 className="text-xl font-semibold mb-2">Add Notice</h2>
                    <input
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full border rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                        className="w-full border rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleAddNotice}
                        className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg ${loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "+ Add Notice"}
                    </button>
                </div>
            )}

            {/* Notice List */}
            <div className="space-y-4">
                {notices.length === 0 ? (
                    <p>No notices found.</p>
                ) : (
                    notices.map((notice) => (
                        <div
                            key={notice._id}
                            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-white"
                        >
                            <h3 className="text-lg font-semibold text-indigo-500">{notice.title}</h3>
                            <p className="text-gray-800">{notice.description}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {new Date(notice.createdAt).toLocaleString()}
                            </p>

                            {user?.role === "admin" && (
                                <button
                                    onClick={() => handleDeleteNoticeById(notice._id)}
                                    className="mt-3 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Notice