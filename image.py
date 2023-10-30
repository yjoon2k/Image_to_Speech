import base64
import json

with open("3.jpeg", "rb") as image_file:
    image_binary = image_file.read()
    encoded_string = base64.b64encode(image_binary)
    image_dict = {"image": encoded_string.decode()}

    image_json = json.dumps(image_dict)
    print(image_json)
