from flask import Blueprint, request, jsonify
from .models import db, Circular
from .services.circular_parser import process_circular
import os

main_routes = Blueprint("main_routes", __name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@main_routes.route("/upload", methods=["POST"])
def upload_circular():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)  # type: ignore
    file.save(filepath)

    # Parse the circular and get the data
    parsed_data = process_circular(filepath)

    # If the parsed data is missing essential fields, return an error
    if not parsed_data.get("regulator_name"):
        return jsonify({"error": "Failed to extract required data from the document."}), 400

    # Save the extracted data to the database
    circular = Circular(
        filename=file.filename, # type: ignore
        regulator_name=parsed_data["regulator_name"],  # type: ignore
        method_of_communication=parsed_data["method_of_communication"],  # type: ignore
        business_process_status=parsed_data["business_process_status"],  # type: ignore
        affected_business_process=parsed_data["affected_business_process"]  # type: ignore
    )

    db.session.add(circular)
    db.session.commit()

    return jsonify({
        "message": "Circular uploaded successfully!",
        "data": parsed_data
    })
