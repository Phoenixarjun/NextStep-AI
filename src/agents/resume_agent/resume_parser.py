import re
import spacy

nlp = spacy.load("en_core_web_sm")

def basic_resume_parser(text: str) -> dict:
    doc = nlp(text)
    email = re.search(r'\S+@\S+', text)
    phone = re.search(r'\+?\d[\d\- ]{8,}\d', text)
    return {
        "email": email.group() if email else None,
        "phone": phone.group() if phone else None,
        "entities": [(ent.label_, ent.text) for ent in doc.ents],
    }
