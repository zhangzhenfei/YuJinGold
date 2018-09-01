<script>
import { find, delMarketGold } from '@/api/market-center'

export default {
  data () {
    return {
      routes: [
        { title: '主页', to: { name: 'Admin' } },
        { title: '行情中心', to: { name: 'MarketCenterDefault' } }
      ],
      loading: false,
      items: [],
      headers: [
        { text: '品类名称', sortable: false, value: 'type', align: 'left' },
        { text: '所属来源', sortable: false, value: 'source_name', align: 'left' },
        { text: '回购计算方式', sortable: false, value: 'buyCalc', align: 'left' },
        { text: '销售计算方式', sortable: false, value: 'saleCalc', align: 'left' },
        { text: '排序编号', sortable: false, value: 'order', align: 'left' },
        { text: '是否显示', sortable: false, value: 'visible', align: 'left' },
        { text: '小数位', sortable: false, value: 'decimal', align: 'left' },
        { text: '', sortable: false, value: 'operate', align: 'center' }
      ],
      deleteId: '',
      dialog: false,
      dialogTitle: '提示',
      dialogText: ''
    }
  },
  async created () {
    this.query()
  },
  methods: {
    async query () {
      this.loading = true
      const caclMap = { 0: '-', 1: '+' }
      const { data } = await find()
      this.items = data.map(e => {
        return {
          ...e,
          buyCalc: caclMap[e.buyCalc_type] + e.buyCalc_value,
          saleCalc: caclMap[e.saleCalc_type] + e.saleCalc_value
        }
      })
      this.loading = false
    },
    addAcitvity () {
      this.$router.push({ name: 'MarketCenterEdit' })
    },
    deleteDialog (item) {
      this.deleteId = item.id
      this.dialog = true
      this.dialogText = `是否确认行情配置：【${item.type}】？`
    },
    async dialogConfirm () {
      this.dialog = false
      await delMarketGold(this.deleteId)
      this.query()
    }
  }
}
</script>


<template>
  <v-layout row
            wrap>
    <v-flex xs12>
      <v-breadcrumbs divider="/">
        <v-breadcrumbs-item v-for="route in routes"
                            :to="route.to"
                            :key="route.title">
          {{ route.title }}
        </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-flex>
    <v-flex xs12>
      <v-card>
        <v-container fluid>
          <v-layout row
                    wrap
                    justify-start
                    align-baseline>
            <v-spacer></v-spacer>
            <v-btn @click.native.stop="addAcitvity"
                   class="secondary white--text">新增
              <v-icon dark
                      right>add_circle</v-icon>
            </v-btn>
          </v-layout>
          <v-layout>
            <v-data-table :loading="loading"
                          :headers="headers"
                          :items="items"
                          no-data-text="找不到数据"
                          no-results-text="无匹配数据"
                          hide-actions
                          class="operate">
              <template slot="items"
                        slot-scope="props">
                <td class="text-xs-left">{{ props.item.type }}</td>
                <td class="text-xs-left">{{ props.item.source_name }}</td>
                <td class="text-xs-left">{{ props.item.buyCalc }}</td>
                <td class="text-xs-left">{{ props.item.saleCalc }}</td>
                <td class="text-xs-left">{{ props.item.order }}</td>
                <td class="text-xs-left">{{ props.item.visible }}</td>
                <td class="text-xs-left">{{ props.item.decimal }}</td>
                <td class="text-xs-right">
                  <v-btn icon
                         :to="{ name: 'MarketCenterEdit', params: { id: props.item.id }}">
                    <v-icon class="blue-grey--text">edit</v-icon>
                  </v-btn>
                  <v-btn icon
                         @click.native.stop="deleteDialog(props.item)">
                    <v-icon class="deep-orange--text">delete_forever</v-icon>
                  </v-btn>
                </td>
              </template>
            </v-data-table>
          </v-layout>
        </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-layout row
                justify-center>
        <v-dialog v-model="dialog"
                  persistent>
          <v-card>
            <v-card-title class="headline">{{ dialogTitle }}</v-card-title>
            <v-card-text>{{ dialogText }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="red--text darken-1"
                     flat="flat"
                     @click.native="dialogConfirm">确认</v-btn>
              <v-btn class="green--text"
                     flat="flat"
                     @click.native="dialog = false">取消
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<style lang="scss" scoped>
.operate a,
button {
  margin: 0;
}
</style>
