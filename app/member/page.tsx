"use client";
import PageTitle from "@/components/PageTitle";
import React, {useRef, useEffect, useState } from "react";
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
} from "antd";
import { CloseOutlined, InboxOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import ImgCrop from "antd-img-crop";
import html2canvas from "html2canvas";
import locale from 'antd/locale/ko_KR';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko_KR');

const { Option } = Select;
const { Dragger } = Upload;

interface userTableDataItem {
  no: number;
  name: string;
  id: string;
  password: string;
  role: string;
  dob: Date;
  gender: string;
  image: string;
}

const customLocale = {
  lang: {
    placeholder: 'Please select', // Customize the placeholder text
    year: 'Custom Year',
    month: 'Custom Month',
    day: 'Custom Day',
    dateFormat: 'YYYY年MM月DD日', // Customize the date format
    timeFormat: 'HH:mm', // Customize the time format
    dateTimeFormat: 'YYYY年MM月DD日 HH:mm', // Customize the date and time format
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

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <Avatar src={<img src={`${image}`} alt="User Image" />} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "DOB",
      dataIndex: "dob",
      key: "dob",
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  const showModal = () => {
    setOpen(true);
    startCameraStream();
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    stopCameraStream();
  };

  const handleFileChange = (file: File) => {
    setUserAvatarImage(URL.createObjectURL(file));
  };


  console.log("camera", cameraOn)
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
  };

  const captureImage = async () => {

    const video = document.getElementById('video') as HTMLVideoElement;
    //const video = videoRef.current!;

    console.log("video", video);
    // console.log("video width", video?.videoHeight);
    
    if (video) {
      const canvas = await html2canvas(video);
    // const canvas = document.createElement('canvas');
    // canvas.width = video.videoWidth || 0;
    // canvas.height = video.videoHeight || 0;
    const ctx = canvas.getContext('2d');
  
    if (ctx ) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL('image/png');
      setUserAvatarImage(imageUrl);
      setCapturing(false);
    }
  }
  };

  const handleCaptureImage = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      const photoButton = document.createElement("button");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Display video stream in the document
      video.srcObject = stream;
      video.play();

      // Create a button to capture a photo
      photoButton.textContent = "Take Photo";
      document.body.appendChild(video);
      document.body.appendChild(photoButton);

      // On click, capture the video frame as an image
      photoButton.addEventListener("click", () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the captured frame to a data URL
        const capturedImage = canvas.toDataURL("image/png");

        // Set the captured image as the userAvatarImage state
        setUserAvatarImage(capturedImage);

        // Clean up by stopping the video stream and removing elements from the document
        stream.getTracks().forEach((track) => track.stop());
        document.body.removeChild(video);
        document.body.removeChild(photoButton);
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const getDatafromDatabase = async () => {
    try {
      const response = await axios.get(`api/member`);
      const userData = response.data?.data?.userTableData;
      console.log(response.data?.data);
      setUserTableData(userData);
    } catch (error: any) {
      message.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getDatafromDatabase();
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
      >
        <Form form={form} layout="vertical">
          {videoStream && cameraOn && (
            <Form.Item name="camera" label="Camera">
            <video id="video"
              // ref={videoRef}
              ref={(video) => {
                if (video) {
                  video.srcObject = videoStream;
                  video.style.transform = 'scaleX(-1)';
                }
              }}
              autoPlay
              playsInline
              style={{ width: '100%' }}
            ></video>
            <Flex justify="space-around">
            <Button key="capture" type="primary" onClick={captureImage}>
            Capture
          </Button>
          <Button key="cancel" onClick={stopCameraStream}>
            Cancel
          </Button>
          </Flex>
            </Form.Item>
            
          )}
          <Form.Item name="image" label="Image">
            {userAvatarImage ? (
              <div>
                <Avatar
                  src={userAvatarImage}
                  alt="User Image"
                  size={64}
                />
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
                    } else {
                      handleCaptureImage();
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
              <Button type="primary" name="Camera" onClick={()=>{setCameraOn(!cameraOn)}} > Camera </Button>
              </div>
            )}
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input />
          </Form.Item>
          <ConfigProvider locale={{ ...locale, ...customLocale }}>
          <Form.Item
            name="dob"
            label="DOB"
            rules={[
              { required: true, message: "Please select the date of birth" },
            ]}
          >
            <DatePicker />
          </Form.Item>
          </ConfigProvider>
          <Form.Item
            name="id"
            label="ID"
            rules={[{ required: true, message: "Please enter the ID" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select the role" }]}
          >
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
