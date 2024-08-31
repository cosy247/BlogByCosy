---
{
  shadowPassword: "qeqe",
  motto: [
    ["我不吃牛肉。", "I don't eat beef."],
    ["他走了，像是下定了某种决心。", "He left, as if he had made up his mind."],
    ["耐心是人生的关键。", "Patience is the key in life."],
  ],
  links:
    [
      { name: "&#xe673;github", href: "https://github.com/cosy247" },
      { name: "&#xe600;邮箱", href: "http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=al1aX1tTXlxdWSobG0QJBQc" },
    ],
  alones:
    [
      { name: "Sevg", url: "https://cosy247.top/sevg", icon: "assets/README/Sevg.png" },
      { name: "DrinkWater", url: "https://github.com/cosy247/DrinkWater", icon: "assets/README/DrinkWater.png" },
      {
        name: "VsBackground",
        url: "https://marketplace.visualstudio.com/items?itemName=cosy247.vsBackground",
        icon: "assets/README/VsBackground.png",
      },
    ],
  blogFriends:
    [{ name: "DrinkWater", url: "https://github.com/cosy247/DrinkWater", icon: "assets/README/DrinkWater.png" }],
}
---

::: tip warning  
自定义警告  
:::

::: version  
node 18.16.0  
npm 6.7.1  
:::

::: echarts A Radar Chart

```json
{
  "legend": {
    "data": ["Allocated Budget", "Actual Spending"]
  },
  "radar": {
    "indicator": [
      { "name": "Sales", "max": 6500 },
      { "name": "Administration", "max": 16000 },
      { "name": "Information Technology", "max": 30000 },
      { "name": "Customer Support", "max": 38000 },
      { "name": "Development", "max": 52000 },
      { "name": "Marketing", "max": 25000 }
    ]
  },
  "series": [
    {
      "name": "Budget vs spending",
      "type": "radar",
      "data": [
        {
          "value": [4200, 3000, 20000, 35000, 50000, 18000],
          "name": "Allocated Budget"
        },
        {
          "value": [5000, 14000, 28000, 26000, 42000, 21000],
          "name": "Actual Spending"
        }
      ]
    }
  ]
}
```
