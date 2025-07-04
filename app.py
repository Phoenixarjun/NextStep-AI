from agents.resume_agent.schema import ResumeAgentInput
from src.chains.resume_agent import build_resume_graph

def run_resume_agent(user_input: ResumeAgentInput) -> dict:
    graph = build_resume_graph()
    state = {"input": user_input.model_dump()} 
    result = graph.invoke(state)
    return result

if __name__ == "__main__":
    sample_input = ResumeAgentInput(
        job_type="Full Time",
        domain="Machine Learning",
        project_description="Built a face detection model using OpenCV and trained it on custom dataset.",
        resume_text="Resume.pdf"
    )

    output = run_resume_agent(sample_input)
    print("📄 Suggestions:\n", output["suggestions"])
