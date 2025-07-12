from chains.planner_agent import build_planner_graph
from agents.planner_agent.schema import FreshInput, ResumeInput, PlannerState
import logging

def run_planner_agent(user_input: FreshInput | ResumeInput) -> dict:
    graph = build_planner_graph()
    state = PlannerState(input=user_input)
    result = graph.invoke(state)
    return result


if __name__ == "__main__":
    STAGE_NAME = "planner_agent" 
    logging.basicConfig(level=logging.INFO)
    logging.info(f"Running {STAGE_NAME}...")
    sample_input = FreshInput(
        coding_level="basic",
        interests=["design", "creativity"],
        self_description="I enjoy building visual things and experimenting with UI ideas.",
        week_plan=6
    )

    output = run_planner_agent(sample_input)
    logging.info(f"Output from {STAGE_NAME}: {output}")
    
    print("🧭 Domain:", output["domain"])
    print("📈 Roadmap:\n", output["roadmap"])
    logging.info("Planner agent run complete.")
