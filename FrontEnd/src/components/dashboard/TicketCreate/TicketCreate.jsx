import styles from "./TicketCreate.module.css";
import { useState } from "react";
import api from "../../../services/api";

function TicketCreate() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("tickets/create/", formData); // ✅ token auto-attached

      alert("Ticket created successfully ✅");

      setFormData({
        title: "",
        category: "",
        priority: "",
        description: "",
      });
    } catch (error) {
  console.log("STATUS:", error.response?.status);
  console.log("DATA:", error.response?.data);
  console.log("FULL ERROR:", error);
  alert("Failed to create ticket ❌");
  }finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2>Create Ticket</h2>
        <p className={styles.subtitle}>
          Submit your issue and our support team will help you
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter ticket title"
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="billing">Billing</option>
                <option value="technical">Technical</option>
                <option value="account">Account</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="">Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your issue"
              required
            />
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TicketCreate;
