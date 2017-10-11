# node-image
---

A simple node app for image uploading and serving.

## How to use

- Uploading

1. (optional but recommended) Set an api key in `./keys.json`.

2. Send a post request to `/upload` with the image file in the `image` parameter and API key in the `key` parameter if necessary.

3. Viewing url is in the response.

Example: `curl -X POST -F image=@"/path/to/png/image.png" https://img.example.com/upload?key=some-api-key`


- Viewing

1. Go to `/view/:imageName` where `:imageName` is the name of a file in `./public/images`.


## API Key file

```json
[
    {
        "value": "This is where the API key goes",
        "name": "(optional) A name for the thing that will use the key for identification"
    }
]
```
