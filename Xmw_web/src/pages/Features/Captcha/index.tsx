/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-10-10 13:47:25
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-10-11 15:23:48
 * @Description: 验证码
 */
import { PageContainer, PageHeader, ProCard } from '@ant-design/pro-components'
import { useIntl } from '@umijs/max';
import { App, Button, Card, Col, Input, Row, Space } from 'antd';
import { toNumber } from 'lodash-es';
import { createRef, FC, useState } from 'react';

import { formatPerfix } from '@/utils';
import { ROUTES } from '@/utils/enums'

import DragCaptcha, { type DragCaptchaRef } from './components/DragCaptcha'; // 滑块验证码
import GraphicCaptcha, { type GraphicCaptchaRef } from './components/GraphicCaptcha'; // 图形验证码
import OperationCaptcha, { type OperationCaptchaRef } from './components/OperationCaptcha'; // 运算验证码

const { Search } = Input;

const Captcha: FC = () => {
  const { message } = App.useApp();
  const { formatMessage } = useIntl(); // 国际化工具
  const [graphicInput, setGraphicInput] = useState(''); // 图形验证码输入的值
  const [operationInput, setOperationInput] = useState(''); // 运算验证码输入的值

  // 国际化
  const renderMessage = (field: string) => formatMessage({ id: formatPerfix(ROUTES.CAPTCHA, field) });

  // 图形验证码
  const graphicCaptchaRef = createRef<GraphicCaptchaRef>();

  // 运算验证码
  const operationCaptchaRef = createRef<OperationCaptchaRef>();

  // 滑块验证码
  const dragCaptchaRef = createRef<DragCaptchaRef>();

  // 验证判断
  const validateCaptcha = (empty: boolean, success: boolean) => {
    if (empty) {
      message.warning(renderMessage('placeholder'))
    } else if (success) {
      message.success(renderMessage('success'));
    } else {
      message.error(renderMessage('error'));
    }
  }

  // 验证图形验证码
  const checkGraphicCaptcha = () => {
    if (graphicCaptchaRef.current) {
      validateCaptcha(
        !graphicInput,
        graphicCaptchaRef.current.identifyCode.toLowerCase() === graphicInput.toLowerCase(),
      )
    }
  }

  // 验证运算验证码
  const checkOperationCaptcha = () => {
    if (operationCaptchaRef.current) {
      validateCaptcha(!operationInput, toNumber(operationCaptchaRef.current.result) === toNumber(operationInput))
    }
  }

  // 重置滑块验证码
  const resetDragCaptcha = () => {
    dragCaptchaRef?.current?.reset();
  }

  // 滑块验证码成功回调
  const onDragCaptchaSuccess = (seconds: number) => {
    message.success(formatMessage({ id: formatPerfix(ROUTES.CAPTCHA, 'dragCodeSuccess') }, { seconds }))
  }
  return (
    <PageContainer header={{ title: null }}>
      <ProCard bodyStyle={{ padding: '10px 10px 20px 10px' }}>
        <PageHeader title={formatMessage({ id: formatPerfix(ROUTES.CAPTCHA, '', true) })}>
          {renderMessage('subTitle')}
        </PageHeader>
      </ProCard>
      <Row style={{ marginTop: 20 }} gutter={[20, 20]}>
        {/* 图形验证码 */}
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <Card title={renderMessage('graphicCaptcha')}>
            <Space direction="vertical" style={{ display: 'flex' }}>
              <Row justify='center'>
                <GraphicCaptcha
                  onRef={graphicCaptchaRef}
                  contentWidth={160}
                  contentHeight={40}
                  backgroundColorMin={0}
                  backgroundColorMax={255}
                />
              </Row>
              <Search
                placeholder={renderMessage('placeholder')}
                enterButton={renderMessage('verify')}
                value={graphicInput}
                onSearch={checkGraphicCaptcha}
                onChange={(e) => setGraphicInput(e.target.value)}
              />
            </Space>
          </Card>
        </Col>
        {/* 运算验证码 */}
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <Card title={renderMessage('operationCaptcha')}>
            <Space direction="vertical" style={{ display: 'flex' }}>
              <Row justify='center'>
                <OperationCaptcha
                  onRef={operationCaptchaRef}
                  width={160}
                  height={40}
                />
              </Row>
              <Search
                placeholder={renderMessage('placeholder')}
                enterButton={renderMessage('verify')}
                value={operationInput}
                onSearch={checkOperationCaptcha}
                onChange={(e) => setOperationInput(e.target.value)}
              />
            </Space>
          </Card>
        </Col>
        {/* 滑块验证码 */}
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <Card title={renderMessage('dragCaptcha')}>
            <Space direction="vertical" style={{ display: 'flex' }}>
              <Row justify='center'>
                <DragCaptcha onRef={dragCaptchaRef} passSuccess={onDragCaptchaSuccess} />
              </Row>
              <div>
                <Button
                  type="primary"
                  block onClick={resetDragCaptcha}
                >
                  {renderMessage('reset')}
                </Button>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  )
}
export default Captcha;
