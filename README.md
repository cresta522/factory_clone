# jquery_chat
socket.io node.js 等を使った簡易チャット
解説、コメントは多め。

# 環境の準備
1. npmの支度
``` 
npm init
```

今回、ここでの``` entry point ``` は **server.js** とする

2. 必要なパッケージのインストール

双方向通信を可能にするパッケージを以下の通りインストールする

``` 
npm install express --save
npm install socket.io --save
```
省略系として
```
npm i express -S
npm i socket.io -S
```

3. 参考URL  

[Webチャットアプリを作る ( Node.js + Socket.io )](https://www.hiramine.com/programming/chat_nodejs_socketio/index.html)