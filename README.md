# AI订阅研究：市场调研与经营案例

在线网页：https://siuserxiaowei.github.io/gpt-subscription-research/

一个入口查看价格、代理、推广、利润情景和经营者案例。

| 栏目 | 内容 | 在线入口 |
|---|---|---|
| 市场调研 | 42个网站入口，32家取得162条当日页面报价，另保留6条旧索引报价供回访 | [打开市场调研](https://siuserxiaowei.github.io/gpt-subscription-research/) |
| 经营案例 | 七位经营者、六种模式对照、66条流程观察和71个来源链接 | [打开经营案例](https://siuserxiaowei.github.io/gpt-subscription-research/casebook/) |
| 企业优势 | 上游供给、下游销售与企业服务的价值清单 | [打开企业优势](https://siuserxiaowei.github.io/gpt-subscription-research/enterprise-advantages.html) |

市场报价快照日期：2026-10-01（北京时间）；经营案例资料截至2026-09-30，整理于2026-10-01。合并不会更新这些资料日期。

## 功能

- 按套餐、渠道、商家筛选；按总价或算术月均排序。
- 每家最低报价与全部渠道报价切换；人民币估算价可排除。
- 展开账号条件、支付方式、库存、售后和原始来源。
- 12种公开代理模式、13条推广证据、42站完整目录及已确认的推特主页。
- 可编辑的利润情景、完整报告与Excel下载。
- 经营者的起步、获客、代理合作、交付、售后与续费路径，以及模式对照和原帖检索表。

价格与政策不是实时数据；本次未付款、试充或验证供应渠道资金。商家销量、利润、播放量等自报不等于经审计数据。网站不提供交易或充值服务。

## 本地预览

纯静态HTML、CSS和JavaScript，无需安装依赖：

```sh
python3 -m http.server 8080
```

打开 http://localhost:8080 。通过HTTP提供页面，确保浏览器可以加载JSON数据。

## 文件

- `index.html`：研究看板。
- `styles.css`、`app.js`：布局与筛选逻辑。
- `site-nav.css`：各栏目共用的站点导航样式。
- `casebook/`：经营案例栏目，保留原页面、样式、脚本与说明。
- `enterprise-advantages.html`：企业服务优势清单。
- `data/research.json`：公开报价、来源、代理和推广记录。
- `report.html`：完整报告。
- `downloads/price-agency.xlsx`：可筛选工作簿与利润公式。
- `downloads/report.md`：完整报告Markdown。
- `MIGRATION.json`：原案例仓库、导入提交与新旧网页入口。

GitHub Pages从`main`分支根目录发布；`.nojekyll`确保静态文件直接提供。推送页面更新后会重新发布；不会自动刷新调查数据。

## 案例仓库合并记录

2026-10-02 将 [ai-subscription-casebook](https://github.com/siuserxiaowei/ai-subscription-casebook) 通过未压缩历史的 `git subtree` 导入 `casebook/`，原提交 `a0695ca72c4a961567a069fd840b84b26702c91e` 保留在本仓库历史中。案例正文与原帖链接保留，调整了导航、标题、品牌样式和规范网址。

后续案例内容在本仓库的 `casebook/` 更新。原案例网页作为新栏目的跳转入口，继续兼容已有分享链接及章节锚点。
