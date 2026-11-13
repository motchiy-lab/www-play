(() => {
  const $ = id => document.getElementById(id);

  const urlInput = $('post-url');
  const intervalInput = $('post-interval');
  const linesInput = $('post-lines');
  const formatInput = $('post-format');
  const bodyInput = $('post-body');
  const waitCheckbox = $('post-wait');
  const logsCheckbox = $('post-logs');

  const startButton = $('post-start');
  const stopButton = $('post-stop');

  const successDisplay = $('post-success');
  const failureDisplay = $('post-failure');
  const totalDisplay = $('post-total');

  const statusDisplay = $('post-status');
  const logDisplay = $('post-log');

  const MAX_REQUESTS = 1000;

  let running = false;
  let timers = [];
  let controllers = [];

  let successCount = 0;
  let failureCount = 0;
  let totalCount = 0;

  function updateStats() {
    successDisplay.textContent = successCount;
    failureDisplay.textContent = failureCount;
    totalDisplay.textContent = totalCount;
  }

  function addLog(message, type) {
    if (!logsCheckbox.checked) return;
    
    const item = document.createElement('div');

    item.className = type;
    item.textContent =
      `[${new Date().toLocaleTimeString()}] ${message}`;

    logDisplay.prepend(item);
  }

  function stop() {
    running = false;
    timers.forEach(t => clearTimeout(t));
    timers = [];
    controllers.forEach(c => c.abort());
    controllers = [];

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

    if (noWaitCheckbox.checked) {
      const t = setTimeout(() => {
        sendRequest(url, requestBody, interval);
      }, interval * 1000);
      timers.push(t);
    }
    
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
      controllers = controllers.filter(c => c !== controller);
      updateStats();
    }

    if (!running) return;

    statusDisplay.textContent = '実行中';

    if (!noWaitCheckbox.checked) {
      const t = setTimeout(() => {
        sendRequest(url, requestBody, interval);
      }, interval * 1000);
      timers.push(t);
    }
  }

  startButton.addEventListener('click', () => {
    if (running) return;

    const url = urlInput.value.trim();
    const interval = Number(intervalInput.value);
    const lines = Number(linesInput.value) || 1;
    
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

    for (let i = 0; i < lines; i++) {
      sendRequest(parsedUrl.href, requestBody, interval);
    }
  });

  stopButton.addEventListener('click', stop);

})();
