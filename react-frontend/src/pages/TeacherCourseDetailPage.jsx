import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
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
import { getCourse } from "../services/api";

export default function TeacherCourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getCourse(id)
      .then((data) => setCourse(data))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!course) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {course.name}
      </Typography>
      <Typography color="text.secondary">
        Status: <Chip label={course.status} size="small" />
      </Typography>
      <Typography>Duration: {course.duration} days</Typography>
      <Typography>Price: {course.price}</Typography>
      <Typography>Max Students: {course.maxStudent}</Typography>
      <Typography>
        Topics: {course.topics?.join(", ") || "None"}
      </Typography>
      <Typography sx={{ mt: 2 }} variant="h6">
        Enrolled Students ({course.enrolledStudents?.length || 0})
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Enrolled At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {course.enrolledStudents?.map((s) => (
              <TableRow key={s.studentId}>
                <TableCell>{s.studentName}</TableCell>
                <TableCell>
                  {s.enrolledAt ? new Date(s.enrolledAt).toLocaleString() : "-"}
                </TableCell>
              </TableRow>
            ))}
            {!course.enrolledStudents?.length && (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No students enrolled
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
