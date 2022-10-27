/*
 * @Description: 查询菜单管理列表参数 Dto
 * @Version: 2.0
 * @Author: Cyan
 * @Date: 2022-10-27 11:33:13
 * @LastEditors: Cyan
 * @LastEditTime: 2022-10-27 11:35:25
 */
import { ApiProperty } from '@nestjs/swagger';

export class ListMenuManagementDto {
  @ApiProperty({
    type: String,
    description: '菜单类型',
    default: 'menu',
    required: false,
  })
  menu_type?: string;

  @ApiProperty({
    type: Number,
    description: '菜单状态',
    enum: [0, 1],
    default: 1,
    required: false,
  })
  status?: number;

  @ApiProperty({
    type: Boolean,
    description: '如果是查询菜单权限的，过滤掉重定向有值的数据',
    default: false,
    required: false,
  })
  isPremission?: boolean;

  @ApiProperty({
    type: Date,
    description: '开始日期',
    default: '2022-10-01 00:00:00',
    required: false,
  })
  start_time?: Date;

  @ApiProperty({
    type: Date,
    description: '结束日期',
    default: '2022-10-02 23:59:59',
    required: false,
  })
  end_time?: Date;
}
