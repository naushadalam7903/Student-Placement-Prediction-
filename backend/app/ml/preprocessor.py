from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from backend.app.config import CATEGORICAL_FEATURES, NUMERICAL_FEATURES

def create_preprocessor() -> ColumnTransformer:
    """
    Creates a ColumnTransformer to preprocess numerical features with StandardScaler
    and categorical features with OneHotEncoder.
    """
    preprocessor = ColumnTransformer(
        transformers=[
            (
                "num",
                StandardScaler(),
                NUMERICAL_FEATURES
            ),
            (
                "cat",
                OneHotEncoder(drop="first", sparse_output=False, handle_unknown="ignore"),
                CATEGORICAL_FEATURES
            )
        ],
        remainder="drop"
    )
    return preprocessor
