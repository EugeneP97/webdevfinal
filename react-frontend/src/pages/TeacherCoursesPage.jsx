import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { deleteCourse, listCourses } from "../services/api";

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    listCourses().then((data) => setCourses(data));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this course?")) return;
    try {
      await deleteCourse(id);
      setMessage("Course deleted");
      listCourses().then((data) => setCourses(data));
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Courses
      </Typography>
      {message && (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Duration (days)</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Max Students</TableCell>
              <TableCell>Enrolled</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell>{course.name}</TableCell>
                <TableCell>
                  <Chip
                    label={course.status}
                    color={
                      course.status === "Open"
                        ? "success"
                        : course.status === "Close"
                          ? "warning"
                          : "error"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{course.duration}</TableCell>
                <TableCell>{course.price}</TableCell>
                <TableCell>{course.maxStudent}</TableCell>
                <TableCell>{course.enrolledStudents?.length || 0}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    component={Link}
                    to={`/teacher/courses/${course._id}`}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    component={Link}
                    to={`/teacher/courses/${course._id}/edit`}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(course._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {courses.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No courses yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
