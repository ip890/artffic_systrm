from flask import request, jsonify
import mysql.connector
from werkzeug.security import generate_password_hash

@app.route("/api/init_admin", methods=["POST"])
def init_admin():

    data = request.get_json(force=True)
    print("DATA RECEIVED:", data)

    password_hash = generate_password_hash(data["password_hash"])

    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="traffic_system"
        )

        cursor = conn.cursor()

        sql = """
        INSERT INTO users
        (full_name, user_name, email, phone, organization, role, password, is_active)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        """

        values = (
            data["full_name"],
            data["user_name"],
            data["email"],
            data["phone"],
            data["organization"],
            data["role"],
            password_hash,
            int(data["is_active"])
        )

        cursor.execute(sql, values)
        conn.commit()

        print("ROWS INSERTED:", cursor.rowcount)

        return jsonify({"message": "تم إدخال المستخدم بنجاح"})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500
