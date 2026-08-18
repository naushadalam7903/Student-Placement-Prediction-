from typing import Dict, List, Any

def generate_student_recommendations(
    student_profile: Dict[str, Any],
    top_factors: List[Dict[str, Any]],
    prediction: str,
    probability: float
) -> Dict[str, Any]:
    """
    Generates tailored, profile-specific analytical suggestions based on student inputs
    and model feature importance.
    """
    recs = {
        "technical_development": [],
        "academic_preparation": [],
        "career_preparation": [],
        "personal_development": []
    }
    
    strengths = []
    priority_improvements = []

    # 1. Technical Development Rules
    coding = float(student_profile.get("coding_skill_score", 0))
    projects = int(student_profile.get("projects_count", 0))
    hackathons = int(student_profile.get("hackathons_participated", 0))
    repos = int(student_profile.get("github_repos", 0))

    if coding < 65:
        recs["technical_development"].append({
            "area": "Coding & Problem Solving",
            "suggestion": f"Your coding score ({coding:.1f}/100) is below competitive placement benchmarks. Focus on daily Data Structures & Algorithms practice (LeetCode / Codeforces / HackerRank).",
            "impact": "High"
        })
        priority_improvements.append("Coding Skill Score")
    else:
        strengths.append(f"Strong coding skill score ({coding:.1f}/100)")

    if projects < 3:
        recs["technical_development"].append({
            "area": "Project Portfolio",
            "suggestion": f"You have {projects} completed project(s). Build at least 2 full-stack or domain-specific production projects with live deployments and CI/CD pipelines.",
            "impact": "High"
        })
        priority_improvements.append("Portfolio Projects")
    else:
        strengths.append(f"Solid project portfolio ({projects} projects)")

    if hackathons == 0:
        recs["technical_development"].append({
            "area": "Hackathons & Competitive Coding",
            "suggestion": "Participate in college/national hackathons to demonstrate teamwork, rapid prototyping, and high-pressure problem solving.",
            "impact": "Medium"
        })

    if repos < 4:
        recs["technical_development"].append({
            "area": "GitHub & Open Source",
            "suggestion": f"With {repos} GitHub repo(s), enhance your public code visibility. Maintain clean READMEs, open-source commits, and documentation.",
            "impact": "Medium"
        })

    # 2. Academic Preparation Rules
    cgpa = float(student_profile.get("cgpa", 0))
    backlogs = int(student_profile.get("backlogs", 0))
    aptitude = float(student_profile.get("aptitude_score", 0))
    logical = float(student_profile.get("logical_reasoning_score", 0))
    attendance = float(student_profile.get("attendance_percentage", 0))

    if backlogs > 0:
        recs["academic_preparation"].append({
            "area": "Backlog Clearance",
            "suggestion": f"You currently have {backlogs} active backlog(s). Many premium campus recruiters filter for 0 active backlogs. Prioritize clearing remaining subjects.",
            "impact": "Critical"
        })
        priority_improvements.append("Clear Active Backlogs")
    else:
        strengths.append("Zero active backlogs")

    if cgpa < 7.5:
        recs["academic_preparation"].append({
            "area": "Academic Performance (CGPA)",
            "suggestion": f"Current CGPA is {cgpa:.2f}. Aim to maintain >= 7.5 to 8.0 CGPA to meet eligibility cut-offs for Tier-1 companies.",
            "impact": "High"
        })
    else:
        strengths.append(f"Competitive CGPA ({cgpa:.2f})")

    if aptitude < 65:
        recs["academic_preparation"].append({
            "area": "Quantitative Aptitude",
            "suggestion": f"Aptitude score is {aptitude:.1f}/100. Practice speed mathematics, probability, time-and-work, and data interpretation round assessments.",
            "impact": "Medium"
        })
        priority_improvements.append("Quantitative Aptitude")

    if logical < 65:
        recs["academic_preparation"].append({
            "area": "Logical Reasoning",
            "suggestion": f"Logical reasoning score is {logical:.1f}/100. Solve analytical puzzles, series, syllogisms, and coding test pre-screens.",
            "impact": "Medium"
        })

    # 3. Career Preparation Rules
    internships = int(student_profile.get("internships_count", 0))
    mock_interview = float(student_profile.get("mock_interview_score", 0))
    communication = float(student_profile.get("communication_skill_score", 0))
    certifications = int(student_profile.get("certifications_count", 0))

    if internships == 0:
        recs["career_preparation"].append({
            "area": "Industry Internships",
            "suggestion": "Completing at least 1-2 verified industry internships or research fellowships significantly boosts placement selection odds.",
            "impact": "High"
        })
        priority_improvements.append("Industry Internship Experience")
    else:
        strengths.append(f"{internships} internship(s) completed")

    if mock_interview < 70:
        recs["career_preparation"].append({
            "area": "Technical & Behavioral Mock Interviews",
            "suggestion": f"Mock interview score is {mock_interview:.1f}/100. Conduct peer mock interviews, practice the STAR method for behavioral rounds, and explain code out loud.",
            "impact": "High"
        })
        priority_improvements.append("Mock Interview Preparation")
    else:
        strengths.append(f"Strong mock interview score ({mock_interview:.1f}/100)")

    if communication < 65:
        recs["career_preparation"].append({
            "area": "Professional Communication",
            "suggestion": f"Communication score is {communication:.1f}/100. Join public speaking sessions, group discussions, and technical presentation workshops.",
            "impact": "Medium"
        })

    # 4. Personal Development & Balance
    leadership = float(student_profile.get("leadership_score", 0))
    extracurricular = float(student_profile.get("extracurricular_score", 0))
    study_hours = float(student_profile.get("study_hours_per_day", 0))
    sleep_hours = float(student_profile.get("sleep_hours", 0))

    if leadership < 50:
        recs["personal_development"].append({
            "area": "Leadership & Initiative",
            "suggestion": "Take up coordinator roles in college clubs, student chapters (IEEE/ACM/GDG), or tech fests to develop team leadership.",
            "impact": "Low"
        })

    if sleep_hours < 6.0:
        recs["personal_development"].append({
            "area": "Health & Routine",
            "suggestion": f"Logged {sleep_hours:.1f} hours of sleep. Consistent rest (7-8 hours) optimizes cognitive agility during intensive campus placement drives.",
            "impact": "Low"
        })

    # Summary action plan
    return {
        "disclaimer": "Analytical suggestions based on historical statistical models and profile attributes. These recommendations do not guarantee placement outcomes.",
        "key_strengths": strengths[:4],
        "priority_focus_areas": priority_improvements[:3],
        "category_recommendations": recs
    }
