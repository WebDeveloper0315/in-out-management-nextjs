"use client";
import PageTitle from "@/components/PageTitle";
import React, { useRef, useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Avatar,
  message,
  Image,
  Flex,
  ConfigProvider,
  Switch,
  Popconfirm,
} from "antd";
import {
  CloseOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  InboxOutlined,
  PlusOutlined,
  EditOutlined, DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import ImgCrop from "antd-img-crop";
import html2canvas from "html2canvas";
import locale from "antd/locale/en_US";
import dayjs from "dayjs";
import "dayjs/locale/en";
dayjs.locale("en_US");
import moment from 'moment';
import { NextResponse } from "next/server";


const { Option } = Select;
const { Dragger } = Upload;

interface userTableDataItem {
  key: string,
  no: number;
  name: string;
  id: string;
  password: string;
  role: string;
  birth: String;
  gender: string;
  image: string;
}

const customLocale = {
  lang: {
    placeholder: "Please select", 
    year: "Custom Year",
    month: "Custom Month",
    day: "Custom Day",
    dateFormat: "YYYY年MM月DD日",
    timeFormat: "HH:mm", 
    dateTimeFormat: "YYYY年MM月DD日 HH:mm", 
  },
};

export default function Member() {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userTableData, setUserTableData] = useState<userTableDataItem[]>([]);
  const [userAvatarImage, setUserAvatarImage] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  // const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [capturing, setCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraChecked, setCameraChecked] = useState(false);

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (image: string) => (
        <Avatar src={<img src={`${image}`} alt="User Image" />} />
      ),
      
    },
    {
      title: "Name",
      dataIndex: "name",
      
    },
    {
      title: "Gender",
      dataIndex: "gender",
      
    },
    {
      title: "Birth",
      dataIndex: "birth",
    },
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: string, record: any) => (
        <div>
          <Button type="primary" onClick={() => handleEdit(record)} style={{ marginRight: '8px' }} ><EditOutlined /></Button>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)} okText="Yes" cancelText="No">
            <Button danger ><DeleteOutlined /></Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleEdit = (record: any) => {
    form.setFieldsValue({
      name: record.name, 
      birth: dayjs(record.birth), 
      gender: record.gender,
      id: record.id, 
      password: '',
      confirmpassword: '',
      role: record.role, 
      key: record.key,
    });
    if(record.image){
      setUserAvatarImage(record.image)
    }
    setOpen(true)
  };
  
  // Function to handle the delete action
  const handleDelete = async (id: any) => {
    try {
      const response = await axios.post(`/api/member?delete=${id}`);
      message.success(response.data.message);
    } catch (error: any) {
      message.error('Error deleting form data:');
    }
    
  };

  const showModal = () => {
    form.setFieldsValue({
      name: '', 
      birht: null, 
      id: '', 
      password: '',
      confirmpassword: '',
      role: undefined, 
      key:'',
    });
    setUserAvatarImage(null);

    setOpen(true);
    stopCameraStream();
    // setCameraChecked(false);
  };

  const getImageFileFromRoute = (imageRoute: string): Promise<File> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function() {
        const blob = xhr.response;
        const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
        resolve(file);
      };
      xhr.open('GET', imageRoute);
      xhr.send();
    });
  };

  const handleFormSubmit = async () => {
    try {

      const formData = form.getFieldsValue(); 
    
      const isExist = await axios.get(
        `/api/users/register?userId=${formData.id}`
      )

      if(isExist.status === 200 ) {
        let finalFilePath = "Avatars/user_man.png"
        if(userAvatarImage !== null) {
          const formValue = new FormData()
          const imageRoute: string = userAvatarImage as string;
          const imageFile = await getImageFileFromRoute(imageRoute);
          formValue.append("image", imageFile)
          const resImage = await axios.post("/api/image", formValue)

          if(resImage.status === 201) {
            finalFilePath = resImage.data.filename;
          }
        }
        formData.imagePath = finalFilePath

        formData.birth = formData.birth.format("YYYY-MM-DD").toString()
        let response
        if(formData.key === ''){
          response = await axios.post("/api/users/register", formData);
        } else {
          response = await axios.post(`/api/member?edit=${formData.key}`, formData)
        }
        
        getDatafromDatabase();
        
      }
  
      form.resetFields();
    } catch (error: any) {
      // Handle any errors that occur during the form submission
      console.error('Error registering form data:', error);
    }
  };
  

  const handleOk = async () => {
    try {
      
      setConfirmLoading(true)
      await handleFormSubmit();
      
      setOpen(false);
      message.success("Saved the data to Database")
    } catch (error: any) {
      message.error("Error saving the data to database")
    } finally {
      setConfirmLoading(false)
      
      stopCameraStream();
    }
    
    
  };

  const handleCancel = () => {
    setOpen(false);
    stopCameraStream();
    // setCameraChecked(false);
  };

  const handleFileChange = (file: File) => {
    setUserAvatarImage(URL.createObjectURL(file));
  };

  console.log("camera", cameraOn);

  const onCameraStateChange = (checked: boolean) => {
    setCameraChecked(checked);
    if (checked) {
      startCameraStream();
    } else {
      stopCameraStream();
    }
  };

  useEffect(() => {
    return () => {
      // Clean up video stream when component is unmounted
      if (videoStream) {
        videoStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [videoStream]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      video.srcObject = videoStream;
    } else if (video) {
      video.srcObject = new MediaStream();
    }
  }, [videoStream]);

  const startCameraStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      setCameraStream(stream);
      setVideoStream(stream);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // Function to stop the camera stream
  const stopCameraStream = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => {
        track.stop();
      });
      setVideoStream(null);
    }
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setCameraChecked(false);
  };

  const captureImage = async () => {
    const video = document.getElementById("video") as HTMLVideoElement;

    if (video) {
      const canvas = await html2canvas(video);
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL("image/png");
        setUserAvatarImage(imageUrl);
        setCapturing(false);
        stopCameraStream();
      }
    }
  };

  const getDatafromDatabase = async () => {
    try {
      const response = await axios.post("/api/member?getData=1");
      const userData = response.data?.data?.userTableData;
      console.log('response.data?.data', response.data?.data);
      setUserTableData(userData);
    } catch (error: any) {
      message.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getDatafromDatabase();

    const interval = setInterval(() => {
      getDatafromDatabase();
    }, 5000);
  
    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <PageTitle title="Member Management" />
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Add New
      </Button>
      <Table
        columns={columns}
        dataSource={userTableData}
        locale={{
          emptyText: "There is no data to display",
        }}
      />

      <Modal
        title="Add New Member"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        okText="COK"
        cancelText="CCancel"
      >
        <Form form={form} layout="vertical">
          {videoStream && (
            <Form.Item name="camera" label="Camera">
              <video
                id="video"
                // ref={videoRef}
                ref={(video) => {
                  if (video) {
                    video.srcObject = videoStream;
                    video.style.transform = "scaleX(-1)";
                  }
                }}
                autoPlay
                playsInline
                style={{ width: "100%" }}
              ></video>
              <Flex justify="space-around">
                <Button key="capture" type="primary" onClick={captureImage}>
                  Capture
                </Button>
                <Button key="cancel" onClick={stopCameraStream}>
                  Close
                </Button>
              </Flex>
            </Form.Item>
          )}
          <Form.Item name="image" label="Image">
            {userAvatarImage ? (
              <div>
                <Avatar src={userAvatarImage} alt="User Image" size={64} />
                <Button
                  type="primary"
                  shape="circle"
                  size="small"
                  icon={<CloseOutlined />}
                  className="button-badge"
                  onClick={() => {
                    setUserAvatarImage(null);
                  }}
                />
              </div>
            ) : (
              <div>
                <ImgCrop
                  rotationSlider
                  modalTitle="Custom Title"
                  modalCancel="CANCEL"
                  modalOk="OKOK"
                >
                  <Dragger
                    accept=".png,.jpg,.jpeg"
                    beforeUpload={(file) => {
                      if (file instanceof File) {
                        handleFileChange(file);
                      }
                      return false; // Prevent default upload behavior
                    }}
                    showUploadList={false}
                  >
                    <div>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">Click or drag to upload</p>
                    </div>
                  </Dragger>
                </ImgCrop>
                <div className="mt-2">
                  <Switch
                    checkedChildren="Open"
                    unCheckedChildren="Close"
                    onChange={onCameraStateChange}
                    checked={cameraChecked}
                  />
                  <span>&nbsp;Camera</span>
                </div>
              </div>
            )}
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input placeholder="Please enter the name"/>
          </Form.Item>
          <ConfigProvider locale={{ ...locale, ...customLocale }}>
            <Form.Item
              name="birth"
              label="Birth"
              rules={[
                { required: true, message: "Please select the date of birth" },
              ]}
            >
              <DatePicker placeholder="Date"/>
            </Form.Item>
          </ConfigProvider>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please enter the Gender" }]}
          >
            <Select placeholder="Select the role">
              <Option value="true">Man</Option>
              <Option value="false">Woman</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="id"
            label="ID"
            rules={[{ required: true, message: "Please enter the ID" }]}
          >
            <Input placeholder="Please enter the id"/>
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Please enter the password" }]}
          >
            <Input.Password
              placeholder="input password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item
            name="confirmpassword"
            label="Confirm Password"
            style={{ marginBottom: 0 }}
            rules={[
              { required: true, message: "Please confirm the password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("The two passwords do not match");
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="input password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select the role" }]}
          >
            <Select placeholder="Select the role">
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="key"
            label="key"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
