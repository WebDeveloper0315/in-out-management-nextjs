"use client";
import Image from "next/image";
import { Carousel,  Space, message, theme } from "antd";
import {
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { SetLoading } from "@/redux/loadersSlice";
import axios from "axios";
import type { CSSProperties } from 'react';
import { useState } from 'react';

const iconStyles: CSSProperties = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

export default function Login() {
  const dispatch = useDispatch()
  const router = useRouter()

  const { token } = theme.useToken();
  
  const onFinish = async (values: any) => {
    console.log(values);
    try {

      dispatch(SetLoading(true))
      const response = await axios.post("/api/users/login", values)
      message.success(response.data.message);
      router.push("/")
    } catch (error: any) {
      message.error(error.response.data.message || "Something went wrong")
    } finally {
      dispatch(SetLoading(false));
    }
  }
  return (
    <ProConfigProvider dark>
      <div
          style={{
            backgroundColor:  token.colorBgContainer,
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

          }}
        >
          <LoginFormPage
            onFinish={onFinish}
            submitter={{
              searchConfig: {
                submitText: 'Login', // Customize the submit button text
              },
            }}
            // backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
            logo="/Assets/Image/logo.svg"
            
            backgroundVideoUrl="/Assets/Background/logo.mp4"
            
            containerStyle={{
              position: 'absolute', // Adjust the position of the login form
              top: '50%', // Example: move the form to the center vertically
              left: '50%', // Example: move the form to the center horizontally
              transform: 'translate(-50%, -50%)', // Center the form horizontally and vertically
              backgroundColor: 'rgba(0, 0, 0,0.65)',
              backdropFilter: 'blur(4px)',
            }}
            subTitle="In-Out Management: Login"
            
          >
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <ProFormText
              name="name"
              fieldProps={{
                size: 'large',
                prefix: (
                  <UserOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              placeholder={'用户名: admin or user'}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              placeholder={'密码: ant.design'}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
            </Space>
            <div
              style={{
                marginBlockEnd: 24,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                Remember Me!
              </ProFormCheckbox>
              {/* <a
                style={{
                  float: 'right',
                }}
              >
                忘记密码
              </a> */}
            </div>
          </LoginFormPage>
        </div>
    </ProConfigProvider>
    
  );
}
