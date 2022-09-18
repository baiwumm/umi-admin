/*
 * @Description: 国际化-表格列表
 * @Version: 2.0
 * @Author: Cyan
 * @Date: 2022-09-02 13:54:14
 * @LastEditors: Cyan
 * @LastEditTime: 2022-09-18 18:44:58
 */
// 引入第三方库
import { FC, useState, useRef } from 'react';
import { useIntl } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components' // antd 高级组件
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ClockCircleOutlined, EditOutlined, DeleteOutlined, DownOutlined, ClusterOutlined } from '@ant-design/icons' // antd 图标库
import { Tag, Space, Button, Modal, message, Dropdown, Menu } from 'antd' // antd 组件库
import moment from 'moment'

// 引入业务组件
import { getInternationalList, delInternational } from '@/services/system/internationalization' // 国际化接口
import FormTemplate from './FormTemplate'  // 表单组件
import { TableItem } from '../utils/interface' //interface 接口
import { formatMessage } from '@/utils' // 引入工具类

const TableTemplate: FC = () => {
    const intl = useIntl();
    const oprationName = formatMessage('global.table.operation')
    // 获取表格实例
    const tableRef = useRef<ActionType>();
    // 获取树形数据传递给drawerForm
    const [treeData, setTreeData] = useState<any>([])
    // 当前行数据
    const [record, setRecord] = useState<TableItem>()
    // 判断是否是添加子级
    const [parent_id, set_parent_id] = useState<string | undefined>('')
    // 手动触发刷新表格
    function reloadTable() {
        tableRef?.current?.reload()
    }
    // 删除列表
    const handlerDelete = async (id: any) => {
        Modal.confirm({
            title: intl.formatMessage({ id: 'global.message.delete.title' }),
            content: intl.formatMessage({ id: 'global.message.delete.content' }),
            onOk: async () => {
                await delInternational(id).then(res => {
                    if (res.resCode === 200) {
                        message.success(res.resMsg)
                        // 刷新表格
                        reloadTable()
                    }
                })
            }
        })

    }
    //    下拉框菜单渲染
    const DropdownMenu = (
        <Menu
            items={[
                {
                    label: <FormTemplate
                        treeData={treeData}
                        reloadTable={reloadTable}
                        parent_id={parent_id}
                        triggerDom={<Button type="text" size="small" icon={<ClusterOutlined />} block>{formatMessage('global.table.operation.add-child')}</Button>}
                    />,
                    key: 'addChild',
                },
                {
                    label: <FormTemplate
                        treeData={treeData}
                        reloadTable={reloadTable}
                        formData={record}
                        triggerDom={<Button type="text" size="small" icon={<EditOutlined />} block>{formatMessage('global.table.operation.edit')}</Button>}
                    />,
                    key: 'edit',
                },
                {
                    label: <Button block type="text" size="small" icon={<DeleteOutlined />} onClick={() => handlerDelete(record?.id)} >{formatMessage('global.table.operation.delete')}</Button>,
                    key: 'delete',
                },
            ]}
        />
    );

    // 操作下拉框
    const dropdownMenuClick = (record: TableItem) => {
        setRecord(record)
        set_parent_id(record?.id)
    }
    /**
* @description: proTable columns 配置项
* @return {*}
* @author: Cyan
*/
    const columns: ProColumns<TableItem>[] = [
        {
            title: formatMessage('pages.setting.internationalization.name'),
            dataIndex: 'name',
            ellipsis: true,
            render: text => <Tag color="success">{text}</Tag>
        },
        {
            title: formatMessage('pages.setting.internationalization.zh-CN'),
            dataIndex: 'zh-CN',
            ellipsis: true,
            hideInSearch: true,
        },
        {
            title: formatMessage('pages.setting.internationalization.en-US'),
            dataIndex: 'en-US',
            ellipsis: true,
            hideInSearch: true,
        },
        {
            title: formatMessage('pages.setting.internationalization.ja-JP'),
            dataIndex: 'ja-JP',
            ellipsis: true,
            hideInSearch: true,
        },
        {
            title: formatMessage('pages.setting.internationalization.zh-TW'),
            dataIndex: 'zh-TW',
            ellipsis: true,
            hideInSearch: true,
        },
        {
            title: formatMessage('global.table.created_time'),
            dataIndex: 'created_time',
            valueType: 'date',
            hideInSearch: true,
            render: text => (
                <Space>
                    <ClockCircleOutlined /><span>{text}</span>
                </Space>
            )
        },
        {
            title: formatMessage('global.table.created_time'),
            dataIndex: 'created_time',
            valueType: 'dateRange',
            hideInTable: true,
            search: {
                transform: (value) => {
                    return {
                        start_time: moment(value[0]._d).format('YYYY-MM-DD 00:00:00'),
                        end_time: moment(value[1]._d).format('YYYY-MM-DD 23:59:59'),
                    };
                },
            },
        },
        {
            title: formatMessage('global.table.operation'),
            valueType: 'option',
            width: 120,
            align: 'center',
            key: 'option',
            render: (_, record) => [
                <Dropdown overlay={DropdownMenu} onOpenChange={() => dropdownMenuClick(record)} key="operation">
                    <Button size="small">
                        {oprationName}
                        <DownOutlined />
                    </Button>
                </Dropdown>
            ]
        },
    ]

    return (
        <ProTable<TableItem>
            actionRef={tableRef}
            columns={columns}
            request={async params => {
                {
                    // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
                    // 如果需要转化参数可以在这里进行修改
                    let result: any = {}
                    await getInternationalList(params).then(res => {
                        result = res
                        setTreeData(result.resData)
                    })
                    return {
                        data: result.resData,
                        // success 请返回 true，
                        // 不然 table 会停止解析数据，即使有数据
                        success: result.resCode === 200,
                        // 不传会使用 data 的长度，如果是分页一定要传
                        total: result.resData?.length,
                    }
                }
            }
            }
            rowKey="id"
            pagination={false}
            // 工具栏
            toolBarRender={() => [
                <FormTemplate treeData={treeData} reloadTable={reloadTable} />
            ]}
        >

        </ProTable>
    )
}
export default TableTemplate