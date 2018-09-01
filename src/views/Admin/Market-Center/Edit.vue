<script>
import UUID from 'uuidjs'
import forEach from 'lodash/forEach'
import { find, fetchSources, addMarketGold } from '@/api/market-center'

export default {
  created () {
    this.initSources()
    // 如果id存在进入编辑模式，否则进入新增模式
    const id = this.$route.params.id
    let routeTitle = '新增'
    if (id) {
      routeTitle = '编辑'
      this.loadMarketGold(id)
    }
    this.routes[2].title = routeTitle
  },
  data () {
    return {
      loading: false,
      routes: [
        { title: '主页', to: { name: 'Admin' } },
        { title: '行情中心', to: { name: 'MarketCenterDefault' } },
        { title: '', to: { name: 'MarketCenterEdit' } }
      ],
      // 表单模型
      form: {
        id: UUID.genV1().hexNoDelim, // id主键
        type: '', // 品类名称
        source_id: '', // 所属来源id（api中的ID字段）
        source_name: '', // 来源名字
        buyCalc_type: 1, // 回购计算方式（0：减，1：加）
        buyCalc_value: 0, // 回购计算方式值
        saleCalc_type: 1, // 销售计算方式（0：减，1：加）
        saleCalc_value: 0, // 销售计算方式值
        order: '', // 排序编号
        visible: 1, // 是否显示（0：首页不显示，1：首页显示）
        decimal: 2, // 小数位
        remark: '' // 备注
      },
      sources: [], // 从api中统计
      buyCalc_types: [{ text: '加', value: 1 }, { text: '减', value: 0 }],
      saleCalc_types: [{ text: '加', value: 1 }, { text: '减', value: 0 }],
      visibles: [{ text: '隐藏', value: 0 }, { text: '显示', value: 1 }],
      // 表单校验模型
      rules: {
        type: [],
        source_id: [],
        order: [],
        decimal: []
      },
      snackbar: false,
      snackbarText: ''
    }
  },
  methods: {
    sourceInputHandle (input) {
      const target = this.sources.find(function (v) {
        return '' + v.value === '' + input
      })
      if (target && target.text) {
        this.form.source_name = target.text
      }
    },
    async loadMarketGold (id) {
      const { data } = await find({ id })
      const model = data[0]
      delete model._id
      this.form = data[0]
    },
    async initSources () {
      const { data } = await fetchSources()
      const sources = []
      for (const goldGroup of data) {
        for (const gold of goldGroup) {
          sources.push({ text: gold['SNAME'], value: gold['ID'] })
        }
      }
      this.sources = sources
    },
    async saveEdit () {
      const valid = await this.$validator.validateAll()
      if (!valid) return
      this.loading = true
      const { data } = await addMarketGold(this.form)
      this.snackbar = true
      this.snackbarText = data.success ? '保存成功' : '保存失败'
      this.loading = false
    },
    goBack () {
      this.$router.back()
    }
  },
  watch: {
    vErrors: {
      handler: function (val, oldVal) {
        forEach(this.rules, (val, key) => {
          this.rules[key] = [() => (this.vErrors.has(key) ? this.vErrors.first(key) : true)]
        })
      },
      deep: true
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
    <v-flex xs12
            class="content">
      <v-card class="elevation-0">
        <v-card-title primary-title>
          <h3 class="headline">品类名称：{{ form.type}}</h3>
        </v-card-title>
        <v-container fluid>
          <v-layout row
                    wrap>
            <v-flex xs12
                    sm10
                    md8>
              <form @submit.prevent="saveEdit"
                    novalidate>
                <v-layout row
                          wrap>
                  <v-flex xs12
                          sm6>
                    <v-text-field v-model="form.type"
                                  counter
                                  max="20"
                                  data-vv-name="type"
                                  label="品类名称"
                                  data-vv-as="品类名称"
                                  :rules="rules.type"
                                  v-validate="'required'"
                                  required></v-text-field>
                  </v-flex>
                  <v-flex xs12
                          sm6>
                    <v-select :items="sources"
                              data-vv-name="source_id"
                              data-vv-as="所属来源"
                              :rules="rules.source_id"
                              v-model="form.source_id"
                              @input="sourceInputHandle"
                              label="所属来源"
                              item-text="text"
                              item-value="value"
                              v-validate="'required'"
                              required></v-select>
                  </v-flex>
                </v-layout>
                <v-layout row
                          wrap
                          justify-start
                          align-baseline>
                  <span>回购计算方式：</span>
                  <v-btn-toggle mandatory
                                :items="buyCalc_types"
                                v-model="form.buyCalc_type"
                                class="pr-3"></v-btn-toggle>
                  <v-text-field type="number"
                                class="pl-3"
                                v-model.number="form.buyCalc_value"
                                setp="0.01">
                  </v-text-field>
                </v-layout>
                <v-layout row
                          wrap
                          justify-start
                          align-baseline>
                  <span>销售计算方式：</span>
                  <v-btn-toggle mandatory
                                :items="saleCalc_types"
                                v-model="form.saleCalc_type"
                                class="pr-3"></v-btn-toggle>
                  <v-text-field type="number"
                                class="pl-3"
                                v-model.number="form.saleCalc_value"
                                setp="0.01">
                  </v-text-field>
                </v-layout>
                <v-layout row
                          wrap>
                  <v-flex xs12
                          sm6>
                    <v-text-field type="number"
                                  data-vv-name="order"
                                  data-vv-as="排序"
                                  :rules="rules.order"
                                  label="排序"
                                  v-model.number="form.order"
                                  v-validate="'required'"
                                  required>
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12
                          sm6>
                    <v-text-field type="number"
                                  data-vv-name="decimal"
                                  data-vv-as="小数位"
                                  :rules="rules.decimal"
                                  label="小数位"
                                  v-model.number="form.decimal"
                                  v-validate="'required'"
                                  required>
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row
                          wrap
                          justify-start
                          align-baseline>
                  <span>首页显示：</span>
                  <v-btn-toggle mandatory
                                :items="visibles"
                                v-model="form.visible"
                                class="pr-3"></v-btn-toggle>
                </v-layout>
                <v-layout row
                          wrap>
                  <v-flex xs12>
                    <v-text-field v-model="form.remark"
                                  multi-line
                                  counter
                                  max="200"
                                  data-vv-name="remark"
                                  label="备注"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row
                          wrap>
                  <v-flex xs6
                          sm3>
                    <v-btn primary
                           :loading="loading"
                           dark
                           block
                           type="submit">保存
                      <v-icon right
                              dark>save</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex xs6
                          sm3>
                    <v-btn block
                           dark
                           secondary
                           @click.native="goBack">返回
                      <v-icon right
                              dark>keyboard_return</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
      <v-snackbar secondary
                  right
                  v-model="snackbar">
        {{ snackbarText }}
        <v-btn light
               flat
               @click.native="snackbar = false">
          <v-icon light>close</v-icon>
        </v-btn>
      </v-snackbar>
    </v-flex>
  </v-layout>
</template>

<style lang="scss" scoped>
.operate {
  cursor: pointer;
}

.appbar-title {
  padding-left: 1em;
}
</style>
