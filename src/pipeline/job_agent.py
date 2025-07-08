import json
from pathlib import Path
from chains.job_agent import build_job_graph
from agents.job_agent.schema import JobAgentInput

def run_job_agent(user_input: JobAgentInput) -> dict:
    graph = build_job_graph()
    state = {"input": user_input.model_dump()}
    return graph.invoke(state)

if __name__ == "__main__":
    job_type = input("Enter the job type (e.g. Software Engineer, Data Analyst): ").strip()
    city = input("Enter your city: ").strip()
    mode = input("Preferred job mode (remote/hybrid/onsite): ").strip().lower()

    resume_path = Path("Resume.pdf").resolve()
    if not resume_path.exists():
        raise FileNotFoundError(f"❌ Resume file not found at {resume_path}")

    user_input = JobAgentInput(
        job_type=job_type,
        city=city,
        mode=mode,
        resume_path=str(resume_path)
    )

    output = run_job_agent(user_input)

    if "results" not in output:
        raise ValueError("❌ 'results' key missing in job agent output.")

    results = output["results"]

    print(f"\n📊 Top {len(results)} Job Matches (sorted by fit score):\n")
    for idx, result in enumerate(results, 1):
        print(f"{idx}. 🏢 {result['company']} — {result['job_title']} ({result['fit_score']}% fit)")
        print(f"   📍 {result['location']}")
        print(f"   🔗 Apply: {result['job_url']}")
        print(f"   💡 Fit Message: {', '.join(result.get('reasons', []))}")
        print(f"   🔧 Improve: {', '.join(result.get('improvements', []))}")
        print(f"   📌 Tips: {', '.join(result.get('interview_tips', []))}")
        print(f"   🧠 Insights: {result['company_insights']}")
        print("-" * 80)

    print("\n✅ Done! Explore more opportunities or optimize your resume using the Resume Agent.\n")
