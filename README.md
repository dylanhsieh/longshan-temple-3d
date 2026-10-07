# 艋舺龍山寺 3D 導覽 · Longshan Temple 3D Tour

輸出檔：`../longshan-temple-3d.html`（單一檔案，Three.js 已內嵌，可直接從 file:// 離線開啟）
Output: `../longshan-temple-3d.html` (one self-contained file, Three.js inlined, works offline from file://)

---

## 中文

### 這是什麼
在瀏覽器裡用程式即時生成的臺北萬華「艋舺龍山寺」3D 模型，可以自由走動參觀。訪客是一個小方塊。沒有外部模型檔，所有建築、屋頂、剪黏、龍柱、香爐、瀑布都用 Three.js 程式產生。這是**依公開資料重建的非官方近似模型**，不是測繪成果。

### 操作
**電腦**
- `W` `A` `S` `D` 或 `↑` `↓`：移動；`←` `→`（或 `Q` `E`）：轉向
- 滑鼠拖曳：轉視角；第一人稱時點一下畫面可鎖定滑鼠，`Esc` 放開
- 滾輪：縮放（第一人稱時調整視野）
- `Shift`：快走 · `V`：切換第一／第三人稱 · `N`：日／夜 · `M`：地圖 · `L`：語言
- `1`–`8`：跳到景點 · `P` 或 `Esc`：暫停／說明

**手機（直式、橫式皆可）**
- 左半邊拇指：浮動搖桿移動
- 右半邊拖曳：轉視角；雙指開合或右側 ＋／－：縮放；「快走」切換速度
- 上方按鈕：視角、夜景、地圖、前往景點、EN／中、？（暫停說明）

### 景點（靠近時自動顯示說明卡）
1. 山門與淨心瀑布 2. 三川殿與銅鑄龍柱 3. 鐘樓 4. 鼓樓 5. 中庭與香爐 6. 正殿（觀音殿）7. 後殿 8. 藻井（三川殿八卦藻井、正殿螺旋藻井）
左下角是回字形平面小地圖，「前往」選單可直接傳送。

### 細節（第二版）
- 簷下斗栱：三川殿、正殿、後殿的柱頭上加上成排的斗栱。
- 三川殿立面：五個門的門扇半開，畫著門神；石牆下段有石雕裙堵，兩側有石雕圓窗與竹節窗。
- 藻井：三川殿中央八角藻井（32組斗栱層層收頂）；正殿圓形螺旋藻井（直徑約5.82公尺、32組斗栱，螺旋排列）。
- 正殿：觀音菩薩坐在蓮座上、背有光環，兩旁文殊（騎獅）、普賢（騎白象），兩側牆邊各九尊羅漢；前有供桌與花果。
- 後殿：中央媽祖（冠冕垂珠）、東側文昌帝君、西側關聖帝君（紅臉、長鬚），各有侍從與供桌。
- 中庭：供桌上的鮮花、水果、蠟燭，正殿前的拜墊與高燭台；護龍牆面的石雕圓窗。
- 神像、門神與石雕都是簡化的象徵造型，配置方位為推估，不代表寺內實際陳設。

### 模型配置
坐北朝南、面向廣州街：山門（四柱三間、重簷）→ 廟埕（東側瀑布與鯉魚池、西側噴泉水池）→ 三川殿（中央三門＋左右廳各一門，共五門；中門前一對銅鑄龍柱，另有石龍柱；三川脊中段較高）→ 中庭（香爐、供桌）→ 正殿（三間加周圍迴廊共五間、重簷歇山、正面四根石龍柱、高約 13 m）→ 後庭 → 後殿（十一間、重簷歇山）；東西兩側為護龍迴廊，鐘樓（東）與鼓樓（西）為六角重簷、倒 S 曲線的盔頂（轎頂）。

### 準確度說明
- 有出處的：座向、基地面積約 6,149 m²、正殿高約 13 m、五門、銅鑄龍柱、正殿五間、後殿十一間、正殿與後殿重簷歇山、鐘鼓樓六角盔頂、山門 1960 年四柱三間重簷歇山、瀑布位置。詳見 `RESEARCH.md`。
- 推估的：各殿的實際尺寸與柱距、屋瓦顏色、燈籠與香爐的數量位置、剪黏的造型（簡化的龍、寶塔、人物）、周邊街廓。
- 匾額只有「龍山寺」對應真實名稱；「正殿」「鐘樓」「鼓樓」是導覽用標示，不代表實際匾額文字。
- 室內神像、藻井、石雕細節只做象徵性表現。
- 1945 年空襲的日期各來源不一（6 月 8 日或 5 月），說明卡只寫「1945 年」。

### 資料來源
龍山寺官網（lungshan.org.tw，英文介紹與藝術鑑賞頁、林會承講座電子書）、文化部《艋舺龍山寺保存計畫 說明書》、臺北旅遊網、Smithsonian Magazine、中研院研討會參訪頁、Newtalk、Spectral Codex 等。完整網址與對照見 `RESEARCH.md`。

---

## English

### What it is
A walkable, procedurally generated 3D model of Bangka (Mengjia) Longshan Temple in Wanhua, Taipei, running in the browser. You are a small cube. There are no external model files: every hall, roof, porcelain ridge figure, dragon column, incense burner and the waterfall are generated in Three.js code. It is an **approximate, non-official recreation based on public sources**, not survey data.

### Controls
**Desktop**
- `W` `A` `S` `D` or `↑` `↓` to move; `←` `→` (or `Q` `E`) to turn
- Drag the mouse to look; in first person, click to lock the mouse (`Esc` releases it)
- Scroll to zoom (field of view in first person)
- `Shift` walk faster · `V` first/third person · `N` day/night · `M` map · `L` language
- `1`–`8` jump to a spot · `P` or `Esc` pause and help

**Phone (portrait or landscape)**
- Left half: floating thumb stick to move
- Drag on the right half to look; pinch or the + / − buttons to zoom; “Run” toggles speed
- Top buttons: camera, night, map, go to a spot, EN/中, ? (pause and help)

### Hotspots (an info card appears when you are near one)
1. Mountain Gate & Waterfall 2. Front Hall & Bronze Dragon Columns 3. Bell Tower 4. Drum Tower 5. Courtyard & Incense Burner 6. Main Hall (Guanyin) 7. Rear Hall 8. Caisson ceilings (Front Hall octagonal, Main Hall spiral)
The mini-map (bottom left) shows the 回-shaped plan and your position; the “Go to” menu teleports.

### Details (v2)
- Bracket sets (斗栱) along the column heads of the Front, Main and Rear halls.
- Front Hall facade: the five door leaves stand half open with painted door guardians; carved stone dado panels, round and bamboo-joint stone windows.
- Caisson ceilings: the octagonal one over the Front Hall centre (32 bracket sets stepping inward) and the round spiral one in the Main Hall (about 5.82 m across, 32 bracket sets, twisted into a spiral).
- Main Hall: Guanyin seated on a lotus with a halo, flanked by Manjusri on a lion and Samantabhadra on a white elephant, nine arhats along each side wall, and an offering table with flowers and fruit.
- Rear Hall: Mazu in the centre (beaded crown), Wenchang to the east, Guan Yu to the west (red face, long beard), each with attendants and an offering table.
- Courtyard: flowers, fruit and candles on the offering tables, kneeling cushions and tall candle stands before the Main Hall; carved round windows on the wing walls.
- Statues, door guardians and carvings are simplified symbols; their exact placement is approximate and does not reproduce the temple's actual furnishings.

### Layout as modelled
Facing south onto Guangzhou St.: mountain gate (four columns, three bays, double eave) → plaza (waterfall and koi pond to the east, fountain pool to the west) → Front Hall (three central doors plus one in each side hall, five in all; bronze dragon columns at the central door, stone dragon columns beside them; raised centre ridge) → courtyard (incense burner, offering tables) → Main Hall (three bays plus a surrounding corridor, five in all; double-eave hip-and-gable roof; four stone dragon columns; about 13 m high) → rear courtyard → Rear Hall (eleven bays, double-eave hip-and-gable). Covered wing corridors run along the east and west sides, with the Bell Tower (east) and Drum Tower (west): hexagonal, double-eaved, with reversed-S helmet (“sedan-chair”) roofs.

### Accuracy notes
- Sourced: orientation, site area (~6,149 m²), Main Hall height (~13 m), five front doors, the bronze dragon columns, five-bay Main Hall, eleven-bay Rear Hall, double-eave hip-and-gable roofs, hexagonal helmet-roofed towers, the 1960 gate, waterfall position. See `RESEARCH.md`.
- Estimated: real hall dimensions and column spacing, tile colours, number and placement of lanterns and burners, the shapes of the ridge figures (simplified dragons, pagodas, figures), the surrounding city blocks.
- Only the “龍山寺” plaque reflects a real name; “正殿”, “鐘樓” and “鼓樓” are wayfinding labels, not the real plaque texts.
- Statues, caisson ceilings and stone carvings are only suggested.
- Sources disagree on the exact date of the 1945 air raid (8 June or May), so the tour says only “1945”.

### Sources
Lungshan Temple website (lungshan.org.tw: English introduction, art pages, the e-book of Lin Hui-cheng's talk), Ministry of Culture conservation plan for the temple (2022), Taipei Travel, Smithsonian Magazine, the Academia Sinica symposium visitor page, Newtalk, Spectral Codex and others. Full URLs and which fact came from where are in `RESEARCH.md`.

---

### Build / files
- `longshan/head.html`: page shell, CSS and overlays
- `longshan/tour.js`: the tour (geometry, collision, camera, controls, UI)
- `../buildlongshan.py`: concatenates the shell, Three.js r128 and helpers borrowed from Village Siege (`src/2-core.js`, `fps/sprites.js`, `fps3/game3d.js`) into `../longshan-temple-3d.html`
- `ls-test.js`, `ls-walk.js`, `ls-mobile.js`: Playwright checks (`NODE_PATH=$(npm root -g) node ls-walk.js`); screenshots go to `shots/`
