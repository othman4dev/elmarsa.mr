import { useEffect, useState } from "react";
import { getAllUsers, update, updateRole } from "../../redux/apiCalls";
import "./UserTable.scss";
import List from "../list/List";
import DeleteIcon from "@mui/icons-material/Delete";

import { formatDistanceToNow } from "date-fns";
import { Box, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { userRequest } from "../../axios";
import { notifyUser } from "../notifyuser/ToastMessage";
const UserTable = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function fetchData() {
      setUsers(await getAllUsers());
    }
    fetchData();
  }, []);
  const deleteUser = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found ");
      return null;
    }
    try {
      const res = await userRequest.delete("/api/user/" + id, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`, // Add the token here
        },
      });
      //console.log(res);

    } catch (error) {
      console.error("Error When Deleting user : ", error);

    }
  }

  const columns = [
    { field: "id", headerName: "ID", width: 250 },
    {
      field: "username",
      headerName: "Username",
      width: 200,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography fontWeight="bold">{params.row.username}</Typography>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      renderCell: (params) => (
        <a href={`mailto:${params.value}`} style={{ color: "#00aaff" }}>
          {params.value}
        </a>
      ),
    },
    {
      field: "isAdmin",
      headerName: "Role",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="role">
            <select
              defaultValue={params.row.isAdmin ? "admin" : "user"}
              onChange={(e) =>
                updateRole(
                  dispatch,
                  {
                    isAdmin: e.target.value === "admin" ? true : false,
                  },
                  params.row.id
                )
              }
            >
              <option value="admin" className="admin">
                Admin
              </option>
              <option value="user" className="user">
                User
              </option>
            </select>
          </div>
        );
      },
    },
    { field: "createdAt", headerName: "Created At", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <DeleteIcon
          style={{ cursor: "pointer", color: "red" }}
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this user?")) {

              deleteUser(params.row.id).then(() => {
                notifyUser("succuss", "User deleted successfully");
                setTimeout(() => {
                  window.location.reload();
                }, 2000); // 2 seconds delay
              });
            }
          }}
        />
      ),
    }

  ];
  const userRows = users?.map((user) => ({
    id: user._id, // Use _id as the id
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    createdAt: formatDistanceToNow(user.createdAt, { addSuffix: true }),
  }));
  return (
    <div className="userTable">
      <div className="userStat">
        <div className="userCardStat">
          <span>Total Users:</span>
          <p>{users?.length}</p>
        </div>
        <div className="userCardStat">
          <span>Admin Users:</span>
          <p>{users.filter((user) => user.isAdmin === true).length}</p>
        </div>
        <div className="userCardStat">
          <span>Client Users:</span>
          <p>{users.filter((user) => user.isAdmin === false).length}</p>
        </div>
      </div>
      <List rows={userRows} column={columns} />
    </div>
  );
};

export default UserTable;
