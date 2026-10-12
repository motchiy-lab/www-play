# Play on Heiki!

Astroで構築した、ブラウザ向けミニゲーム集です。

## 開発

```sh
npm install
npm run dev
npm run build
npm run preview
```

## ページ構成

| パス | 内容 |
| --- | --- |
| `/` | ゲームポータル |
| `/2048/` | 2048 |
| `/32768/` | 32768 |
| `/mine/` | Minesweeper |
| `/mochi/` | Mochi Clicker |
| `/dino/` | Dino Clone+ |

Astroページと共通コンポーネントは `src/`、ゲームのブラウザスクリプトと静的アセットは `public/` にあります。
