# Track Generator

* Generate songs ( perform, record, number of songs, influences)

Influences:
tempo, length, style, number of instruments etc.

4 tracks / channels

Output performance commands:
Perform song ( song data, record )


## Example track generation scenario

### 1. Generate a track UUID 

`curl -X POST https://api.edrobertson.co.uk/tracks`

Store the response UUID locally

### 2. Start the recorder

`curl -X POST https://api.edrobertson.co.uk/recorders/a?action=start`

The recorder will start recording 

### 3. Start the performance 

Pass the midi file or json data to the performer...

`curl -X POST https://api.edrobertson.co.uk/performers/a`

### 4. Stop the recorder (and store the audio)

Stop the recorder (provide UUID to store) - the recorder adds the mp3

`curl -X POST https://api.edrobertson.co.uk/recorders/a?action=stop`

### 5. Store the midi file with the track

`curl -X POST https://api.edrobertson.co.uk/tracks/{UUID}`

### 6. Store other metadata with the track

`curl -X POST https://api.edrobertson.co.uk/tracks/{UUID}`

