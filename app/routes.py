from flask import Blueprint, request, jsonify
from .models import db, Circular, Clause
from .services.circular_parser import process_circular
import os

main_routes = Blueprint("main_routes", __name__)

UPLOAD_FOLDER = "/mnt/data/uploads"
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

    # Save the extracted data to the database
    circular = Circular(
        filename=file.filename, # type: ignore
        regulator_name=parsed_data["regulator_name"],  # type: ignore
        id=parsed_data["circular_number"], # type: ignore
        method_of_communication=parsed_data["method_of_communication"],# type: ignore
        business_process_status=parsed_data["business_process_status"], # type: ignore
        affected_business_process=parsed_data["affected_business_process"],# type: ignore
        ai_summary=parsed_data["ai_summary"], # type: ignore
        common_tags=parsed_data["common_tags"],# type: ignore
        Issued=parsed_data["Issued"],# type: ignore
        Due=parsed_data["Due"],# type: ignore
        Title=parsed_data["Title"]# type: ignore

    )

    db.session.add(circular)
    db.session.commit()

    # Process and save clauses if they exist
    clauses = parsed_data.get('clauses', [])
    if clauses:
        for clause in clauses:
            new_clause = Clause(
                content=clause.get('content', ''),  # type: ignore
                actionable=clause.get('actionable', ''),  # type: ignore
                department=clause.get('department', ''),  # type: ignore
                circular_id=circular.id  # type: ignore
            )
            db.session.add(new_clause)

        # Commit the transaction to save clauses
        db.session.commit()

    return jsonify({
        "message": "Circular uploaded successfully!",
        "data": parsed_data
    }), 201


@main_routes.route("/circulars", methods=["GET"])
def get_circulars():
    # Fetch all circulars and their associated clauses
    circulars = Circular.query.all()
    
    circular_list = []
    
    for circular in circulars:
        # Fetch the clauses for each circular
        clauses = [
            {
                "content": clause.content,
                "actionable": clause.actionable,
                "department": clause.department
            }
            for clause in circular.clauses  # Access the related clauses
        ]
        
        circular_list.append({
            "id": circular.id,
            "filename": circular.filename,
            "regulator_name": circular.regulator_name,
            "method_of_communication": circular.method_of_communication,
            "business_process_status": circular.business_process_status,
            "affected_business_process": circular.affected_business_process,
            "ai_summary": circular.ai_summary,
            "common_tags": circular.common_tags,
            "Issued": circular.Issued,
            "Due": circular.Due,
            "Title": circular.Title,
            "clauses": clauses  # Add clauses to the response
        })
    
    return jsonify(circular_list)

@main_routes.route("/circular-status", methods=["GET"])
def circular_status():
    # Count circulars by business process status
    compliant_count = Circular.query.filter_by(
        business_process_status="Compliant").count()
    non_compliant_count = Circular.query.filter_by(
        business_process_status="Non-compliant").count()
    action_required_count = Circular.query.filter_by(
        business_process_status="Action Required").count()

    return jsonify({
        "compliant": compliant_count,
        "non_compliant": non_compliant_count,
        "action_required": action_required_count
    })


@main_routes.route("/circulars/search", methods=["GET"])
def search_circulars():
    # Get query parameters
    regulator_name = request.args.get("regulator_name")
    method_of_communication = request.args.get("method_of_communication")
    business_process_status = request.args.get("business_process_status")
    affected_business_process = request.args.get("affected_business_process")
    ai_summary = request.args.get("ai_summary"),
    common_tags = request.args.get("common_tags"),
    Issued = request.args.get("Issued"),
    Due = request.args.get("Due"),
    Title = request.args.get("Title")

    # Build query dynamically
    query = Circular.query
    if regulator_name:
        query = query.filter(
            Circular.regulator_name.ilike(f"%{regulator_name}%"))
    if ai_summary:
        query = query.filter(
            Circular.ai_summary.ilike(f"%{ai_summary}%"))
    if common_tags:
        query = query.filter(
            Circular.common_tags.ilike(f"%{common_tags}%"))
    if Issued:
        query = query.filter(
            Circular.Issued.ilike(f"%{Issued}%"))
    if Due:
        query = query.filter(
            Circular.Due.ilike(f"%{Due}%"))
    if Title:
        query = query.filter(
            Circular.Title.ilike(f"%{Title}%"))
    if method_of_communication:
        query = query.filter(Circular.method_of_communication.ilike(
            f"%{method_of_communication}%"))
    if business_process_status:
        query = query.filter(Circular.business_process_status.ilike(
            f"%{business_process_status}%"))
    if affected_business_process:
        query = query.filter(Circular.affected_business_process.ilike(
            f"%{affected_business_process}%"))

    # Execute query and return results
    circulars = query.all()
    result = [
        {
            "id": c.id,
            "filename": c.filename,
            "regulator_name": c.regulator_name,
            "method_of_communication": c.method_of_communication,
            "business_process_status": c.business_process_status,
            "affected_business_process": c.affected_business_process,
            "ai_summary": c.ai_summary,
            "common_tags": c.common_tags,
            "Issued": c.Issued,
            "Due": c.Due,
            "Title": c.Title
        }
        for c in circulars
    ]

    return jsonify(result), 200


@main_routes.route("/dashboard", methods=["GET"])
def dashboard_data():
    # Count of total circulars
    total_circulars = Circular.query.count()

    # Count of circulars by business process status
    pending_count = Circular.query.filter_by(
        business_process_status="Action Required").count()
    # Fetch the most recent circular based on 'Issued' date or 'id' (latest entry)
    # You can also order by 'Issued' if needed
    last_circular = Circular.query.order_by(Circular.id.desc()).first()

    # If there's at least one circular, get the Title of the most recent one
    last_circular_title = last_circular.Title if last_circular else "No circulars available"

    return jsonify({
        "total_circulars": total_circulars,
        "pending": pending_count,
        "last_title": last_circular_title  # Add the Title of the last circular
    })


@main_routes.route("/circulars/<int:id>", methods=["GET"])
def get_circular_by_id(id):
    circular = Circular.query.get(id)
    if not circular:
        return jsonify({"error": "Circular not found"}), 404

    return jsonify(
        {
            "id": circular.id,
            "filename": circular.filename,
            "regulator_name": circular.regulator_name,
            "method_of_communication": circular.method_of_communication,
            "business_process_status": circular.business_process_status,
            "affected_business_process": circular.affected_business_process,
            "ai_summary": circular.ai_summary,
            "common_tags": circular.common_tags,
            "Issued": circular.Issued,
            "Due": circular.Due,
            "Title": circular.Title
        })
