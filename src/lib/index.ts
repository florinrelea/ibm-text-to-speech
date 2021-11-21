import axios, { AxiosError } from 'axios'
import fs from 'fs'
import * as stream from 'stream'
import { promisify } from 'util'

export class IBMWatson {
  private apiKey: string

  private serviceInstanceUrl: string

  constructor({
    apiKey,
    serviceInstanceUrl
  }: {
    apiKey: string
    serviceInstanceUrl: string
  }) {
    if (typeof apiKey !== 'string') {
      throw new Error('The provided API key is not valid.')
    }

    if (typeof serviceInstanceUrl !== 'string') {
      throw new Error('The provided service instance url is not valid.')
    }

    this.apiKey = apiKey
    this.serviceInstanceUrl = serviceInstanceUrl
  }

  /**
   *
   * @param voice - https://cloud.ibm.com/docs/text-to-speech?topic=text-to-speech-voices
   */
  public async textToSpeech({
    text,
    outputFile = './text_to_speech.wav',
    voice = ''
  }: {
    text: string
    outputFile?: string
    voice?: string
  }) {
    if (voice && typeof voice !== 'string') {
      throw new Error('The provided voice is not valid.')
    }

    if (typeof text !== 'string') {
      throw new Error('The provided text is not valid.')
    }

    const {
      apiKey,
      serviceInstanceUrl
    } = this

    const finished = promisify(stream.finished)

    const writer = fs.createWriteStream(outputFile)

    try {
      const response = await axios({
        method: 'POST',
        url: `${serviceInstanceUrl}/v1/synthesize?voice=${voice}`,
        data: {
          text
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`apikey:${apiKey}`).toString('base64')}`,
          Accept: 'audio/wav'
        },
        responseType: 'stream'
      })

      response.data.pipe(writer)

      await finished(writer)
    } catch (e) {
      const err = e as AxiosError

      let message = typeof err.response !== 'undefined' ? err.response.data.message : err.message

      if (!message) {
        message = err.response?.statusText
      }

      throw new Error(message)
    }
  }
}
