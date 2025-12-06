from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Charger le modèle entraîné
try:
    model = joblib.load("gradient_boosting_model.pkl")
    print("✅ Modèle chargé avec succès.")
except Exception as e:
    print(f"❌ Erreur de chargement du modèle : {e}")
    model = None

# Vérification du statut du serveur
@app.route("/api/status", methods=["GET"])
def status():
    return jsonify({"status": "OK", "message": "Backend Flask opérationnel"})

# Endpoint de prédiction
@app.route("/api/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Modèle non disponible"}), 500
    try:
        data = request.get_json()
        features = data.get("features")
        if not features or not isinstance(features, list):
            return jsonify({"error": "Les 'features' doivent être une liste"}), 400

        # Transformation en tableau numpy
        X_input = np.array(features).reshape(1, -1)  # reshape selon le nombre de features
        # Prédiction avec le modèle
        prediction = model.predict(X_input)
        return jsonify({"prediction": prediction.tolist()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
