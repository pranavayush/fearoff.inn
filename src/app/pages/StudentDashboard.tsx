import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Download, Upload, FileText, CheckCircle } from "lucide-react";
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

interface AnswerSheet {
  id: string;
  questionPaperId: string;
  questionPaperTitle: string;
  fileName: string;
  fileData: string;
  submittedBy: string;
  submissionDate: string;
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
  const [answerSheets, setAnswerSheets] = useState<AnswerSheet[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check authentication
    const userType = localStorage.getItem("userType");
    const storedUsername = localStorage.getItem("username");
    
    if (userType !== "student" || !storedUsername) {
      navigate("/student-login");
      return;
    }
    
    setUsername(storedUsername);
    loadQuestionPapers();
    loadAnswerSheets();
  }, [navigate]);

  const loadQuestionPapers = () => {
    const stored = localStorage.getItem("questionPapers");
    if (stored) {
      setQuestionPapers(JSON.parse(stored));
    }
  };

  const loadAnswerSheets = () => {
    const stored = localStorage.getItem("answerSheets");
    if (stored) {
      setAnswerSheets(JSON.parse(stored));
    }
  };

  const handleDownload = (paper: QuestionPaper) => {
    // Convert base64 to blob and download
    const link = document.createElement("a");
    link.href = paper.fileData;
    link.download = paper.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMessage(`Downloaded: ${paper.title}`);
    setTimeout(() => setMessage(""), 3000);
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

  const handleUploadAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!selectedPaper || !file) {
      setMessage("Please select a question paper and upload your answer sheet");
      return;
    }

    // Check if already submitted
    const alreadySubmitted = answerSheets.some(
      sheet => sheet.questionPaperId === selectedPaper && sheet.submittedBy === username
    );

    if (alreadySubmitted) {
      setMessage("You have already submitted an answer sheet for this question paper");
      return;
    }

    setUploading(true);

    try {
      // Convert file to base64 for localStorage
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target?.result as string;
        
        const paper = questionPapers.find(p => p.id === selectedPaper);
        
        const newAnswer: AnswerSheet = {
          id: Date.now().toString(),
          questionPaperId: selectedPaper,
          questionPaperTitle: paper?.title || "",
          fileName: file.name,
          fileData,
          submittedBy: username,
          submissionDate: new Date().toLocaleDateString(),
        };

        const updatedAnswers = [...answerSheets, newAnswer];
        setAnswerSheets(updatedAnswers);
        localStorage.setItem("answerSheets", JSON.stringify(updatedAnswers));

        setMessage("Answer sheet uploaded successfully!");
        setSelectedPaper("");
        setFile(null);
        setUploading(false);
        
        // Reset file input
        const fileInput = document.getElementById("answer-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      setMessage("Error uploading file. Please try again.");
      setUploading(false);
    }
  };

  const isSubmitted = (paperId: string) => {
    return answerSheets.some(
      sheet => sheet.questionPaperId === paperId && sheet.submittedBy === username
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 animate-gradient">
      <DashboardHeader 
        title="Student Dashboard" 
        username={username} 
        onLogout={handleLogout} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 page-transition">
        {/* Question Papers Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-3 rounded-xl shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl text-gray-800">Available Question Papers</h2>
          </div>

          {questionPapers.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600">No question papers available yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questionPapers.map((paper, index) => (
                <div
                  key={paper.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 gap-3 transition-all duration-300 stagger-item shadow-sm hover:shadow-md`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                      <h3 className="text-gray-800">{paper.title}</h3>
                      {isSubmitted(paper.id) && (
                        <span className="flex items-center gap-1 bg-green-100 text-green-600 px-2 py-1 rounded text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Submitted
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Subject: {paper.subject} | Uploaded by: {paper.uploadedBy} | Date: {paper.uploadDate}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{paper.fileName}</p>
                  </div>
                  <button
                    onClick={() => handleDownload(paper)}
                    className="btn-hover flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-3 sm:px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 w-full sm:w-auto justify-center shrink-0 shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Answer Sheet Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 card-hover animate-scale-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-3 rounded-xl shadow-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl text-gray-800">Submit Answer Sheet</h2>
          </div>

          <form onSubmit={handleUploadAnswer} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="question-paper" className="block text-gray-700">
                Select Question Paper
              </label>
              <select
                id="question-paper"
                value={selectedPaper}
                onChange={(e) => setSelectedPaper(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="">-- Select Question Paper --</option>
                {questionPapers.map((paper) => (
                  <option key={paper.id} value={paper.id} disabled={isSubmitted(paper.id)}>
                    {paper.title} - {paper.subject} {isSubmitted(paper.id) ? "(Already Submitted)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="answer-upload" className="block text-gray-700">
                Upload Answer Sheet (PDF or Word, max 5MB)
              </label>
              <input
                type="file"
                id="answer-upload"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600 flex items-center gap-2 animate-fade-in">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Selected: {file.name}
                </p>
              )}
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-sm animate-fade-in border ${
                message.includes("success") || message.includes("Downloaded") ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-600 border-red-200"
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="btn-hover w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Submit Answer Sheet
                </>
              )}
            </button>
          </form>
        </div>

        {/* My Submissions Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-3 rounded-xl shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl text-gray-800">My Submissions</h2>
          </div>

          {answerSheets.filter(sheet => sheet.submittedBy === username).length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600">No submissions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {answerSheets
                .filter(sheet => sheet.submittedBy === username)
                .map((sheet, index) => (
                  <div
                    key={sheet.id}
                    className="p-5 border border-gray-200 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 stagger-item shadow-sm"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-green-500 p-2 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-800">{sheet.questionPaperTitle}</h3>
                        <p className="text-sm text-gray-600">
                          Submitted on: {sheet.submissionDate}
                        </p>
                        <p className="text-sm text-gray-500">{sheet.fileName}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}