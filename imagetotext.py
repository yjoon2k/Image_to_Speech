import io
import os
from google.cloud import vision

# Instantiates a client
client = vision.ImageAnnotatorClient()

# The name of the image file to annotate
file_name = os.path.abspath("wakeupcat.jpeg")

# Loads the image into memory
with io.open(file_name, "rb") as image_file:
    content = image_file.read()

image = vision.Image(content=content)

# Performs label detection on the image file
response = client.text_detection(image=image)
image_text = response.text_annotations

print(image_text[0].description)
