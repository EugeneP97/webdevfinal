import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Chip, Typography } from "@mui/material";
import { enroll, getCourse } from "../services/api";

export default function StudentCourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCourse(id)
      .then((data) => setCourse(data))
      .catch((err) => setMessage(err.message));
  }, [id]);

  const handleEnroll = async () => {
    setLoading(true);
    setMessage("");
    try {
      await enroll(id);
      setMessage("Enrolled successfully");
      getCourse(id)
        .then((data) => setCourse(data))
        .catch((err) => setMessage(err.message));
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!course) return <Typography>{message || "Loading..."}</Typography>;

  const isFull = course.enrolledStudents.length >= course.maxStudent;
  const canEnroll = course.status === "Open" && !isFull;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {course.name}
      </Typography>
      <Typography color="text.secondary">
        Teacher: {course.teacherName}
      </Typography>
      <Typography>Duration: {course.duration} days</Typography>
      <Typography>Price: {course.price}</Typography>
      <Typography>Max Students: {course.maxStudent}</Typography>
      <Typography>
        Enrolled: {course.enrolledStudents.length} / {course.maxStudent}
      </Typography>
      <Typography>Topics: {course.topics?.join(", ") || "None"}</Typography>
      <Box sx={{ mt: 2 }}>
        <Typography component="span" sx={{ mr: 1 }}>
          Status:
        </Typography>
        <Chip label={course.status} size="small" />
      </Box>
      {message && (
        <Typography sx={{ mt: 2 }} color="text.secondary">
          {message}
        </Typography>
      )}
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        disabled={!canEnroll || loading}
        onClick={handleEnroll}
      >
        {course.status === "Open" ? (isFull ? "Course Full" : "Enroll") : "Not Available"}
      </Button>
    </Box>
  );
}
