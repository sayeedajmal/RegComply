import pdfplumber
from openai import OpenAI
import json
import os
from dotenv import load_dotenv
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

# Function to process the circular document and extract relevant information
def process_circular(filepath):
    text = extract_text_from_pdf(filepath)
    extracted_data = parse_with_gpt4(text)

    if extracted_data:
        parsed_data = extracted_data
    else:
        parsed_data = {}

    return {
        "regulator_name": parsed_data.get("regulator_name", ""),
        "circular_number": parsed_data.get("circular_number", ""),
        "method_of_communication": parsed_data.get("method_of_communication", ""),
        "business_process_status": parsed_data.get("business_process_status", ""),
        "affected_business_process": parsed_data.get("affected_business_process", ""),
        "ai_summary": parsed_data.get("ai_summary", ""),
        "common_tags": parsed_data.get("common_tags", ""),
        "Issued": parsed_data.get("Issued", ""),
        "Due": parsed_data.get("Due", ""),
        "Title": parsed_data.get("Title", ""),
        "clauses": parsed_data.get("clauses", [])
    }

# Function to extract text from the PDF
def extract_text_from_pdf(filepath):
    with pdfplumber.open(filepath) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
    return text


# Function to interact with GPT-4 and parse the text
def parse_with_gpt4(text):
    messages = [
        {"role": "system", "content": "You are an assistant that extracts specific information from regulatory documents."},
        {"role": "user", "content": f"""
        I have a regulatory circular document. Please extract the following information from the document:

        1. Regulator Name (e.g., SEBI, RBI, etc. short form)
        2. Circular Number (e.g., SEBI/HO/MRD/TPD/P/CIR/2024/167, SEBI/LAD-NRO/GN/2024/167 etc. if not found, generate in this context)
        3. Method of Communication (e.g., Letter, Circular, Email, etc.)
        4. Business Process Compliance Status (e.g., Compliant, Non-compliant, Action Required)
        5. Affected Business Process (e.g., AMC, Compliance, RM, etc. short form)
        6. ai_summary of this circular with date and important details
        7. Common single tag (do not add any type of list)
        8. Issued On (else return not found)
        9. Due On (else return not found)
        10. Title of this Circular
        11. Clauses: Extract the Clause content, actionable, and departments responsible for each clause in the circular.

        Document:
        {text}

        Please return the extracted information as a JSON with the fields:
        - "regulator_name"
        - "circular_number"
        - "method_of_communication"
        - "business_process_status"
        - "affected_business_process"
        - "ai_summary"
        - "common_tags"
        - "Issued"
        - "Due"
        - "Title"
        - "clauses" (A list of dictionaries with "content", "actionable", and "departments" for each clause)
        """},
    ]

    try:
        response = client.chat.completions.create(
            model="gpt-4o",  # Correct the model name
            messages=messages  # type: ignore
        )

        # Log the raw response for debugging
        print("GPT-4 Raw Response:", response.choices[0].message.content)

        # Extract only the JSON part from the response string
        # type: ignore
        content = response.choices[0].message.content.strip()  # type: ignore

        # Locate the start and end of the JSON part
        json_start = content.find('{')
        json_end = content.rfind('}') + 1

        # Extract the JSON part if it's valid
        if json_start != -1 and json_end != -1:
            json_data = content[json_start:json_end]
            extracted_data = json.loads(json_data)  # Parse the JSON

            return extracted_data
        else:
            print("Error: No JSON part found in the response")
            return None

    except Exception as e:
        print(f"Error during GPT-4 interaction: {e}")
        return None
