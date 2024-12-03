import pdfplumber
from openai import OpenAI
import json
import os
from dotenv import load_dotenv

# Initialize OpenAI client
client = OpenAI()

# Function to process the circular document and extract relevant information
def process_circular(filepath):
    text = extract_text_from_pdf(filepath)
    extracted_data = parse_with_gpt4(text)  # This should already be a dict

    # No need to call json.loads on extracted_data since it's already a dictionary
    if extracted_data:
        parsed_data = extracted_data
    else:
        parsed_data = {}

    # Ensure the parsed data has all required fields
    return {
        "regulator_name": parsed_data.get("regulator_name", ""),
        "method_of_communication": parsed_data.get("method_of_communication", ""),
        "business_process_status": parsed_data.get("business_process_status", ""),
        "affected_business_process": parsed_data.get("affected_business_process", "")
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

        1. Regulator Name (e.g., SEBI, RBI, etc.)
        2. Method of Communication (e.g., Letter, Circular, Email, etc.)
        3. Business Process Compliance Status (e.g., Compliant, Non-compliant, Action Required)
        4. Affected Business Process (e.g., Asset Management, Compliance, Risk Management, etc.)

        Document:
        {text}

        Please return the extracted information as a JSON with the fields:
        - "regulator_name"
        - "method_of_communication"
        - "business_process_status"
        - "affected_business_process"
        """},
    ]

    response = client.chat.completions.create(
        model="gpt-4",
        messages=messages # type: ignore
    )

    # Log the raw response
    print("GPT-4 Raw Response:", response.choices[0].message.content)

    # Extract only the JSON part from the response string
    try:
        # Assuming the response has the JSON in a well-defined structure
        content = response.choices[0].message.content.strip() # type: ignore

        # Locate the start and end of the JSON part
        json_start = content.find('{')
        json_end = content.rfind('}') + 1

        # Extract the JSON part
        json_data = content[json_start:json_end]

        # Parse the extracted JSON
        extracted_data = json.loads(json_data)
        return extracted_data
    except (KeyError, json.JSONDecodeError) as e:
        print(f"Error extracting or decoding data: {e}")
        return None
