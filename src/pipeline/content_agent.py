from agents.content_agent.schema import ContentInput, GitHubInput
from chains.content_agent import build_content_graph
import logging

def run_content_agent(user_input: ContentInput) -> dict:
    graph = build_content_graph()
    return graph.invoke({"input": user_input})




if __name__ == "__main__":
    STAGE_NAME = "content_agent"
    logging.basicConfig(level=logging.INFO)
    logging.info(f"Running {STAGE_NAME}...")
    sample_input = ContentInput(
        category="github",
        github=GitHubInput( 
            github_url="https://github.com/Phoenixarjun/EduPath",
            description="A comprehensive platform for personalized learning paths.",
            tech_stack=["Python", "Gemini", "chainlit"],
            tone="technical"
        )
    )
    output = run_content_agent(sample_input)
    logging.info(f"Output from {STAGE_NAME}: {output}")
    print("✅ GitHub README Output:\n", output["output"].generated_text)
    logging.info("Content agent run complete.")