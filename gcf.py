import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "civil-icon-396606-0ba48c32ca95.json"
import functions_framework
from google.cloud import vision
from google.cloud import texttospeech
from google.cloud import translate
import base64
import json


def translate_text(target: str, text: str) -> dict:
    from google.cloud import translate_v2 as translate

    translate_client = translate.Client()
    if isinstance(text, bytes):
        text = text.decode("utf-8")
    result = translate_client.translate(text, target_language=target)

    """print("Text: {}".format(result["input"]))
    print("Translation: {}".format(result["translatedText"]))
    print("Detected source language: {}".format(result["detectedSourceLanguage"]))"""
    if target == "ko":
        synthesize_text(result["translatedText"], "ko-KR")
    elif target == "en":
        synthesize_text(result["translatedText"], "en-US")
    return result


def detect_language(text):
    project_id = "civil-icon-396606"
    client = translate.TranslationServiceClient()
    location = "global"
    parent = f"projects/{project_id}/locations/{location}"

    response = client.detect_language(
        content=text,
        parent=parent,
        mime_type="text/plain",
    )

    for language in response.languages:
        if language.language_code == "ko":
            return translate_text("en", text)
        else:
            return translate_text("ko", text)


def synthesize_text(text, target):
    client = texttospeech.TextToSpeechClient()
    input_text = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code=target,
        name=target + "-Standard-C",
        ssml_gender=texttospeech.SsmlVoiceGender.FEMALE,
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )
    response = client.synthesize_speech(
        request={"input": input_text, "voice": voice, "audio_config": audio_config}
    )
    with open("output.mp3", "wb") as out:
        out.write(response.audio_content)
        # print('Audio content written to file "output.mp3"')


@functions_framework.http
def hello_http(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """
    request_json = request.get_json(silent=True)
    request_args = request.args
    client = vision.ImageAnnotatorClient()
    content = base64.b64decode(request_json["image"])
    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    image_text = response.text_annotations
    # print("detected text : " + image_text[0].description.replace("\n", " "))
    translated_text = detect_language(image_text[0].description.replace("\n", " "))
    # print("translated text : " + translated_text["translatedText"])
    # result = {"text" : translated_text["translatedText"]}
    return translated_text["translatedText"]
