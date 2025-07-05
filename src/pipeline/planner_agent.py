from src.chains.planner_agent import build_planner_graph
from agents.planner_agent.schema import FreshInput, ResumeInput, PlannerState


def run_planner_agent(user_input: FreshInput | ResumeInput) -> dict:
    graph = build_planner_graph()
    state = PlannerState(input=user_input)
    result = graph.invoke(state)
    return result


if __name__ == "__main__":
    sample_input = FreshInput(
        coding_level="basic",
        interests=["design", "creativity"],
        self_description="I enjoy building visual things and experimenting with UI ideas.",
        week_plan=6
    )

    output = run_planner_agent(sample_input)
    print("🧭 Domain:", output["domain"])
    print("📈 Roadmap:\n", output["roadmap"])
