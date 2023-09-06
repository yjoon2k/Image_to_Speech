from google.cloud import vision
from google.cloud import translate
from google.cloud import texttospeech
import io
import os
import sys


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
        mime_type="text/plain",  # mime types: text/plain, text/html
    )

    for language in response.languages:
        if language.language_code == "ko":
            return translate_text("en", text)
        else:
            return translate_text("ko", text)


def synthesize_text(text, target):
    """Synthesizes speech from the input string of text."""

    client = texttospeech.TextToSpeechClient()

    input_text = texttospeech.SynthesisInput(text=text)

    # Note: the voice can also be specified by name.
    # Names of voices can be retrieved with client.list_voices().
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

    # The response's audio_content is binary.
    with open("output.mp3", "wb") as out:
        out.write(response.audio_content)
        print('Audio content written to file "output.mp3"')


client = vision.ImageAnnotatorClient()
file_name = os.path.abspath("2.jpeg")
with io.open(file_name, "rb") as image_file:
    content = image_file.read()

image = vision.Image(content=content)
response = client.text_detection(image=image)
image_text = response.text_annotations

print("detected text : " + image_text[0].description.replace("\n", " "))

translated_text = detect_language(image_text[0].description.replace("\n", " "))
print("translated text : " + translated_text["translatedText"])
os.system("afplay output.mp3")
