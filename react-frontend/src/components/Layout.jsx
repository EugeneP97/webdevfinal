import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { UserContext } from "../context/UserContext";

export default function Layout({ children }) {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Online Course Service
          </Typography>
          {user && (
            <>
              <Typography sx={{ mr: 2 }}>
                {user.username} ({user.role})
              </Typography>
              {user.role === "Teacher" && (
                <>
                  <Button color="inherit" component={Link} to="/teacher/courses">
                    My Courses
                  </Button>
                  <Button color="inherit" component={Link} to="/teacher/courses/new">
                    Create Course
                  </Button>
                </>
              )}
              {user.role === "Student" && (
                <>
                  <Button color="inherit" component={Link} to="/student/courses">
                    Courses
                  </Button>
                  <Button color="inherit" component={Link} to="/student/enrolled">
                    My Enrolled
                  </Button>
                </>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>{children}</Container>
    </Box>
  );
}
