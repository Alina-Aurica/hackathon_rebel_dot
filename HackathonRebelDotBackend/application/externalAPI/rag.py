from flask import jsonify, request, Blueprint
from sentence_transformers import SentenceTransformer
import faiss
import pandas as pd
import numpy as np
import openai
import os
from application.service.user_service import UserService


query_controller = Blueprint('query_controller', __name__, url_prefix='/query')



touristic_guide = pd.read_csv('touristic_guides_dataset.csv')

model = SentenceTransformer('all-MiniLM-L6-v2')

descriptions = touristic_guide['Description'].tolist()
description_embeddings = model.encode(descriptions, convert_to_tensor=False)

dimension = description_embeddings[0].shape[0]
index = faiss.IndexFlatL2(dimension)  # Euclidean distance

faiss.normalize_L2(description_embeddings)
index.add(np.array(description_embeddings).astype("float32"))


def retrieve_information(query, top_k=3):
    query_embedding = model.encode([query], convert_to_tensor=False)

    faiss.normalize_L2(query_embedding)
    distances, indices = index.search(np.array(query_embedding).astype("float32"), top_k)

    results = [touristic_guide.iloc[idx]['Description'] for idx in indices[0]]
    return results


def generate_response(query, maternal_language):
    retrieved_texts = retrieve_information(query)
    context = " ".join(retrieved_texts)

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system",
             "content": f"You are a helpful assistant for providing information about tourist locations, who speak in {maternal_language}."},
            {"role": "user", "content": f"Question: {query} /n"
                                        f"Context: {context} /n"
                                        f"Answer the question using context."}
        ],
        max_tokens=300
    )

    return response.choices[0].message['content']


@query_controller.route('/<int:id_user>', methods=['POST'])
def query(id_user):
    data = request.json
    query = data.get('query', '')

    if not query:
        return jsonify({"error": "No query provided"}), 400

    maternal_language = UserService.get_maternal_language_for_user(id_user)

    response = generate_response(query, maternal_language)
    if response:
        return jsonify({"response": response}), 200
    else:
        return jsonify({"error": "No response"}), 400