console.log('POST Party!');

(() => {
  const $ = id => document.getElementById(id);

  const urlInput = $('post-url');
  const intervalInput = $('post-interval');
  const formatInput = $('post-format');
  const bodyInput = $('post-body');

  const startButton = $('post-start');
  const stopButton = $('post-stop');

  const successDisplay = $('post-success');
  const failureDisplay = $('post-failure');
  const totalDisplay = $('post-total');

  const statusDisplay = $('post-status');
  const logDisplay = $('post-log');

  const MAX_REQUESTS = 1000;

  let running = false;
  let timer = null;
  let controller = null;

  let successCount = 0;
  let failureCount = 0;
  let totalCount = 0;

  function updateStats() {
    successDisplay.textContent = successCount;
    failureDisplay.textContent = failureCount;
    totalDisplay.textContent = totalCount;
  }

  function addLog(message, type) {
    const item = document.createElement('div');

    item.className = type;
    item.textContent =
      `[${new Date().toLocaleTimeString()}] ${message}`;

    logDisplay.prepend(item);
  }

  function stop() {
    running = false;

    clearTimeout(timer);
    timer = null;

    if (controller) {
      controller.abort();
      controller = null;
    }

    startButton.disabled = false;
    stopButton.disabled = true;

    statusDisplay.textContent = '停止しました';
  }

  function getRequestBody() {
    const format = formatInput.value;
    const content = bodyInput.value;

    switch (format) {
      case 'json':
        return {
          body: JSON.stringify(JSON.parse(content)),
          contentType: 'application/json'
        };

      case 'text':
        return {
          body: content,
          contentType: 'text/plain;charset=UTF-8'
        };

      case 'form':
        return {
          body: new URLSearchParams(
            JSON.parse(content)
          ).toString(),
          contentType: 'application/x-www-form-urlencoded'
        };

      default:
        throw new Error('不明な形式です');
    }
  }

  async function sendRequest(url, requestBody, interval) {
    console.log('送信処理開始', url);
    
    if (!running) return;

    controller = new AbortController();

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': requestBody.contentType
        },
        body: requestBody.body,
        signal: controller.signal
      });

      totalCount++;

      if (response.ok) {
        successCount++;

        addLog(
          `成功: HTTP ${response.status}`,
          'success'
        );
      } else {
        failureCount++;

        addLog(
          `失敗: HTTP ${response.status}`,
          'failure'
        );
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }

      totalCount++;
      failureCount++;

      addLog(
        `失敗: ${error.message}`,
        'failure'
      );

    } finally {
      controller = null;
      updateStats();
    }

    if (!running) return;

    if (totalCount >= MAX_REQUESTS) {
      stop();
      statusDisplay.textContent =
        '最大送信回数に到達しました';
      return;
    }

    statusDisplay.textContent = '実行中';

    // 前のリクエスト完了後に次を送信
    timer = setTimeout(() => {
      sendRequest(url, requestBody, interval);
    }, interval * 1000);
  }

  startButton.addEventListener('click', () => {
    if (running) return;

    const url = urlInput.value.trim();
    const interval = Number(intervalInput.value);
    
    if (!Number.isFinite(interval) || interval < 0.01) {
      alert('送信間隔は0.01秒以上で入力してください');
      return;
    }

    if (!url) {
      alert('送信先アドレスを入力してください');
      return;
    }

    let parsedUrl;
    let requestBody;

    try {
      parsedUrl = new URL(url);
      requestBody = getRequestBody();

    } catch (error) {
      alert(error.message);
      return;
    }

    // カウンター初期化
    successCount = 0;
    failureCount = 0;
    totalCount = 0;

    updateStats();
    logDisplay.replaceChildren();

    running = true;

    startButton.disabled = true;
    stopButton.disabled = false;

    statusDisplay.textContent = '実行中';

    sendRequest(parsedUrl.href, requestBody, interval);
  });

  stopButton.addEventListener('click', stop);

})();
