import React, { useState } from "react";
import {
  Sparkles,
  GraduationCap,
  Code2,
  Briefcase,
  Users2,
  Clock,
  Send,
  AlertCircle
} from "lucide-react";
import type { StudentInput, PredictionResponse } from "../types";
import { predictStudentPlacement } from "../api/client";

interface StudentPredictionProps {
  onPredictionComplete: (result: PredictionResponse) => void;
}

const PRESET_PROFILES: Record<string, StudentInput> = {
  "High Performing Tech Candidate": {
    gender: "Male",
    branch: "CSE",
    college_tier: "Tier 1",
    volunteer_experience: "Yes",
    age: 21,
    cgpa: 8.9,
    internships_count: 3,
    projects_count: 5,
    certifications_count: 4,
    coding_skill_score: 92.0,
    aptitude_score: 88.0,
    communication_skill_score: 85.0,
    logical_reasoning_score: 90.0,
    hackathons_participated: 3,
    github_repos: 10,
    linkedin_connections: 750,
    mock_interview_score: 90.0,
    attendance_percentage: 94.0,
    backlogs: 0,
    extracurricular_score: 75.0,
    leadership_score: 80.0,
    sleep_hours: 7.5,
    study_hours_per_day: 5.0
  },
  "Average Balanced Student": {
    gender: "Female",
    branch: "IT",
    college_tier: "Tier 2",
    volunteer_experience: "No",
    age: 21,
    cgpa: 7.5,
    internships_count: 1,
    projects_count: 3,
    certifications_count: 2,
    coding_skill_score: 70.0,
    aptitude_score: 65.0,
    communication_skill_score: 68.0,
    logical_reasoning_score: 66.0,
    hackathons_participated: 1,
    github_repos: 4,
    linkedin_connections: 450,
    mock_interview_score: 70.0,
    attendance_percentage: 85.0,
    backlogs: 0,
    extracurricular_score: 60.0,
    leadership_score: 55.0,
    sleep_hours: 7.0,
    study_hours_per_day: 3.5
  },
  "At-Risk / Needs Improvement Profile": {
    gender: "Male",
    branch: "Mechanical",
    college_tier: "Tier 3",
    volunteer_experience: "No",
    age: 22,
    cgpa: 5.8,
    internships_count: 0,
    projects_count: 1,
    certifications_count: 0,
    coding_skill_score: 35.0,
    aptitude_score: 42.0,
    communication_skill_score: 45.0,
    logical_reasoning_score: 40.0,
    hackathons_participated: 0,
    github_repos: 1,
    linkedin_connections: 120,
    mock_interview_score: 40.0,
    attendance_percentage: 62.0,
    backlogs: 3,
    extracurricular_score: 30.0,
    leadership_score: 25.0,
    sleep_hours: 5.0,
    study_hours_per_day: 1.5
  },
  "Academic Star (Low Projects)": {
    gender: "Female",
    branch: "ECE",
    college_tier: "Tier 1",
    volunteer_experience: "Yes",
    age: 20,
    cgpa: 9.5,
    internships_count: 0,
    projects_count: 1,
    certifications_count: 1,
    coding_skill_score: 60.0,
    aptitude_score: 85.0,
    communication_skill_score: 75.0,
    logical_reasoning_score: 82.0,
    hackathons_participated: 0,
    github_repos: 2,
    linkedin_connections: 300,
    mock_interview_score: 65.0,
    attendance_percentage: 96.0,
    backlogs: 0,
    extracurricular_score: 50.0,
    leadership_score: 45.0,
    sleep_hours: 8.0,
    study_hours_per_day: 6.0
  }
};

export const StudentPrediction: React.FC<StudentPredictionProps> = ({ onPredictionComplete }) => {
  const [formData, setFormData] = useState<StudentInput>(PRESET_PROFILES["Average Balanced Student"]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof StudentInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyPreset = (presetName: string) => {
    if (PRESET_PROFILES[presetName]) {
      setFormData(PRESET_PROFILES[presetName]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Range validations
    if (formData.cgpa < 0 || formData.cgpa > 10) {
      setError("CGPA must be between 0.0 and 10.0");
      setLoading(false);
      return;
    }
    if (formData.coding_skill_score < 0 || formData.coding_skill_score > 100) {
      setError("Coding skill score must be between 0 and 100");
      setLoading(false);
      return;
    }

    try {
      const response = await predictStudentPlacement(formData);
      onPredictionComplete(response);
    } catch (err: any) {
      setError(err.message || "Failed to generate placement prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <Sparkles size={28} color="var(--accent-primary)" />
          Student Placement Prediction Engine
        </h1>
        <p className="page-subtitle">
          Input complete student academic and technical profile metrics to generate real-time probability & actionable recommendations.
        </p>
      </div>

      {/* Quick Presets Bar */}
      <div className="card" style={{ marginBottom: "1.5rem", padding: "1rem 1.25rem" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
          Load Profile Preset:
        </div>
        <div className="presets-bar" style={{ margin: 0 }}>
          {Object.keys(PRESET_PROFILES).map((preset) => (
            <button
              key={preset}
              type="button"
              className="preset-btn"
              onClick={() => handleApplyPreset(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "rgba(244, 63, 94, 0.15)",
            border: "1px solid rgba(244, 63, 94, 0.4)",
            borderRadius: "var(--radius-md)",
            padding: "1rem",
            color: "var(--accent-rose)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem"
          }}
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Section 1: Academic Profile */}
        <div className="form-section">
          <h2 className="form-section-title">
            <GraduationCap size={20} color="var(--accent-primary)" />
            Academic Profile
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Branch / Department</label>
              <select
                className="form-select"
                value={formData.branch}
                onChange={(e) => handleInputChange("branch", e.target.value)}
              >
                <option value="CSE">CSE (Computer Science)</option>
                <option value="IT">IT (Information Tech)</option>
                <option value="ECE">ECE (Electronics & Comm)</option>
                <option value="EEE">EEE (Electrical & Electronics)</option>
                <option value="Mechanical">Mechanical Engineering</option>
                <option value="Civil">Civil Engineering</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">College Tier</label>
              <select
                className="form-select"
                value={formData.college_tier}
                onChange={(e) => handleInputChange("college_tier", e.target.value)}
              >
                <option value="Tier 1">Tier 1 (Top Institutions / IITs / NITs)</option>
                <option value="Tier 2">Tier 2 (State Top Colleges / Universities)</option>
                <option value="Tier 3">Tier 3 (Affiliated Regional Colleges)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>CGPA (0 - 10.0)</span>
                <span style={{ color: "var(--accent-primary)" }}>{formData.cgpa.toFixed(2)}</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                className="form-input"
                value={formData.cgpa}
                onChange={(e) => handleInputChange("cgpa", parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Active Backlogs</label>
              <input
                type="number"
                min="0"
                max="20"
                className="form-input"
                value={formData.backlogs}
                onChange={(e) => handleInputChange("backlogs", parseInt(e.target.value, 10) || 0)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Attendance (%)</span>
                <span style={{ color: "var(--accent-emerald)" }}>{formData.attendance_percentage.toFixed(0)}%</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                className="form-input"
                value={formData.attendance_percentage}
                onChange={(e) => handleInputChange("attendance_percentage", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Technical Competence */}
        <div className="form-section">
          <h2 className="form-section-title">
            <Code2 size={20} color="var(--accent-cyan)" />
            Technical Competence & Development
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <span>Coding Skill Score (0 - 100)</span>
                <span style={{ color: "var(--accent-cyan)" }}>{formData.coding_skill_score.toFixed(1)}</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                className="form-input"
                value={formData.coding_skill_score}
                onChange={(e) => handleInputChange("coding_skill_score", parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Projects Count</label>
              <input
                type="number"
                min="0"
                max="50"
                className="form-input"
                value={formData.projects_count}
                onChange={(e) => handleInputChange("projects_count", parseInt(e.target.value, 10) || 0)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">GitHub Repositories</label>
              <input
                type="number"
                min="0"
                max="100"
                className="form-input"
                value={formData.github_repos}
                onChange={(e) => handleInputChange("github_repos", parseInt(e.target.value, 10) || 0)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hackathons Participated</label>
              <input
                type="number"
                min="0"
                max="30"
                className="form-input"
                value={formData.hackathons_participated}
                onChange={(e) => handleInputChange("hackathons_participated", parseInt(e.target.value, 10) || 0)}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Career Preparation & Aptitude */}
        <div className="form-section">
          <h2 className="form-section-title">
            <Briefcase size={20} color="var(--accent-amber)" />
            Career Preparation & Assessments
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Internships Completed</label>
              <input
                type="number"
                min="0"
                max="20"
                className="form-input"
                value={formData.internships_count}
                onChange={(e) => handleInputChange("internships_count", parseInt(e.target.value, 10) || 0)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Certifications Count</label>
              <input
                type="number"
                min="0"
                max="30"
                className="form-input"
                value={formData.certifications_count}
                onChange={(e) => handleInputChange("certifications_count", parseInt(e.target.value, 10) || 0)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Aptitude Score (0 - 100)</span>
                <span style={{ color: "var(--accent-amber)" }}>{formData.aptitude_score.toFixed(1)}</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                className="form-input"
                value={formData.aptitude_score}
                onChange={(e) => handleInputChange("aptitude_score", parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Logical Reasoning Score (0 - 100)</span>
                <span style={{ color: "var(--accent-amber)" }}>{formData.logical_reasoning_score.toFixed(1)}</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                className="form-input"
                value={formData.logical_reasoning_score}
                onChange={(e) => handleInputChange("logical_reasoning_score", parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Mock Interview Score (0 - 100)</span>
                <span style={{ color: "var(--accent-amber)" }}>{formData.mock_interview_score.toFixed(1)}</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                className="form-input"
                value={formData.mock_interview_score}
                onChange={(e) => handleInputChange("mock_interview_score", parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">LinkedIn Connections</label>
              <input
                type="number"
                min="0"
                max="10000"
                className="form-input"
                value={formData.linkedin_connections}
                onChange={(e) => handleInputChange("linkedin_connections", parseInt(e.target.value, 10) || 0)}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Communication & Personal Development */}
        <div className="form-section">
          <h2 className="form-section-title">
            <Users2 size={20} color="var(--accent-violet)" />
            Communication & Personal Development
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Volunteer Experience</label>
              <select
                className="form-select"
                value={formData.volunteer_experience}
                onChange={(e) => handleInputChange("volunteer_experience", e.target.value)}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Communication Score (0 - 100)</span>
                <span style={{ color: "var(--accent-violet)" }}>{formData.communication_skill_score.toFixed(1)}</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                className="form-input"
                value={formData.communication_skill_score}
                onChange={(e) => handleInputChange("communication_skill_score", parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Leadership Score (0 - 100)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                className="form-input"
                value={formData.leadership_score}
                onChange={(e) => handleInputChange("leadership_score", parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Extracurricular Score (0 - 100)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                className="form-input"
                value={formData.extracurricular_score}
                onChange={(e) => handleInputChange("extracurricular_score", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        {/* Section 5: Study Routine & Lifestyle */}
        <div className="form-section">
          <h2 className="form-section-title">
            <Clock size={20} color="var(--accent-emerald)" />
            Lifestyle & Study Habits
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                min="16"
                max="35"
                className="form-input"
                value={formData.age}
                onChange={(e) => handleInputChange("age", parseInt(e.target.value, 10) || 21)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Study Hours / Day</span>
                <span style={{ color: "var(--accent-emerald)" }}>{formData.study_hours_per_day.toFixed(1)} hrs</span>
              </label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                className="form-input"
                value={formData.study_hours_per_day}
                onChange={(e) => handleInputChange("study_hours_per_day", parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Sleep Hours / Day</span>
                <span style={{ color: "var(--accent-emerald)" }}>{formData.sleep_hours.toFixed(1)} hrs</span>
              </label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                className="form-input"
                value={formData.sleep_hours}
                onChange={(e) => handleInputChange("sleep_hours", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <>
              <div className="status-dot" style={{ background: "white" }}></div>
              Evaluating Placement Models...
            </>
          ) : (
            <>
              <Send size={18} />
              Generate Placement Intelligence & Prediction
            </>
          )}
        </button>
      </form>
    </div>
  );
};
