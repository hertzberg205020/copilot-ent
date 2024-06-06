
const vscode = require('vscode');
const RunInSemanticKernel = require('./enterprisecopilot.js');
require('./semantic-kernel.js');
require('./enterprisecopilot.js');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('I am your AI assitanst !');

  let webView;

  let extensionURL = context.extensionUri;


  let webViewProvider = {
    resolveWebviewView: (_webviewView, _webviewContex) => {
      _webviewView.webview.options = { enableScripts: true };
      this.webView = _webviewView;
      this.webView.webview.html = initChatViewContent(this.webView, extensionURL);
      this.webView.webview.onDidReceiveMessage(async message => {
        switch (message.type) {
          case 'addQA':

            const result = await RunInSemanticKernel(message.value, "Translate");
            const strQA = '🧑:  <br/><br/> ' + message.value + '<br/><br/>' + '🤖: <br/><br/> ' + result + '<br/><br/>';
            this.webView.webview.postMessage({ type: 'addQA', value: strQA });
            break;
        }
      }, undefined, context.subscriptions);
    }
  };

  context.subscriptions.push(vscode.window.registerWebviewViewProvider('copilotext.copilotView', webViewProvider, {
    webviewOptions: { retainContextWhenHidden: true }
  }));

  const ask_cmd = vscode.commands.registerCommand('copilotext.addAskResponse', async function () {


    this.webView.webview.postMessage({ type: 'addQA', value: '🤖 <br/><br/>' });
  })




  context.subscriptions.push(ask_cmd);


  let checkcode_cmd = vscode.commands.registerCommand('copilotext.checkcode', async function () {
    const selectedText = vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection);
    const result = await RunInSemanticKernel(selectedText, "Check");
    this.webView.webview.postMessage({
      type: 'addCode', value: '🤖: < br /> ' + result + ' < br /> '
    });
  });

  context.subscriptions.push(checkcode_cmd);
}


function initChatViewContent(webview, extensionURL) {


  const imgUri = webview.webview.asWebviewUri(vscode.Uri.joinPath(extensionURL, 'media', 'imgs', 'send.png'));
  const jsUri = webview.webview.asWebviewUri(vscode.Uri.joinPath(extensionURL, 'media', 'js', 'web.js'));

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <script src="${jsUri}"></script>
	  <title>🤖 Enterprise Copilot Assitant</title>
	  <style>
		  body{
				font-size:1em;
		  }
	      div {
				Padding: 4px;
		  }
	      code {
				Padding: 4px;
		  }
		  .answer {
			inline-height:600px
			overflow-y:auto;
		  }
		  .question {
            position: absolute;
            bottom: 10px;
			border:1px solid #707070;
			padding: 0.5em;
			text-align: center;
			width: 400px;
			height: auto;
		  }
		  textarea:focus{
			outline: 0;
		  }
		  textarea
		  {
			 background: transparent;
			 border: none;
			 outline: none;
			 outline-width: 0;
			 height: 1.5em;
			 display: inline;
			 display: inline-block;
			 object-fit: contain;
			 color: #707070;
			 width:80%;
			 overflow: hidden;
			 resize: none;
			 font-size: 1.2em;
		  }
		  img {
			width: 2.5em;
			height: 2.5em;
		  }
	  </style>
  </head>
  <body>
      <h2>🤖 Enterprise Copilot Assitant</h2>
	  <p>I am your enterprise AI assistant, helping you coding and improve work efficiency</p>
	  <span>I can do</span>
	  <ul>
		<li>🔎 Code Checking</li>
		<li>📖 Code Analysis</li>
		<li>⚒️ Code Refactoring</li>
	  </ul>
	  <p id="answer"></p>
	  <center>
		<div class="question">
			<span><textarea rows="3" cols="10" wrap="soft" id="taAsk"></textarea></span>
			<span><img src="${imgUri}" id="btnASK"  /></span>
		</div>
	  </center>
	  <script>
	  		const vscode = acquireVsCodeApi();
			document.addEventListener('DOMContentLoaded', function(){

				document.getElementById('btnASK').addEventListener('click', function (e) {
					vscode.postMessage({type: 'addQA', value:  document.getElementById('taAsk').value});
				});
			});
	  </script>
  </body>
  </html>`;

}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
  activate,
  deactivate
}
