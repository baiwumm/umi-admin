/*
 * @Description: Organization Controller
 * @Version: 2.0
 * @Author: Cyan
 * @Date: 2022-10-19 11:19:47
 * @LastEditors: Cyan
 * @LastEditTime: 2022-10-20 18:11:18
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  Param,
} from '@nestjs/common';
import { OrganizationService } from './organization.service'; // Organization Service
import {
  ApiBearerAuth,
  ApiTags,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'; // swagger 接口文档
import { ResData, ResponseModel } from '@/common/interface'; // TS类型注解
import { ResponseDto } from '@/dto/response.dto'; // 响应体 Dto
import {
  ListOrganizationDto,
  ResponseOrganizationDto,
  SaveOrganizationDto,
} from './dto';

/* swagger 文档 */
@ApiTags('智能行政-组织管理')
@ApiHeader({
  name: 'Authorization',
  required: true,
  description: 'token令牌',
})
@ApiBearerAuth()
@Controller('administrative/organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  /**
   * @description: 获取国际化列表
   * @return {*}
   * @author: Cyan
   */
  @Get()
  @ApiOkResponse({ type: ResponseOrganizationDto })
  @ApiOperation({ summary: '获取组织管理列表' })
  async getInternationalList(
    @Query() organizationInfo: ListOrganizationDto,
  ): Promise<ResponseModel> {
    const response = await this.organizationService.getOrganizationList(
      organizationInfo,
    );
    return { data: response };
  }

  /**
   * @description: 创建组织数据
   * @return {*}
   * @author: Cyan
   */
  @Post()
  @ApiOkResponse({ type: ResponseDto })
  @ApiOperation({ summary: '创建组织数据' })
  async createOrganization(
    @Body() organizationInfo: SaveOrganizationDto,
  ): Promise<ResponseModel<ResData>> {
    const response = await this.organizationService.createOrganization(
      organizationInfo,
    );
    return response;
  }

  /**
   * @description: 更新国际化数据
   * @return {*}
   * @author: Cyan
   */
  @Put('/:org_id')
  @ApiOkResponse({ type: ResponseDto })
  @ApiOperation({ summary: '更新国际化数据' })
  async updateOrganization(
    @Param('org_id') org_id: string,
    @Body() organizationInfo: SaveOrganizationDto,
  ): Promise<ResponseModel<ResData>> {
    const response = await this.organizationService.updateOrganization(
      org_id,
      organizationInfo,
    );
    return response;
  }

  /**
   * @description: 删除组织数据
   * @return {*}
   * @author: Cyan
   */
  @Delete('/:org_id')
  @ApiOkResponse({ type: ResponseDto })
  @ApiOperation({ summary: '删除组织数据' })
  async deleteInternational(
    @Param('org_id') org_id: string,
  ): Promise<ResponseModel<ResData>> {
    const response = await this.organizationService.deleteOrganization(org_id);
    return response;
  }
}
