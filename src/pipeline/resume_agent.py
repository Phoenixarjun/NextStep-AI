from agents.resume_agent.schema import ResumeAgentInput
from chains.resume_agent import build_resume_graph
from pathlib import Path


def run_resume_agent(user_input: ResumeAgentInput) -> dict:
    graph = build_resume_graph()
    state = {"input": user_input.model_dump()} 
    result = graph.invoke(state)
    return result

if __name__ == "__main__":
    resume_path = Path("Resume.pdf").resolve()
    if not resume_path.exists():
        raise FileNotFoundError(f"Resume file not found at {resume_path}")
    
    sample_input = ResumeAgentInput(
        job_type="Full Time",
        domain="Machine Learning",
        job_description ="Built a face detection model using OpenCV and trained it on custom dataset.",
        resume_text=str(resume_path)
    )

    output = run_resume_agent(sample_input)
    print("📄 Suggestions:\n", output["suggestions"])
