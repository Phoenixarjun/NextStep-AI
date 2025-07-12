from agents.resume_agent.schema import ResumeAgentInput
from chains.resume_agent import build_resume_graph
from pathlib import Path
import logging

def run_resume_agent(user_input: ResumeAgentInput) -> dict:
    graph = build_resume_graph()
    state = {"input": user_input.model_dump()} 
    result = graph.invoke(state)
    return result

if __name__ == "__main__":
    STAGE_NAME = "resume_agent"
    logging.basicConfig(level=logging.INFO)
    logging.info(f"Running {STAGE_NAME}...")
    resume_path = Path("Resume.pdf").resolve()
    if not resume_path.exists():
        raise FileNotFoundError(f"Resume file not found at {resume_path}")
    
    sample_input = ResumeAgentInput(
        job_type="Full Time",
        domain="Machine Learning",
        job_description ="Built a face detection model using OpenCV and trained it on custom dataset.",
        company_name="Tech Innovations Inc.",
        company_description="A leading tech company specializing in AI solutions.",
        role_applying_for="Machine Learning Engineer",
        resume_text=str(resume_path)
    )

    output = run_resume_agent(sample_input)
    logging.info(f"Output from {STAGE_NAME}: {output}")
    print("📄 Suggestions:\n", output["suggestions"])
    print("✅ Resume analysis complete.")