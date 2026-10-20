import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { createCourse, getCourse, updateCourse } from "../services/api";

const statuses = ["Open", "Close", "Cancel"];

export default function TeacherCourseFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    duration: "",
    topics: [],
    price: "",
    maxStudent: "",
    status: "Open",
  });
  const [topicInput, setTopicInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      getCourse(id)
        .then((data) =>
          setForm({
            name: data.name || "",
            duration: data.duration || "",
            topics: data.topics || [],
            price: data.price || "",
            maxStudent: data.maxStudent || "",
            status: data.status || "Open",
          }),
        )
        .catch((err) => setError(err.message));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTopic = (e) => {
    if (e.key === "Enter" && topicInput.trim()) {
      e.preventDefault();
      if (!form.topics.includes(topicInput.trim())) {
        setForm({ ...form, topics: [...form.topics, topicInput.trim()] });
      }
      setTopicInput("");
    }
  };

  const handleRemoveTopic = (topic) => {
    setForm({ ...form, topics: form.topics.filter((t) => t !== topic) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        duration: Number(form.duration),
        price: Number(form.price),
        maxStudent: Number(form.maxStudent),
      };
      if (isEdit) {
        await updateCourse(id, payload);
      } else {
        await createCourse(payload);
      }
      navigate("/teacher/courses");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isEdit ? "Edit Course" : "Create Course"}
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mt: 2 }}>
        <TextField
          name="name"
          label="Course Name"
          fullWidth
          margin="normal"
          value={form.name}
          onChange={handleChange}
          required
        />
        <TextField
          name="duration"
          label="Duration (days)"
          type="number"
          fullWidth
          margin="normal"
          value={form.duration}
          onChange={handleChange}
          required
        />
        <TextField
          name="topicInput"
          label="Topics (press Enter to add)"
          fullWidth
          margin="normal"
          value={topicInput}
          onChange={(e) => setTopicInput(e.target.value)}
          onKeyDown={handleAddTopic}
        />
        <Box sx={{ mb: 2 }}>
          {form.topics.map((topic) => (
            <Chip
              key={topic}
              label={topic}
              onDelete={() => handleRemoveTopic(topic)}
              sx={{ mr: 1, mt: 1 }}
            />
          ))}
        </Box>
        <TextField
          name="price"
          label="Price"
          type="number"
          fullWidth
          margin="normal"
          value={form.price}
          onChange={handleChange}
          required
        />
        <TextField
          name="maxStudent"
          label="Max Students"
          type="number"
          fullWidth
          margin="normal"
          value={form.maxStudent}
          onChange={handleChange}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            name="status"
            value={form.status}
            label="Status"
            onChange={handleChange}
          >
            {statuses.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          {isEdit ? "Update" : "Create"}
        </Button>
      </Box>
    </Box>
  );
}
