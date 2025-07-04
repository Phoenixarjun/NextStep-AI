from src.chains.planner_agent import build_planner_graph
from agents.planner_agent.schema import FreshInput, ResumeInput, PlannerState

planner_graph = build_planner_graph()

state = PlannerState(input=FreshInput(
    coding_level="basic",
    interests=["design", "creativity"],
    self_description="I enjoy building visual things and experimenting with UI ideas.",
    week_plan=6
))

result = planner_graph.invoke(state)
print("🧭 Domain:", result["domain"])
print("📈 Roadmap:\n", result["roadmap"])
