from langgraph.graph import StateGraph, END
from agents.interview_agent.schema import CandidateState, InterviewerState
from agents.interview_agent.candidate_response import generate_candidate_response
from agents.interview_agent.interviewer_response import generate_interviewer_response

# ⬥ Shared start node
def start_node(state):
    return state

# ⬥ Detect if it's an interviewer or candidate based on input class
def is_interviewer(state) -> bool:
    return isinstance(state, InterviewerState)

# ⬥ Generate interviewer questions
def run_interviewer(state: InterviewerState) -> InterviewerState:
    result = generate_interviewer_response(state.input)
    return state.copy(update={"questions": result})

# ⬥ Generate candidate prep & mock interview
def run_candidate(state: CandidateState) -> CandidateState:
    result = generate_candidate_response(state.input)
    
    return CandidateState(input=state.input, response=result)


def build_interview_graph():
    # Build separate graphs for both flows
    interviewer_graph = StateGraph(InterviewerState)
    interviewer_graph.add_node("start", start_node)
    interviewer_graph.add_node("generate", run_interviewer)
    interviewer_graph.set_entry_point("start")
    interviewer_graph.add_edge("start", "generate")
    interviewer_graph.add_edge("generate", END)

    candidate_graph = StateGraph(CandidateState)
    candidate_graph.add_node("start", start_node)
    candidate_graph.add_node("recommend", run_candidate)
    candidate_graph.set_entry_point("start")
    candidate_graph.add_edge("start", "recommend")
    candidate_graph.add_edge("recommend", END)

    return {
        "interviewer_graph": interviewer_graph.compile(),
        "candidate_graph": candidate_graph.compile()
    }
