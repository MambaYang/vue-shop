<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search">
                        </el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 订单列表数据 -->
            <el-table :data="orderlist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="order_number" label="订单编号" width="195px">
                </el-table-column>
                <el-table-column prop="order_price" label="订单价格">
                </el-table-column>
                <el-table-column prop="pay_status" label="是否付款">
                    <template v-slot:status="scope">
                        <el-tag type="success"
                            v-if="scope.row.pay_status ==='1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货">
                </el-table-column>
                <el-table-column prop="create_time" label="下单时间">
                    <template v-slot:default="scope">
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template>
                        <el-button type="primary" icon="el-icon-edit"
                            size="mini" @click="showBox"></el-button>
                        <el-button type="success" icon="el-icon-location"
                            size="mini" @click="showProgressBox"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 修改地址的对话框 -->
        <el-dialog title="修改地址" :visible.sync="adressVisible" width="50%"
            @close="addressDialogClosed">
            <span>
                <el-form :model="adressForm" :rules="adressFormRules"
                    ref="adressFormRef" label-width="100px"
                    class="demo-ruleForm">
                    <el-form-item label="省市区/县" prop="adress1">
                        <el-cascader :options="cityData"
                            v-model="adressForm.adress1"></el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="adress2">
                        <el-input v-model="adressForm.adress2"></el-input>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定
                </el-button>
            </span>
        </el-dialog>

        <!-- 物流进度的对话框 -->
        <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
            <!-- 时间线 -->
            <el-timeline>
                <el-timeline-item v-for="(activity, index) in progressInfo"
                    :key="index" :timestamp="activity.time">
                    {{activity.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
import cityData from './citydata.js'
export default {
    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            total: 0,
            orderlist: [],
            // 显示修改地址对话框
            adressVisible: false,
            // 展示物流进度对话框
            progressVisible: false,
            adressForm: {
                adress1: [],
                adress2: ''
            },
            adressFormRules: {
                adress1: [
                    {
                        required: true,
                        message: '请输入省市区县',
                        trigger: 'blur'
                    }
                ],
                adress2: [
                    {
                        required: true,
                        message: '请输入详细地址',
                        trigger: 'blur'
                    }
                ]
            },
            cityData,
            // 物流进度
            progressInfo: []
        }
    },
    created() {
        this.getOrderList()
    },
    methods: {
        async getOrderList() {
            const { data: res } = await this.$http.get('orders', {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) {
                return this.$message.error('获取订单列表失败')
            }
            this.total = res.data.total
            this.orderlist = res.data.goods
            console.log(this.orderlist)
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getOrderList()
        },
        // 展示修改地址的对话框
        showBox() {
            this.adressVisible = true
        },
        addressDialogClosed() {
            this.$refs.adressFormRef.resetFields()
        },
        async showProgressBox() {
            const { data: res } = await this.$http.get(
                '/kuaidi/804909574412544580'
            )
            if (res.meta.status !== 200) {
                this.$message.error('获取物流进度失败')
            }
            this.progressInfo = res.data
            this.progressVisible = true
        }
    }
}
</script>

<style lang='less' scoped>
.el-cascader {
    width: 100%;
}
</style>
