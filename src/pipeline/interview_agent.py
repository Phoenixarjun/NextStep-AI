import json
import re
from pathlib import Path
from agents.interview_agent.schema import CandidateInput, InterviewerInput
from chains.interview_agent import build_interview_graph
import logging


def run_candidate_agent(user_input: CandidateInput) -> dict:
    graph = build_interview_graph()["candidate_graph"]
    state = {"input": user_input.model_dump()}
    return graph.invoke(state)

def run_interviewer_agent(user_input: InterviewerInput) -> dict:
    graph = build_interview_graph()["interviewer_graph"]
    state = {"input": user_input.model_dump()}
    return graph.invoke(state)

def extract_json_from_response(response_str: str) -> str:
    """Remove triple-backtick markdown if present from LLM response."""
    cleaned = re.sub(r"^```json\s*|\s*```$", "", response_str.strip(), flags=re.DOTALL)
    return cleaned

if __name__ == "__main__":
    STAGE_NAME = "interview_agent"
    logging.basicConfig(level=logging.INFO)
    logging.info(f"Running {STAGE_NAME}...")
    role = input("Are you an 'interviewer' or 'candidate'? ").strip().lower()

    resume_path = Path("Resume.pdf").resolve()
    if not resume_path.exists():
        raise FileNotFoundError(f"Resume file not found at {resume_path}")

    if role == "candidate":
        sample_input = CandidateInput(
            job_type="Internship",
            domain="Frontend Development",
            job_description="Build modern UI interfaces using React, Tailwind, and Typescript.",
            company_name="Pixelytics Inc.",
            company_description="A startup crafting delightful user interfaces for SaaS platforms.",
            role_applying_for="Frontend Developer Intern",
            coding_level="intermediate",
            duration_until_interview="7",
            resume_text=str(resume_path)
        )

        output = run_candidate_agent(sample_input)
        logging.info(f"Output from {STAGE_NAME}: {output}")

        if "response" not in output:
            raise ValueError("Response key missing in state output.")

        raw_response = output["response"]
        if not raw_response or not isinstance(raw_response, str):
            raise ValueError("Candidate agent returned empty or invalid response.")

        try:
            cleaned_json_str = extract_json_from_response(raw_response)
            response_data = json.loads(cleaned_json_str)
        except json.JSONDecodeError as e:
            print("❌ Failed to parse cleaned response:\n", cleaned_json_str)
            raise e

        print("📦 Recommendations:\n", json.dumps(response_data["recommendations"], indent=2))

        print("\n🎯 Mock Questions:\n")
        for idx, q in enumerate(response_data["mock_questions"], 1):
            print(f"{idx}. {q['question']}")
            for opt in q["options"]:
                print(f"   - {opt}")
            print(f"   ✅ Answer: {q['answer']}\n")

    elif role == "interviewer":
        sample_input = InterviewerInput(
            resume_text=str(resume_path),
            job_role="Backend Developer"
        )

        output = run_interviewer_agent(sample_input)

        if "questions" not in output:
            raise ValueError("Questions key missing in interviewer output.")

        print("🧑‍💼 Interview Questions:\n")
        print(json.dumps(output["questions"], indent=2))

    else:
        print("❌ Invalid role. Please enter 'interviewer' or 'candidate'.")

    logging.info("Interview agent run complete.")
