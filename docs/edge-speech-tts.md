# EdgeSpeechTTS

## 简介

`EdgeSpeechTTS` 类是一个用于将文本转换为语音的工具，它可以在边缘运行时环境中使用。该类提供了一系列方法来获取语音选项，创建语音合成请求，并处理返回的音频数据。

## 构造函数

### `constructor(options: EdgeSpeechAPI & { locale?: string }): EdgeSpeechTTS`

创建一个 `EdgeSpeechTTS` 实例。

#### 参数

- `options`: 对象，可选。
  - `backendUrl`: 字符串，指定后端服务的 URL。如果提供，将使用此 URL 发送请求。
  - `locale`: 字符串，指定要使用的语音区域设置。如果提供，将用于过滤可用语音列表。

## 属性

- `locale`: 字符串，表示实例化时指定的语音区域设置。
- `BACKEND_URL`: 字符串，表示后端服务的 URL。

## 静态属性

- `localeOptions`: 获取所有支持的语音区域选项。
- `voiceList`: 包含所有可用语音的列表。
- `voiceName`: 包含所有语音名称的对象。
- `createRequest`: 用于创建语音合成请求的静态方法。

## 方法

### `voiceOptions`

获取当前实例的语音选项，这些选项基于实例化时指定的 `locale`。

#### 返回值

返回一个包含当前可用语音选项的对象。

### `fetch(payload: EdgeSpeechPayload): Promise<Response>`

内部方法，用于发送语音合成请求。

#### 参数

- `payload`: `EdgeSpeechPayload` 类型，包含语音合成请求的必要信息。

#### 返回值

返回一个 `Promise`，该 `Promise` 解析为包含音频数据的 `Response` 对象。

#### 异常

如果网络响应不成功，将抛出一个错误。

### `create(payload: EdgeSpeechPayload): Promise<AudioBuffer>`

使用给定的请求负载创建语音合成。

#### 参数

- `payload`: `EdgeSpeechPayload` 类型，包含语音合成请求的必要信息。

#### 返回值

返回一个 `Promise`，该 `Promise` 解析为 `AudioBuffer` 对象，包含合成的音频数据。

## 示例

以下是使用 `EdgeSpeechTTS` 类的示例代码：

```javascript
import { EdgeSpeechTTS } from 'path-to-EdgeSpeechTTS';

// 实例化 EdgeSpeechTTS
const tts = new EdgeSpeechTTS({
  backendUrl: 'https://your-backend-service.com/api/speech',
  locale: 'en-US',
});

// 创建语音合成请求负载
const payload = {
  text: 'Hello, world!',
  voice: 'en-US-Standard-B',
  // 其他选项...
};

// 调用 create 方法来合成语音
tts
  .create(payload)
  .then((audioBuffer) => {
    // 使用 audioBuffer
  })
  .catch((error) => {
    console.error('语音合成失败:', error);
  });
```

在此示例中，首先实例化了 `EdgeSpeechTTS` 类，并指定了后端服务的 URL 和语音区域设置。然后创建了一个包含文本和语音选项的请求负载。最后，通过调用 `create` 方法并传入负载来合成语音。如果合成成功，将返回一个包含音频数据的 `AudioBuffer` 对象。如果出现错误，将捕获并处理。
