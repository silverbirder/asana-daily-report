# Asana Tasks to Slack Notifications

このスクリプトは、Asanaで特定のプロジェクト内のタスクを取得し、条件に応じて整理して、Slackに通知します。

## 機能

- 特定のプロジェクト内の各セクションからタスクを取得
- 各セクションごとに以下の条件を適用:
  - In Progress: 自分自身がアサインされているタスク
  - Done: 自分自身がアサインされており、本日完了したタスク
  - Backlog: 自分自身が本日作成したタスク
- Slackに通知する際に、セクションごとに異なるメッセージを設定

<img width="1144" alt="Screenshot 2023-04-07 at 10 34 13 PM" src="https://user-images.githubusercontent.com/10257868/230617797-11ba8a36-ecdc-489c-9e11-829093ccd8fe.png">

<img width="563" alt="Screenshot 2023-04-07 at 10 30 14 PM" src="https://user-images.githubusercontent.com/10257868/230617816-dd3d8862-be2a-41a5-bdf2-427fd74a1500.png">

## AsanaプロジェクトIDの取得方法

1. Asanaで対象プロジェクトを開きます。
2. ブラウザのアドレスバーを確認します。URLは以下のような形式になっています。

    `https://app.asana.com/0/PROJECT_ID/list`

3. `PROJECT_ID` の部分がプロジェクトIDです。これをメモしておいてください。

## Asanaアクセストークンの取得方法

1. Asanaにログインし、右上のプロフィールアイコンをクリックして、「My Profile Settings」を選択します。
2. 「Apps」タブをクリックし、ページ下部の「Developers Console」をクリックします。
3. 「Personal Access Tokens」タブを開き、「New Access Token」ボタンをクリックします。
4. トークンの説明を入力し、「Create Token」ボタンをクリックします。
5. 表示されるトークンをコピーして保存してください。このトークンは再表示されないため、失くさないように注意してください。

## セットアップ手順

1. Google App Scriptで新しいプロジェクトを作成します。
1. src/main.gsとsrc/property.gsをコピーします。
1. Slackで新しいBotアプリを作成し、`chat:write`, `users:read`, `users:read.email`権限を付与します。
1. インストールしたSlackワークスペースでBotトークンとチャンネルIDを取得します。
1. `setScriptProperties`関数に必要な値を設定します。
1. Google App Scriptエディタから一度だけ`setScriptProperties`関数を実行して、環境変数を設定します。
1. Google App Scriptのトリガーを設定し、`main` 関数が定期的に実行されるようにします（例: 毎日午後6時）。

これで、設定が完了しました。指定されたトリガーに従って、スクリプトが定期的に実行され、条件に応じて整理されたタスクがSlackに通知されます。


## その他

README.md、src以下のgsファイルは、すべてChatGPTが作成しました。