# aifamily/views.py
from django.http import JsonResponse
import requests
import json
import os

class qaq:
    def __init__(self, bot_id, api_token):
        self.bot_id = bot_id
        self.api_token = api_token
        self.url = 'https://api.coze.cn/open_api/v2/chat'
        self.headers = {
            'Authorization': f'Bearer {self.api_token}',
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Host': 'api.coze.cn',
            'Connection': 'keep-alive'
        }

    def chat(self, query):
        data = {
            "conversation_id": "123",
            "bot_id": self.bot_id,
            "user": "qwq",
            "query": query,
            "stream": False,
            "chat_history": []
        }
        json_data = json.dumps(data)
        result = requests.post(self.url, headers=self.headers, data=json_data)
        if result.status_code == 200:
            dic = json.loads(result.content.decode('utf-8'))
            response = ''.join([msg['content'] for msg in dic['messages'] if msg['type'] == 'answer'])
            return response
        else:
            return f"Request failed, status code: {result.status_code}"

def chat_view(request):
    if request.method == 'POST':
        user_input = request.POST.get('query')
        if not user_input:
            return JsonResponse({'response': 'No input provided.'}, status=400)

        bot_id = os.environ.get('COZE_BOT_ID')
        api_token = os.environ.get('COZE_API_TOKEN')
        chat_bot = qaq(bot_id=bot_id, api_token=api_token)
        response = chat_bot.chat(user_input)
        return JsonResponse({'response': response})
    else:
        return JsonResponse({'response': 'Invalid request method.'}, status=405)