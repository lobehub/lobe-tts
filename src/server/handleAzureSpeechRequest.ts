import {
  AudioConfig,
  PropertyId,
  ResultReason,
  SpeechConfig,
  SpeechSynthesisOutputFormat,
  SpeechSynthesisResult,
  SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk';

import { AZURE_SPEECH_KEY, AZURE_SPEECH_REGION } from '../const/api';

const fetchAzureSpeech = async (ssml: string, { api }: any): Promise<ArrayBuffer> => {
  const key = api.key || AZURE_SPEECH_KEY;
  const region = api.key || AZURE_SPEECH_REGION;
  const speechConfig = SpeechConfig.fromSubscription(key, region);
  speechConfig.setProperty(PropertyId.SpeechServiceResponse_RequestSentenceBoundary, 'true');
  speechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Webm24Khz16BitMonoOpus;

  const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
  const synthesizer: SpeechSynthesizer | null = new SpeechSynthesizer(speechConfig, audioConfig);

  const completeCb = async (
    result: SpeechSynthesisResult,
    resolve: (value: ArrayBuffer) => void,
  ) => {
    if (result.reason === ResultReason.SynthesizingAudioCompleted) {
      const audioData = result.audioData;
      resolve(audioData);
    }
    synthesizer.close();
  };

  const errCb = (err: string, reject: (err?: any) => void) => {
    reject(err);
    synthesizer.close();
  };

  return new Promise<ArrayBuffer>((resolve, reject) => {
    synthesizer.speakSsmlAsync(
      ssml,
      (result) => completeCb(result, resolve),
      (err) => errCb(err, reject),
    );
  });
};

export const handleAzureSpeechRequest = async (req: Request) => {
  const { ssml, ...options } = req.body as any;
  const data = await fetchAzureSpeech(ssml, options);
  return new Response(data);
};
