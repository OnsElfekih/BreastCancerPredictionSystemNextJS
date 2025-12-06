import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

# Chargement du dataset
df = pd.read_csv("dataR2.csv")

# Prétraitement
df['Class'] = df['Classification'].map({1:0, 2:1})
df = df.dropna(subset=['Class'])

X = df.drop(['Classification','Class'], axis=1)
y = df['Class']

# Split train/test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Modèle Gradient Boosting avec paramètres par défaut
gb = GradientBoostingClassifier(random_state=42)

# Cross-validation
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(gb, X, y, cv=cv, scoring='accuracy')
print("Cross-validation scores:", cv_scores)
print("Mean CV accuracy:", np.mean(cv_scores))

# Entraînement sur le train set
gb.fit(X_train, y_train)

# Sauvegarde du modèle en .pkl
joblib.dump(gb, "gradient_boosting_model.pkl")
print("Modèle sauvegardé sous 'gradient_boosting_model.pkl'")

# Prédictions
y_pred = gb.predict(X_test)

# Évaluation
print("Test Accuracy (Gradient Boosting):", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))
