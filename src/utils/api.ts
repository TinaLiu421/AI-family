export async function sendMessageToBackend(query: string): Promise<string> {
    const response = await fetch('http://127.0.0.1:5000/chat', { // 修改为 Flask 的端点
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Flask 通常使用 JSON 格式
      },
      body: JSON.stringify({ query }), // 将请求体改为 JSON 格式
    });
  
    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data.response;
  }