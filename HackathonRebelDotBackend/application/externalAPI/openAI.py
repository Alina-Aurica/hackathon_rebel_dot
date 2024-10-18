import os

import openai



def translate_message(original_message, target_language):
    prompt = f"Translate the following text to {target_language}:\n\n{original_message}"

    # Call the API
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful translation assistant."},
            {"role": "user", "content": prompt}
        ]
    )

    translated_text = response.choices[0].message['content'].strip()
    return translated_text
