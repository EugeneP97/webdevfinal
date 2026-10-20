import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { listCourses } from "../services/api";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    listCourses(q).then((data) => setCourses(data));
  }, [q]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Available Courses
      </Typography>
      <TextField
        label="Search by course or teacher name"
        fullWidth
        margin="normal"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{course.name}</Typography>
                <Typography color="text.secondary">
                  Teacher: {course.teacherName}
                </Typography>
                <Typography>Duration: {course.duration} days</Typography>
                <Typography>Price: {course.price}</Typography>
                <Typography>
                  Seats: {course.enrolledStudents?.length || 0} /{" "}
                  {course.maxStudent}
                </Typography>
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
                  sx={{ mt: 1 }}
                />
                <Box sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    component={Link}
                    to={`/student/courses/${course._id}`}
                    variant="contained"
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {courses.length === 0 && (
          <Grid item xs={12}>
            <Typography>No courses found</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
