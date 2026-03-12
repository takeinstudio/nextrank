import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import StudentLogin from "./pages/StudentLogin";
import StudentRegister from "./pages/StudentRegister";
import AdminLogin from "./pages/AdminLogin";
import StudentLayout from "./components/StudentLayout";
import StudentHome from "./pages/student/StudentHome";
import StudentQuestionBanks from "./pages/student/StudentQuestionBanks";
import StudentResources from "./pages/student/StudentResources";
import StudentTests from "./pages/student/StudentTests";
import StudentProfile from "./pages/student/StudentProfile";
import StudentResults from "./pages/student/StudentResults";
import StudentFaculty from "./pages/student/StudentFaculty";
import StudentYouTube from "./pages/student/StudentYouTube";
import StudentInstagram from "./pages/student/StudentInstagram";
import ExamPage from "./pages/student/ExamPage";
import AdminLayout from "./components/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import AdminQuestionBanks from "./pages/admin/AdminQuestionBanks";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminNotes from "./pages/admin/AdminNotes";
import AdminTests from "./pages/admin/AdminTests";
import AdminResults from "./pages/admin/AdminResults";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/student-register" element={<StudentRegister />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/student/exam/:testId" element={<ExamPage />} />
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentHome />} />
            <Route path="faculty" element={<StudentFaculty />} />
            <Route path="resources" element={<StudentResources />} />
            <Route path="question-banks" element={<StudentQuestionBanks />} />
            <Route path="tests" element={<StudentTests />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="youtube" element={<StudentYouTube />} />
            <Route path="instagram" element={<StudentInstagram />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="notes" element={<AdminNotes />} />
            <Route path="question-banks" element={<AdminQuestionBanks />} />
            <Route path="tests" element={<AdminTests />} />
            <Route path="results" element={<AdminResults />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
