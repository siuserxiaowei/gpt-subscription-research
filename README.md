# AI订阅市场调研

在线网页：https://siuserxiaowei.github.io/gpt-subscription-research/

研究快照日期：2026-10-01（北京时间）。覆盖42个网站入口，32家取得162条当日页面报价，另保留6条旧索引报价供回访。

## 功能

- 按套餐、渠道、商家筛选；按总价或算术月均排序。
- 每家最低报价与全部渠道报价切换；人民币估算价可排除。
- 展开账号条件、支付方式、库存、售后和原始来源。
- 12种公开代理模式、13条推广证据、42站完整目录及已确认的推特主页。
- 可编辑的利润情景、完整报告与Excel下载。

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
- `data/research.json`：公开报价、来源、代理和推广记录。
- `report.html`：完整报告。
- `downloads/price-agency.xlsx`：可筛选工作簿与利润公式。
- `downloads/report.md`：完整报告Markdown。

GitHub Pages从`main`分支根目录发布；`.nojekyll`确保静态文件直接提供。推送页面更新后会重新发布；不会自动刷新调查数据。
