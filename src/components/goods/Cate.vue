<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类
                    </el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <tree-table class="treeTable" :data="catelist" :columns="columns"
                :selection-type="false" :expand-type="false" show-index
                index-text="#" border>
                <!-- 是否有效 -->
                <template v-slot:isok="scope">
                    <i class="el-icon-success"
                        v-if="scope.row.cat_deleted === false"
                        style="color:lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color:red;"></i>
                </template>
                <!-- 排序 -->
                <template v-slot:order="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级
                    </el-tag>
                    <el-tag type="success" size="mini"
                        v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template>
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">
                        删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%"
            @close="addCateDialogClosed">
            <!-- 添加分类表单 -->
            <el-form :model="addCateForm" :rules="addCateFormRules"
                ref="addCateFormRef" label-width="100px">
                <el-form-item label="活动名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!-- options 用来指定数据源 -->
                    <el-cascader v-model="selectedKeys"
                        :options="parentCateList" :props="cascaderProps"
                        @change="parentCatChanged" clearable>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定
                </el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
export default {
    data() {
        return {
            // 查询条件
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 商品分类的数据列表，默认为空
            catelist: [],
            // 总数据条数
            total: 0,
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    // 表示将当前列定义为模版列
                    type: 'template',
                    // 表示当前列使用模版名称
                    template: 'isok'
                },
                {
                    label: '排序',
                    // 表示将当前列定义为模版列
                    type: 'template',
                    // 表示当前列使用模版名称
                    template: 'order'
                },
                {
                    label: '操作',
                    // 表示将当前列定义为模版列
                    type: 'template',
                    // 表示当前列使用模版名称
                    template: 'opt'
                }
            ],
            // 控制添加分类对话框的显示与隐藏
            addCateDialogVisible: false,
            // 添加分类的表单数据对象
            addCateForm: {
                // 将要添加的分类的名称
                cat_name: '',
                // 父级分类的id
                cat_pid: 0,
                // 分类的等级默认要添加的1级分类
                cat_level: 0
            },
            // 添加分类表单的验证规则对象
            addCateFormRules: {
                cat_name: [
                    {
                        required: true,
                        message: '请输入分类的名称',
                        trigger: 'blur'
                    }
                ]
            },
            // 父级分类的列表
            parentCateList: [],
            // 指定联级选择器的配置对象
            cascaderProps: {
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                checkStrictly: true
            },
            // 选中的父级分类的id数组
            selectedKeys: []
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get('categories', {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类失败')
            }
            // 把数据列表赋值
            this.catelist = res.data.result
            this.total = res.data.total
        },
        // 监听 pagesize 改变
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        // 监听 pagenum 的改变
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        showAddCateDialog() {
            // 先获取父级分类的列表
            this.getParentCateList()
            // 再展示出对话框
            this.addCateDialogVisible = true
        },
        async getParentCateList() {
            const { data: res } = await this.$http.get('categories', {
                params: { type: 2 }
            })

            if (res.meta.status !== 200) {
                return this.$message.error('获取父级分类数据失败')
            }
            this.parentCateList = res.data
        },
        // 选择项发生变化触发这个函数
        parentCatChanged() {
            console.log(this.selectedKeys)
            if (this.selectedKeys.length > 0) {
                // 父级分类的id
                this.addCateForm.cat_pid = this.selectedKeys[
                    this.selectedKeys.length - 1
                ]
                // 为当前分类的等级赋值
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            } else {
                this.addCateForm.cat_pid = 0
                // 为当前分类的等级赋值
                this.addCateForm.cat_level = 0
            }
        },
        // 点击按钮，舔加新的分类
        addCate() {
            this.$refs.addCateFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post(
                    'categories',
                    this.addCateForm
                )
                if (res.meta.status !== 201) {
                    return this.$message.error('添加分类失败')
                }

                this.$message.success('添加分类成功')
                this.getCateList()
                this.addCateDialogVisible = false
            })
        },
        // 监听对话框的关闭事件，重置表单数据
        addCateDialogClosed() {
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        }
    }
}
</script>

<style lang='less' scoped>
.treeTable {
    margin-top: 15px;
}
.el-cascader {
    width: 100%;
}
</style>
