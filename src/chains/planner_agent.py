from langgraph.graph import StateGraph, END
from typing import Union
from agents.planner_agent.schema import FreshInput, ResumeInput, PlannerState
from agents.planner_agent.domain_selector import suggest_domains
from agents.planner_agent.resume_parser import extract_domain_from_resume
from agents.planner_agent.roadmap_generator import generate_roadmap

def domain_selector_fresh(state: PlannerState) -> PlannerState:
    result = suggest_domains(
        interests=state.input.interests,
        coding_level=state.input.coding_level,
        description=state.input.self_description
    )
    domain = result.content.split(",")[0].strip().replace("✅", "").strip()
    return state.copy(update={"domain": domain})


def domain_selector_resume(state: PlannerState) -> PlannerState:
    result = extract_domain_from_resume(
        resume=state.input.resume_text,
        traits=state.input.traits
    )
    domain = result.content.split(",")[0].strip().replace("✅", "").strip()
    return state.copy(update={"domain": domain})


def roadmap_creator(state: PlannerState) -> PlannerState:
    duration = state.input.week_plan
    level = getattr(state.input, "coding_level", "intermediate")
    roadmap = generate_roadmap(domain=state.domain, duration=duration, level=level)
    return state.copy(update={"roadmap": roadmap.content})


def is_fresh_input(state: PlannerState) -> str:
    return "fresh" if isinstance(state.input, FreshInput) else "resume"

def start_node(state: PlannerState) -> PlannerState:
    return state

def build_planner_graph():
    graph = StateGraph(PlannerState)

    graph.add_node("start", start_node)
    graph.add_node("select_domain_fresh", domain_selector_fresh)
    graph.add_node("select_domain_resume", domain_selector_resume)
    graph.add_node("generate_roadmap", roadmap_creator)

    graph.set_entry_point("start")

    graph.add_conditional_edges("start", is_fresh_input, {
        "fresh": "select_domain_fresh",
        "resume": "select_domain_resume"
    })

    graph.add_edge("select_domain_fresh", "generate_roadmap")
    graph.add_edge("select_domain_resume", "generate_roadmap")
    graph.add_edge("generate_roadmap", END)

    return graph.compile()
