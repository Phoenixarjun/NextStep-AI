from langgraph.graph import StateGraph, END
from agents.resume_agent.schema import ResumeAgentState, ResumeAgentInput
from agents.resume_agent.load_resume import load_resume
from agents.resume_agent.resume_suggestions import generate_resume_suggestions

def start_node(state: ResumeAgentState) -> ResumeAgentState:
    return state

def load_and_process_resume(state: ResumeAgentState) -> ResumeAgentState:
    resume_text = load_resume(state.input.resume_text)  
    updated_input = state.input.copy(update={"resume_text": resume_text})
    return state.copy(update={"input": updated_input})

def suggest_improvements(state: ResumeAgentState) -> ResumeAgentState:
    suggestions = generate_resume_suggestions(state.input)
    return state.copy(update={"suggestions": suggestions})

def build_resume_graph():
    graph = StateGraph(ResumeAgentState)

    graph.add_node("start", start_node)
    graph.add_node("load_resume", load_and_process_resume)
    graph.add_node("suggest", suggest_improvements)

    graph.set_entry_point("start")
    graph.add_edge("start", "load_resume")
    graph.add_edge("load_resume", "suggest")
    graph.add_edge("suggest", END)

    return graph.compile()
