from langgraph.graph import StateGraph, END
from agents.interview_agent.schema import CandidateState, InterviewerState
from agents.interview_agent.candidate_response import generate_candidate_response
from agents.interview_agent.interviewer_response import generate_interviewer_response
from agents.load_resume import load_resume


def start_node(state):
    return state


def load_and_attach_resume(state):
    resume_path = state.input.resume_text
    parsed_resume = load_resume(resume_path)
    updated_input = state.input.copy(update={"resume_text": parsed_resume})
    return state.copy(update={"input": updated_input})


def run_interviewer(state: InterviewerState) -> InterviewerState:
    result = generate_interviewer_response(state.input)
    return state.copy(update={"questions": result})


def run_candidate(state: CandidateState) -> CandidateState:
    result = generate_candidate_response(state.input)
    return state.copy(update={"recommendations": result["recommendations"], "mock_questions": result["mock_questions"]})


def build_interview_graph():
    # ▶️ Interviewer Graph
    interviewer_graph = StateGraph(InterviewerState)
    interviewer_graph.add_node("start", start_node)
    interviewer_graph.add_node("load_resume", load_and_attach_resume)
    interviewer_graph.add_node("generate", run_interviewer)
    interviewer_graph.set_entry_point("start")
    interviewer_graph.add_edge("start", "load_resume")
    interviewer_graph.add_edge("load_resume", "generate")
    interviewer_graph.add_edge("generate", END)

    # 👤 Candidate Graph
    candidate_graph = StateGraph(CandidateState)
    candidate_graph.add_node("start", start_node)
    candidate_graph.add_node("load_resume", load_and_attach_resume)
    candidate_graph.add_node("recommend", run_candidate)
    candidate_graph.set_entry_point("start")
    candidate_graph.add_edge("start", "load_resume")
    candidate_graph.add_edge("load_resume", "recommend")
    candidate_graph.add_edge("recommend", END)

    return {
        "interviewer_graph": interviewer_graph.compile(),
        "candidate_graph": candidate_graph.compile()
    }
