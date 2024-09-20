import axios from "axios"
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faUnlock, faTrash } from '@fortawesome/free-solid-svg-icons'
import { jwtDecode } from 'jwt-decode'
import "./index.css"
import Toast from "../sweetalert";
import Logo from "../assets/logo.webp"

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
  const token = localStorage.getItem("token")
  const name = jwtDecode(token).name;

  //Logouts the user
  const logout = async () => {
    window.location.href = '/login';
    axios.defaults.headers.common = {}
    localStorage.clear()
    Toast.fire({ icon: 'success', title: 'Logged out Successfully'})
  }


  //This part of code handles deletes and updates
  const handleDeletes = async () => {
    await axios.delete("/api/users", { data: { ids: selectedUserIds } });
    setSelectedUserIds([])
    const newUsers = users.filter(x => !selectedUserIds.includes(x.id));
    setUsers(newUsers)
    Toast.fire({ icon: 'success', title: 'Deleted Successfully'})
  }
  const handleBlocks = async () => {
    await axios.post("/api/users/block", { ids: selectedUserIds })
    const newUsers = users.map(x =>
      selectedUserIds.includes(x.id)
        ? { ...x, status: "blocked" }
        : x
    );
    setUsers(newUsers)
    Toast.fire({ icon: 'success', title: 'Updated Successfully'})
  }
  const handleUnblocks = async () => {
    await axios.post("/api/users/unblock", { ids: selectedUserIds })
    const newUsers = users.map(x =>
      selectedUserIds.includes(x.id)
        ? { ...x, status: "active" }
        : x
    );
    setUsers(newUsers)
    Toast.fire({ icon: 'success', title: 'Updated Successfully'})
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
      <nav class="navbar bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <img src={Logo} alt="Logo" width="30" height="30" class="d-inline-block align-text-top logo-navbar-pedrito" />
            RegisFlow
          </a>
          <div>
            <span class="navbar-text">
              Welcome {name}!
            </span>
            <span className="ps-2 navbar-text">
              <a href="javascript:void(0)" onClick={logout} className="text-decoration-none">Logout</a>
            </span>
          </div>

        </div>
      </nav>
      <div className="container">
        <div className="d-flex flex-align-center justify-content-center gap-4 flex-wrap mt-5">
          <button className="btn btn-primary" onClick={handleBlocks} disabled={!hasSelectedUsers}><FontAwesomeIcon className="me-2" icon={faLock} /> Block</button>
          <button className="btn btn-primary" onClick={handleUnblocks} disabled={!hasSelectedUsers}><FontAwesomeIcon className="me-2" icon={faUnlock} /> Unblock</button>
          <button className="btn btn-danger" onClick={handleDeletes} disabled={!hasSelectedUsers}><FontAwesomeIcon className="me-2" icon={faTrash} /> Delete</button>
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
                  <td>
                    {user.status === 'blocked'
                      ? <span className="badge text-bg-danger">Blocked</span>
                      : <span className="badge text-bg-success">Active</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}