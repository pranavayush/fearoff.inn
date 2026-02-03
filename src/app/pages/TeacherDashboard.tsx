import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Upload, FileText, Trash2 } from "lucide-react";
import { DashboardHeader } from "@/app/components/DashboardHeader";

interface QuestionPaper {
  id: string;
  title: string;
  subject: string;
  fileName: string;
  fileData: string;
  uploadedBy: string;
  uploadDate: string;
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check authentication
    const userType = localStorage.getItem("userType");
    const storedUsername = localStorage.getItem("username");
    
    if (userType !== "teacher" || !storedUsername) {
      navigate("/teacher-login");
      return;
    }
    
    setUsername(storedUsername);
    loadQuestionPapers();
  }, [navigate]);

  const loadQuestionPapers = () => {
    const stored = localStorage.getItem("questionPapers");
    if (stored) {
      setQuestionPapers(JSON.parse(stored));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(selectedFile.type)) {
        setMessage("Please upload only PDF or Word documents");
        setFile(null);
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setMessage("File size should not exceed 5MB");
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setMessage("");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!title || !subject || !file) {
      setMessage("Please fill all fields and select a file");
      return;
    }

    setUploading(true);

    try {
      // Convert file to base64 for localStorage
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target?.result as string;
        
        const newPaper: QuestionPaper = {
          id: Date.now().toString(),
          title,
          subject,
          fileName: file.name,
          fileData,
          uploadedBy: username,
          uploadDate: new Date().toLocaleDateString(),
        };

        const updatedPapers = [...questionPapers, newPaper];
        setQuestionPapers(updatedPapers);
        localStorage.setItem("questionPapers", JSON.stringify(updatedPapers));

        setMessage("Question paper uploaded successfully!");
        setTitle("");
        setSubject("");
        setFile(null);
        setUploading(false);
        
        // Reset file input
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      setMessage("Error uploading file. Please try again.");
      setUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    const updatedPapers = questionPapers.filter(paper => paper.id !== id);
    setQuestionPapers(updatedPapers);
    localStorage.setItem("questionPapers", JSON.stringify(updatedPapers));
    setMessage("Question paper deleted successfully");
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 animate-gradient">
      <DashboardHeader 
        title="Teacher Dashboard" 
        username={username} 
        onLogout={handleLogout} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
        {/* Upload Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-8 card-hover animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-xl shadow-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl text-gray-800">Upload Question Paper</h2>
          </div>

          <form onSubmit={handleUpload} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-gray-700">
                  Question Paper Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  placeholder="e.g., Mid-Term Exam 2026"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  placeholder="e.g., Mathematics"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="file-upload" className="block text-gray-700">
                Upload File (PDF or Word, max 5MB)
              </label>
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600 flex items-center gap-2 animate-fade-in">
                  <FileText className="w-4 h-4 text-green-500" />
                  Selected: {file.name}
                </p>
              )}
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-sm animate-fade-in border ${
                message.includes("success") ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-600 border-red-200"
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="btn-hover w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Question Paper
                </>
              )}
            </button>
          </form>
        </div>

        {/* Uploaded Papers List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 animate-scale-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-xl shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl text-gray-800">Uploaded Question Papers</h2>
          </div>

          {questionPapers.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600">No question papers uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questionPapers.map((paper, index) => (
                <div
                  key={paper.id}
                  className={`flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 stagger-item shadow-sm hover:shadow-md`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-800 truncate">{paper.title}</h3>
                    <p className="text-sm text-gray-600">
                      Subject: {paper.subject} | Uploaded by: {paper.uploadedBy} | Date: {paper.uploadDate}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{paper.fileName}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(paper.id)}
                    className="flex items-center gap-2 bg-red-500 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-red-600 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}