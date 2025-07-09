from flask import Flask, render_template, request, jsonify, session
import requests
import json
from flask_cors import CORS
import sys, os
import pandas as pd
from IPython.display import display, clear_output, Markdown

app = Flask(__name__)
CORS(app)
app.secret_key = 'your_secret_key'  # 用于会话管理

class qaq:
    def __init__(self,
                 bot_id=None,
                 api_token=None,
                 max_chat_rounds=20,
                 stream=True):
        self.bot_id = os.environ['COZE_BOT_ID']
        self.api_token = api_token if api_token else os.environ['COZE_API_TOKEN']
        self.max_chat_rounds = max_chat_rounds
        self.stream = stream
        self.url = 'https://api.coze.cn/open_api/v2/chat'
        self.headers = {
            'Authorization': f'Bearer {self.api_token}',
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Host': 'api.coze.cn',
            'Connection': 'keep-alive'
        }

    @classmethod
    def build_messages(cls, history=None):
        messages = []
        history = history if history else []
        for prompt, response in history:
            pair = [{"role": "user", "content": prompt, "content_type": "text"},
                    {"role": "assistant", "content": response}]
            messages.extend(pair)
        return messages

    @staticmethod
    def get_response(messages):
        clear_output(wait=True)
        dfmsg = pd.DataFrame(messages)
        dftool = dfmsg.loc[dfmsg['type'] == 'function_call']
        for content in dftool['content']:
            info = json.loads(content)
            s = 'call function: ' + str(info['name']) + '; args =' + str(info['arguments'])
            print(s, file=sys.stderr)
        dfans = dfmsg.loc[dfmsg['type'] == 'answer']
        if len(dfans) > 0:
            response = ''.join(dfans['content'].tolist())
        else:
            response = ''
        display(Markdown(response))
        return response

    def chat(self, query, history=None):
        data = {
            "conversation_id": "123",
            "bot_id": self.bot_id,
            "user": "qwq",
            "query": query,
            "stream": self.stream,
            "chat_history": self.build_messages(history)
        }
        json_data = json.dumps(data)
        result = requests.post(self.url, headers=self.headers, data=json_data, stream=self.stream)

        if not self.stream and result.status_code == 200:
            dic = json.loads(result.content.decode('utf-8'))
            response = self.get_response(dic['messages'])
        elif self.stream and result.status_code == 200:
            messages = []
            for line in result.iter_lines():
                if not line:
                    continue
                try:
                    line = line.decode('utf-8')
                    line = line[5:] if line.startswith('data:') else line
                    dic = json.loads(line)
                    if dic['event'] == 'message':
                        messages.append(dic['message'])
                    response = self.get_response(messages)
                except Exception as err:
                    print(err)
                    break
        else:
            print(f"request failed, status code: {result.status_code}")
        result.close()
        return response

@app.route('/')
def index():
    return render_template('aifamily/index.html')

@app.route('/chat', methods=['GET'])
def chat_page():
    return render_template('aifamily/chat.html')

@app.route('/chat', methods=['POST'])
def chat():
    # 从 JSON 请求体中获取 'query'
    data = request.get_json()  # 获取 JSON 数据
    user_input = data.get('query')  # 使用 .get() 避免 KeyError

    if not user_input:
        return jsonify({'error': 'Missing "query" in request body'}), 400

    if 'history' not in session:
        session['history'] = []
    history = session['history']
    
    chat_bot = qaq(
        api_token=os.environ['COZE_API_TOKEN'],
        bot_id=os.environ['COZE_BOT_ID'],
        max_chat_rounds=20,
        stream=True
    )
    
    response = chat_bot.chat(user_input, history)
    history.append((user_input, response))
    
    # 限制历史记录长度
    if len(history) > 20:
        history = history[-20:]
    
    session['history'] = history
    return jsonify({'response': response, 'history': history})

if __name__ == '__main__':
    os.environ['COZE_API_TOKEN'] = 'pat_WLtLLWx0BDs1cG5mNyvlfC5Qm8BWt4CNVjoYjXk52v9PtATTRFjdVKP30K8PFIYE'
    os.environ['COZE_BOT_ID'] = '7505431790128480294'
    app.run(debug=True)