# Import

### Javascript
```
const { IBMWatson } = require('ibm-text-to-speech')
```

### Typescript
```
import { IBMWatson } from 'ibm-text-to-speech'
```


# Usage

```
 const watson = new IBMWatson({
  apiKey: process.env.IBM_WATSON_API_KEY as string,
  serviceInstanceUrl: process.env.IBM_WATSON_SERVICE_INSTANCE_URL as string
})

try {
  await watson.textToSpeech({
    text: 'Just some text here.',
    voice: 'en-US_MichaelV3Voice',
    outputFile: './text_to_speech.wav',
  })
} catch (e) {
  console.error(e)
}
```