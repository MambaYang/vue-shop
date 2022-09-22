<template>
    <el-container>
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="" />
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主题区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单区域 -->
                <el-menu background-color="#333744" text-color="#fff"
                    active-text-color="#409bff" unique-opened
                    :collapse="isCollapse" :collapse-transition="false" router
                    :default-active="activePath">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for="item in menulist"
                        :key="item.id">
                        <template slot="title">
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 菜单文本 -->
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subItem.path"
                            v-for="subItem in item.children" :key="subItem.id"
                            @click="saveNavState('/' + subItem.path)">
                            <template>
                                <i class="el-icon-menu"></i>
                                <!-- 菜单文本 -->
                                <span>{{ subItem.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    created() {
        this.getMenuList()
        // 刷新页面重新赋值给 activePath
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    data() {
        return {
            menulist: [],
            iconsObj: {
                '125': 'el-icon-s-custom',
                '103': 'el-icon-star-on',
                '101': 'el-icon-s-goods',
                '102': 'el-icon-s-order',
                '145': 'el-icon-s-data'
            },
            // 是否折叠
            isCollapse: false,
            // 被激活的连接地址
            activePath: ''
        }
    },
    methods: {
        logout() {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        async getMenuList() {
            const { data: res } = await this.$http.get('menus')
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.menulist = res.data
        },
        toggleCollapse() {
            // 点击按钮，切换菜单折叠与展开
            this.isCollapse = !this.isCollapse
        },
        saveNavState(activePath) {
            // 保持连接的激活状态
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
        }
    }
}
</script>

<style lang="less" scoped>
.el-container {
    height: 100%;
}
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 18px;
    div {
        height: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        img {
            height: 100%;
        }
        span {
            margin-left: 15px;
        }
    }
    box-sizing: border-box;
}
.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color: #eaedf1;
}

.toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
