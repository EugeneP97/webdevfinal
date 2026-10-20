import { useContext } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { UserContext } from "./context/UserContext.js";
import LoginPage from "./pages/LoginPage";
import StudentCourseDetailPage from "./pages/StudentCourseDetailPage";
import StudentCoursesPage from "./pages/StudentCoursesPage";
import StudentEnrolledPage from "./pages/StudentEnrolledPage";
import TeacherCourseDetailPage from "./pages/TeacherCourseDetailPage";
import TeacherCourseFormPage from "./pages/TeacherCourseFormPage";
import TeacherCoursesPage from "./pages/TeacherCoursesPage";

function ProtectedRoute({ children, role }) {
  const { user, loading } = useContext(UserContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;

  return <Layout>{children}</Layout>;
}

function HomeRedirect() {
  const { user, loading } = useContext(UserContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "Teacher") return <Navigate to="/teacher/courses" replace />;
  return <Navigate to="/student/courses" replace />;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomeRedirect />} />
        <Route
          path="/teacher/courses"
          element={
            <ProtectedRoute role="Teacher">
              <TeacherCoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/courses/new"
          element={
            <ProtectedRoute role="Teacher">
              <TeacherCourseFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/courses/:id"
          element={
            <ProtectedRoute role="Teacher">
              <TeacherCourseDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/courses/:id/edit"
          element={
            <ProtectedRoute role="Teacher">
              <TeacherCourseFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses"
          element={
            <ProtectedRoute role="Student">
              <StudentCoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses/:id"
          element={
            <ProtectedRoute role="Student">
              <StudentCourseDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/enrolled"
          element={
            <ProtectedRoute role="Student">
              <StudentEnrolledPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}
