import axios from "axios"
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import "./index.css"

export async function loader() {
  const users = await axios.get("/api/users")
  return users.data
}

function formatDate(utcDateString) {
  if (utcDateString == null) return ""
  return new Date(utcDateString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function Index() {
  const loader = useLoaderData();
  const [users, setUsers] = useState(loader);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const hasSelectedUsers = selectedUserIds.length > 0;

  //This part of code retrieves all users again
  //With updated information


  //This part of code handles deletes and updates
  const handleDeletes = async () => {
    await axios.delete("/api/users", { data: { ids: selectedUserIds } });
    setSelectedUserIds([])
    const newUsers = users.filter(x => !selectedUserIds.includes(x.id));
    setUsers(newUsers)
    alert("Deleted successfully")
  }
  const handleBlocks = async () => {
    await axios.post("/api/users/block", {ids: selectedUserIds})
    const newUsers = users.map(x => 
      selectedUserIds.includes(x.id)
        ? { ...x, status: "blocked" }
        : x
    );
    setUsers(newUsers)
    alert("Updated successfully")
  }
  const handleUnblocks = async () => {
    await axios.post("/api/users/unblock", {ids: selectedUserIds})
    const newUsers = users.map(x => 
      selectedUserIds.includes(x.id)
        ? { ...x, status: "active" }
        : x
    );
    setUsers(newUsers)
    alert("Updated successfully")
  }

  //This part of code handles selections and unselections
  const handleCheckboxChange = (userId) => {
    setSelectedUserIds(prevSelected => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter(id => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };
  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      const allUserIds = users.map(user => user.id);
      setSelectedUserIds(allUserIds);
    } else {
      setSelectedUserIds([]);
    }
  };
  const isAllSelected = selectedUserIds.length === users.length;

  return (
    <div>
      <p>List of users</p>
      <div className="d-flex flex-align-center justify-content-center gap-4 flex-wrap">
        <button className="btn btn-primary" onClick={handleBlocks} disabled={!hasSelectedUsers}>Block</button>
        <button className="btn btn-primary" onClick={handleUnblocks} disabled={!hasSelectedUsers}>Unblock</button>
        <button className="btn btn-danger" onClick={handleDeletes} disabled={!hasSelectedUsers}>Delete</button>
      </div>
      <div className="superbigtableusers border rounded table-responsive">
        <table className="table mb-0">
          <thead className="table-light">
            <tr>
              <th>
                <input type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAllChange} />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Last login</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <input type="checkbox"
                    checked={selectedUserIds.includes(user.id)}
                    onChange={() => handleCheckboxChange(user.id)} />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{formatDate(user.lastlogin)}</td>
                <td>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}