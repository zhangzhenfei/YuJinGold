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
    setInterval(await this.initData, 3000) // 数据5秒更新一次
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
            price = origin + float
          } else {
            price = origin - float
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
              bid_f_style: '',
              bid: calcPrice(map['BID'], m['buyCalc_type'], m['buyCalc_value'], m['decimal']),
              ask_style: '',
              ask_f_style: '',
              ask: calcPrice(map['ASK'], m['saleCalc_type'], m['saleCalc_value'], m['decimal']),
              high: setDecimal(map['HIGH'], m['decimal']),
              low: setDecimal(map['LOW'], m['decimal'])
            }
          }
          return m
        })
        if (this.items.length > 0) {
          const getStyleByPrice = (target, origin) => {
            if (target - origin > 0) {
              return 'up'
            } else if (target - origin < 0) {
              return 'down'
            }
          }
          const calcFontStyle = (target, origin, borderStyle, defaultFontStyle) => {
            // 如果保持不变的话，原来的外框样式就变为文字颜色
            if (target - origin === 0) {
              return borderStyle || defaultFontStyle
            }
          }
          // 计算回购和销售的样式，升显示红色，减显示绿色
          for (const u of updateItems) {
            for (const o of this.items) {
              if (u && o && u.id === o.id) {
                u.bid_f_style = calcFontStyle(u.bid, o.bid, o.bid_style, o.bid_f_style)
                u.ask_f_style = calcFontStyle(u.ask, o.ask, o.ask_style, o.ask_f_style)
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
      <img class="logo" src="../../../assets/img/header.jpg" alt="">
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
            <li :class="item.bid_style">
              <transition name="fade">
                <span :class="item.bid_f_style">{{ item.bid }}</span>
              </transition>
            </li>
            <li :class="item.ask_style">
              <transition name="fade">
                <span :class="item.ask_f_style">{{ item.ask }}</span>
              </transition>
            </li>
            <li>
              <p> {{ item.high }} </p>
              <p> {{ item.low }} </p>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="footer">
      <p>御锦贵金属服务热线：
        <span>0759-6688588</span>
      </p>
    </div>
  </div>
</template>

<style lang="scss">
$color-red: red;
$color-green: rgb(0, 222, 68);
$color-gold:#FFCA28;
$color-white: #fff;
$color-black: #000;
$color-gray:#222;

html,
body {
  background: $color-black;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s
}

.fade-enter,
.fade-leave-to {
  opacity: 0
}

.grid-row {
  padding: 1em;
  li {
    flex: 1;
    text-align: center;
    font-size: 1.8em;
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
  &>.header {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    padding: 1em;
    background: $color-white;
    .logo {
      width: 100%;
      height: auto;
    }
  }
  .date-info {
    p {
      text-align: right;
      padding-right: 1em;
      font-size: 1.4em;
      color: $color-red;
    }
  }
  .data-grid {
    .header {
      display: flex;
      font-size: 1em;
      color: $color-white;
      background-color: $color-gray;
    }
    .grid {
      padding: 0;
      .row {
        display: flex;
        align-items: center;
        color: $color-green;
        border-bottom: 1px solid $color-gray;
        .up {
          span {
            padding: .5em .5em;
            color: #FFF;
            border-radius: 2px;
            background: $color-red;
          }
        }
        .down {
          span {
            padding: .5em .5em;
            color: $color-white;
            border-radius: 2px;
            background: $color-green;
          }
        }
        li {
          span {
            transition: all .5s;
            &.up {
              color: $color-red;
            }
            &.down {
              color: $color-green;
            }
          }
          p {
            margin: 0;
          }
        }
        li:nth-child(1) {
          color: $color-gold;
        }
        li:not(:first-child) {
          font-weight: 500;
        }
      }
    }
  }
  .footer {
    font-size: 1.8em;
    color: $color-white;
    text-align: center;
    padding-bottom: .5em;
    p {
      margin: 0;
      padding: .2em 0;
      span {
        color: $color-gold;
        border-bottom: $color-gold 1px solid;
      }
    }
  }
}
</style>

