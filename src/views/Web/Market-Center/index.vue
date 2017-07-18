<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import axios from '@/plugins/axios-view'
import 'normalize.css'
import '@/assets/css/index.css'

moment.locale('zh-cn')

export default {
  data() {
    return {
      items: [],
      now: '',
      headers: [
        '品类', '回购', '销售', '最高/最低'
      ]
    }
  },
  async created() {
    await this.initData()
    setInterval(await this.initData, 5000) // 数据5秒更新一次
    this.updateNow()
    setInterval(this.updateNow, 1000) // 时间1秒更新一次
  },
  methods: {
    updateNow() {
      this.now = moment().format('LL LTS')
    },
    async initData() {
      const sourceMap = {}
      const [{ data: markets }, { data: sources }] = await Promise.all([axios.post('/view/market-center/find'), axios.post('/view/market-center/fetchSources')])
      // 先把来源设置的数据转换为对象，key为ID
      if (sources && sources.length > 0) {
        sources.forEach(s => {
          if (s && s.length > 0) {
            s.forEach(m => {
              sourceMap[m['ID']] = m
            })
          }
        })
      }
      // 遍历市场数据，根据来源设置其回购和销售的价格
      if (markets && markets.length > 0) {
        const setDecimal = (price, decimal) => {
          return parseFloat(price).toFixed(decimal)
        }
        const calcPrice = (origin, type, float, decimal) => {
          let price
          origin = parseFloat(origin)
          float = parseFloat(float)
          decimal = parseInt(decimal)
          if (type) {
            price = origin - float
          } else {
            price = origin + float
          }
          return price.toFixed(decimal)
        }
        const updateItems = markets.map(m => {
          const map = sourceMap[m['source_id']]
          if (map) {
            return {
              id: m['id'],
              type: m.type,
              bid_origin: map['BID'],
              ask_origin: map['ASK'],
              bid_style: '',
              bid: calcPrice(map['BID'], m['saleCalc_type'], m['saleCalc_value'], m['decimal']),
              ask_style: '',
              ask: calcPrice(map['ASK'], m['buyCalc_type'], m['buyCalc_value'], m['decimal']),
              high: setDecimal(map['HIGH'], m['decimal']),
              low: setDecimal(map['LOW'], m['decimal'])
            }
          }
        })
        if (this.items.length > 0) {
          const getStyleByPrice = (target, origin) => {
            if (target - origin > 0) {
              return 'up'
            } else if (target - origin < 0) {
              return 'down'
            }
          }
          // 计算回购和销售的样式，升显示红色，减显示绿色
          for (const u of updateItems) {
            for (const o of this.items) {
              if (u.id === o.id) {
                u.bid_style = getStyleByPrice(u.bid, o.bid)
                u.ask_style = getStyleByPrice(u.ask, o.ask)
                break
              }
            }
          }
        }
        this.items = updateItems
      }
    }
  }
}
</script>

<template>
  <div class="content">
    <section class="header">
      <h1>御锦黄金</h1>
      <div class="desc">
        <div>行业领先的贵金属</div>
        <div>珠宝综合交易平台</div>
      </div>
    </section>
    <div class="date-info">
      <p>{{ now }} 开盘</p>
    </div>
    <div class="data-grid">
      <ul class="header grid-row">
        <li v-for="h in headers" :key="h"> {{ h }} </li>
      </ul>
      <ul class="grid">
        <li v-for="item in items" :key="item.id">
          <ul class="row grid-row">
            <li>{{ item.type }}</li>
            <li :class="item.bid_style">{{ item.bid }}</li>
            <li :class="item.ask_style">{{ item.ask }}</li>
            <li>
              <p> {{ item.high }} </p>
              <p> {{ item.low }} </p>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="footer">
      <p>上述行情仅供参考！我们尽力提供准确有效的实时行情</p>
    </div>
  </div>
</template>

<style lang="scss">
html,
body {
  background: #263238;
}

.grid-row {
  padding: 1em;
  li {
    width: 25%;
    text-align: right;
    font-size: 1.3em;
  }
  li:nth-child(1) {
    text-align: center;
  }
}

.content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  color: #BDBDBD;
  &>.header {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-end;
    padding: 1em;
    background: #fff;
    h1 {
      font-size: 3.5em;
      color: #FFCA28;
      margin: 0;
    }
    .desc {
      display: flex;
      font-size: 1.5em;
      flex-direction: column;
      padding: 0 0 .2em 1.5em;
    }
  }
  .date-info {
    p {
      text-align: right;
      padding-right: 1em;
      font-size: 1.3em;
      color: #FF5252;
    }
  }
  .data-grid {
    .header {
      display: flex;
      background-color: #37474F;
    }
    .grid {
      padding: 0 0 4em 0;
      .row {
        display: flex;
        align-items: center;
        color: #18FFFF;
        border-bottom: 1px solid #37474F;
        .up {
          color: #FF5252;
        }
        .down {
          color: #4caf50;
        }
        li p {
          margin: 0;
        }
        li:nth-child(1) {
          color: #FFCA28;
        }
      }
    }
  }
  .footer {
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4em;
    background: #263238;
    font-size: 1.2em;
    padding: 1em;
  }
}
</style>

