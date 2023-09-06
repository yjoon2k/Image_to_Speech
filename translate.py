import sys
from google.cloud import translate


def translate_text(target: str, text: str) -> dict:
    from google.cloud import translate_v2 as translate

    translate_client = translate.Client()
    if isinstance(text, bytes):
        text = text.decode("utf-8")
    result = translate_client.translate(text, target_language=target)

    print("Text: {}".format(result["input"]))
    print("Translation: {}".format(result["translatedText"]))
    print("Detected source language: {}".format(result["detectedSourceLanguage"]))

    return result


def detect_language(text):
    project_id = "civil-icon-396606"
    client = translate.TranslationServiceClient()
    location = "global"
    parent = f"projects/{project_id}/locations/{location}"

    response = client.detect_language(
        content=text,
        parent=parent,
        mime_type="text/plain",  # mime types: text/plain, text/html
    )

    for language in response.languages:
        if language.language_code == "ko":
            translate_text("en", text)
        else:
            translate_text("ko", text)


text = input("번역할 텍스트를 입력해주세요: ")
detect_language(text)
