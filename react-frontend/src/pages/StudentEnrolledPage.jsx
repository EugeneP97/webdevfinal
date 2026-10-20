import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { UserContext } from "../context/UserContext.js";
import { listCourses } from "../services/api";

export default function StudentEnrolledPage() {
  const { user } = useContext(UserContext);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    listCourses().then((data) => {
      const enrolled = data.filter((c) =>
        c.enrolledStudents?.some((s) => s.studentId === user?.id),
      );
      setCourses(enrolled);
    });
  }, [user]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Enrolled Courses
      </Typography>
      <Grid container spacing={2}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{course.name}</Typography>
                <Typography color="text.secondary">
                  Teacher: {course.teacherName}
                </Typography>
                <Typography>Duration: {course.duration} days</Typography>
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
            <Typography>You are not enrolled in any courses</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
