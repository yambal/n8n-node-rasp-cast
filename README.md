# n8n-nodes-rasp-cast

[Rasp-Cast](https://github.com/yambal/rasp-cast) internet radio server を n8n から操作するためのコミュニティノードです。

[n8n](https://n8n.io/) は [fair-code licensed](https://docs.n8n.io/reference/license/) なワークフロー自動化ツールです。

## インストール

n8n の Settings > Community Nodes で以下を入力してインストール:

```
n8n-nodes-rasp-cast
```

## Credentials（認証設定）

| フィールド | 説明 | 例 |
|---|---|---|
| Server URL | Rasp-Cast サーバーの URL | `http://192.168.1.96:3000` |
| API Key | 管理 API の Bearer トークン | `.env` の `API_KEY` と同じ値 |

## オペレーション

### Stream

| Operation | 説明 |
|---|---|
| **Get Status** | 配信状態を取得（リスナー数、再生中トラック、局名など） |
| **Skip** | 次の曲へスキップ |
| **Skip To** | 指定 ID のトラックへジャンプ |

### Playlist

| Operation | 説明 |
|---|---|
| **Get All** | プレイリスト全体を取得 |
| **Replace** | プレイリストを JSON で全置換 |
| **Add Track** | ローカルファイルまたは URL のトラックを追加 |
| **Remove Track** | ID 指定でトラックを削除 |

### Interrupt

| Operation | 説明 |
|---|---|
| **Play** | 現在の曲を中断し、指定トラックを再生後プレイリストに復帰 |

### Schedule

| Operation | 説明 |
|---|---|
| **Get All** | スケジュール番組一覧を取得（次回実行時刻付き） |
| **Create** | cron 式でスケジュール番組を作成 |
| **Delete** | スケジュール番組を削除 |

## 使用例

### 毎時ジングルを割り込み再生

1. **Schedule Trigger** ノード: 毎時 0 分
2. **Rasp-Cast** ノード: Resource = Interrupt, Operation = Play, Source Type = File, File Path = `music/jingle.mp3`

### 配信状態を Slack に通知

1. **Schedule Trigger** ノード: 5 分おき
2. **Rasp-Cast** ノード: Resource = Stream, Operation = Get Status
3. **Slack** ノード: 再生中のトラック名を送信

## 互換性

- n8n 1.0+
- Rasp-Cast 0.1.0+

## リンク

- [Rasp-Cast](https://github.com/yambal/rasp-cast) - Raspberry Pi MP3 internet radio server
- [npm](https://www.npmjs.com/package/n8n-nodes-rasp-cast)

## ライセンス

MIT
