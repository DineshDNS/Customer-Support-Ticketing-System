import { useEffect, useState } from "react";
import api from "../../../services/api";
import styles from "./Settings.module.css";

function Settings() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await api.get("/settings/profile/");
    setProfile(res.data);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    await api.put("/settings/profile/", profile);
    alert("Profile updated");
  };

  const changePassword = async (e) => {
    e.preventDefault();
    await api.post("/settings/change-password/", passwords);
    alert("Password changed");
    setPasswords({ old_password: "", new_password: "" });
  };

  return (
    <div className={styles.container}>

      {/* Profile */}
      <form onSubmit={updateProfile} className={styles.card}>
        <h3>Profile</h3>
        <input
          value={profile.username}
          onChange={(e) =>
            setProfile({ ...profile, username: e.target.value })
          }
          placeholder="Username"
        />
        <input
          value={profile.email}
          onChange={(e) =>
            setProfile({ ...profile, email: e.target.value })
          }
          placeholder="Email"
        />
        <div className={styles.profileButton}>
            <button type="submit">Update Profile</button>
        </div>
        
      </form>

      {/* Password */}
      <form onSubmit={changePassword} className={styles.card}>
        <h3>Change Password</h3>
        <input
          type="password"
          placeholder="Old Password"
          value={passwords.old_password}
          onChange={(e) =>
            setPasswords({ ...passwords, old_password: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="New Password"
          value={passwords.new_password}
          onChange={(e) =>
            setPasswords({ ...passwords, new_password: e.target.value })
          }
        />
        <div className={styles.profileButton}>
            <button type="submit">Change Password</button>
        </div>
        
      </form>
    </div>
  );
}

export default Settings;
