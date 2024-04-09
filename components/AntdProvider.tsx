"use client";
import React, { useEffect, useState } from "react";
import { ConfigProvider, Button, message, theme, Layout, Menu, Avatar, Flex, Dropdown, Space, Badge } from "antd";
import type { MenuProps } from 'antd';
import {
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SmileOutlined,
} from "@ant-design/icons";

import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SetCurrentUser } from "@/redux/userSlice";
import { setSelectedMenuItemKey} from "@/redux/menuSlice"
import Loader from "./Loader";
import { SetLoading } from "@/redux/loadersSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserShield, faTachometerAlt, faBuilding, faUsers, faUserCog, faExchange, faExchangeAlt, faWalking, faHandshake, faCarSide, faCar, faBus, faChartLine, faHistory, faDiagnoses, faCogs } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

const { Header, Sider, Content } = Layout;

type SideMenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  path?:React.ReactNode,
  children?: SideMenuItem[],
  type?: 'group',
): SideMenuItem {
  return {
    key,
    icon,
    children,
    path,
    label,
    type,
  } as SideMenuItem;
}

function AntdProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useSelector((state: any) => state.users);
  const { loading } = useSelector((state: any) => state.loaders);
  const { selectedMenuItemKey } = useSelector((state: any) => state.menus);
  const dispatch = useDispatch();
  const router = useRouter();

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          1st menu item
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item (disabled)
        </a>
      ),
      icon: <SmileOutlined />,
      disabled: true,
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          3rd menu item (disabled)
        </a>
      ),
      disabled: true,
    },
    {
      key: '4',
      danger: true,
      label: 'a danger item',
    },
  ];

  const [menuItems, setMenuItems] = useState<SideMenuItem[]>([]);

  const pathname = usePathname();

  const getCurrentUser = async () => {
    try {
      dispatch(SetLoading(true));

      const response = await axios.get("/api/users/currentuser");
      console.log(response.data.data);

      dispatch(SetCurrentUser(response.data.data));

      if(response.data.data.role === "superadmin")
      {
        setMenuItems([
          {
            label: "Dashboard",
            key: '1',
            icon: <FontAwesomeIcon icon={faTachometerAlt} />,
            path: "/"
          },
          {
            key: "group1",
            label: "Admin Task",
            icon: <FontAwesomeIcon icon={faUserCog} />,
            subItems : [
              {
                label: "Members",
                icon: <FontAwesomeIcon icon={faUserShield} />,
                key: '2',
                path: "/member"
              },
              {
                label: "Department",
                icon: <FontAwesomeIcon icon={faBuilding} />,
                key: '3',
                path: "/department"
              },
              {
                label: "Employee",
                icon: <FontAwesomeIcon icon={faUsers} />,
                key: '4',
                path: "/employee"
              },
            ]
          },
          {
            key: "group2",
            label: "Staff In-Out",
            icon: <FontAwesomeIcon icon={faExchangeAlt} />,
            subItems : [
              {
                label: "Employee In-Out",
                icon: <FontAwesomeIcon icon={faWalking} />,
                key: '5',
                path: "/stuffinout"
              },
              {
                label: "Customer In-Out",
                icon: <FontAwesomeIcon icon={faHandshake} />,
                key: '6',
                path: "/customerinout"
              },
            ]
          },
          {
            key: "group3",
            label: "Cars In-Out",
            icon: <FontAwesomeIcon icon={faCarSide} />,
            subItems : [
              {
                label: "InCar In-Out",
                icon: <FontAwesomeIcon icon={faCar} />,
                key: '7',
                path: "/incar"
              },
              {
                label: "OutCar In-Out",
                icon: <FontAwesomeIcon icon={faBus} />,
                key: '8',
                path: "/outcar"
              },
            ]
          },
          {
            key: "group4",
            label: "Statistics",
            icon: <FontAwesomeIcon icon={faChartLine} />,
            subItems : [
              {
                label: "History",
                icon: <FontAwesomeIcon icon={faHistory} />,
                key: '9',
                path: "/history"
              },
              {
                label: "Statistics",
                icon: <FontAwesomeIcon icon={faDiagnoses} />,
                key: '10',
                path: "/statistics"
              },
            ]
          },
          {
            label: "Settings",
            icon: <FontAwesomeIcon icon={faCogs} />,
            key: '11',
            path: "/settings"
          },

        ])
      }
      else 
      {
        setMenuItems([
          {
            label: "Dashboard",
            icon: <FontAwesomeIcon icon={faTachometerAlt} />,
            key: '1',
            path: "/"
          },
          {
            key: "group1",
            label: "Staff In-Out",
            icon: <FontAwesomeIcon icon={faExchangeAlt} />,
            subItems : [
              {
                label: "Employee In-Out",
                icon: <FontAwesomeIcon icon={faWalking} />,
                key: '2',
                path: "/stuff"
              },
              {
                label: "Customer In-Out",
                icon: <FontAwesomeIcon icon={faHandshake} />,
                key: '3',
                path: "/customer"
              },
            ]
          },
          {
            key: "group2",
            label: "Cars In-Out",
            icon: <FontAwesomeIcon icon={faCarSide} />,
            subItems : [
              {
                label: "InCar In-Out",
                icon: <FontAwesomeIcon icon={faCar} />,
                key: '4',
                path: "/incar"
              },
              {
                label: "OutCar In-Out",
                icon: <FontAwesomeIcon icon={faBus} />,
                key: '5',
                path: "/outcar"
              },
            ]
          },
          {
            label: "Settings",
            icon: <FontAwesomeIcon icon={faCogs} />,
            key: '6',
            path: "/settings"
          },

        ])
      }
    } catch (error: any) {
      router.push("/login");
      console.log(error);
      message.error(
        error.response.data.message || "Error during getting the current user",
      );
    } finally {
      dispatch(SetLoading(false));
    }
  };

  const [menuKey, setMenuKey] = useState<MenuProps['selectedKeys']>(['1']);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  
  useEffect(() => {
    if (pathname !== "/login" && pathname !== "/register" && !currentUser) {
      getCurrentUser();
    }
  }, [pathname]);

  useEffect(() => {
    
    if (!selectedMenuItemKey) {
      dispatch(setSelectedMenuItemKey('1'));
      router.push("/");
    }
  }, []);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: Date) => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleMenuItemClick = (itemKey: string) => {
    dispatch(setSelectedMenuItemKey(itemKey));
    setMenuKey([itemKey])
  }

  // console.log('selectedMenuItemKey', selectedMenuItemKey)

  const onLogout = async () => {
    try {
      dispatch(SetLoading(true));
      await axios.post("/api/users/logout");
      message.success("Logout Successfully.");
      dispatch(SetCurrentUser(null));
      router.push("/login");
    } catch (error: any) {
      message.error(error.response.data.message || "Error during logout");
    } finally {
      dispatch(SetLoading(false));
    }
  };

  const [collapsed, setCollapsed] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const {token} = theme.useToken();
  // console.log('token ', token)
  const renderMenuItems = (items: SideMenuItem[]) => {
    return items.map(item =>
      item?.subItems ? (
        <Menu.SubMenu key={item.key}  title={item.label} icon={item.icon}>
          {renderMenuItems(item.subItems)}
        </Menu.SubMenu>
      ) : (
        <Menu.Item key={item?.key} icon={item?.icon} onClick={() => (item?.path? router.push(item.path): item.path)}>
          {item?.label}
        </Menu.Item>
      )
    );
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 700) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
      if (window.innerWidth < 570) {
        setMinimized(true);
      } else {
        setMinimized(false);
      }
    };

    handleResize(); // Set initial state

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        components: {
          Button: {
            algorithm: true,
            controlHeight: 45,
          },
        },
      }}
    >
      {loading && <Loader />}

      {/* if route is login or register, don't show layout */}
      {pathname === "/login" || pathname === "/register" ? (
        <div>{children}</div>
      ) : (
        currentUser && (
          <Layout className="h-screen">
            <Sider trigger={null} collapsible collapsed={collapsed}>
              <div className="w-full h-16">
                {!collapsed && <Image
                  className="mx-auto flex text-center items-center"
                  src={{
                    src: "/Assets/Image/logo.svg",
                    width: 100, 
                    height: 64, 
                  }}
                  alt="Your Company"
                />}
                {collapsed && <div className="h-9 m-4 "></div>}
              </div>
            
              <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={selectedMenuItemKey}
                selectedKeys={selectedMenuItemKey}
                onSelect={(item) => handleMenuItemClick(item.key)}
                openKeys = {openKeys}
                onOpenChange={(keys) => setOpenKeys(keys)}
              >
                {renderMenuItems(menuItems)}
              </Menu>
            </Sider>
            <Layout>
              <Header style={{ padding: 0, }}>
                <Flex justify="space-between">
                  <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                      fontSize: '16px',
                      width: 64,
                      height: 64,
                    }}
                  />
                  <Flex justify="flex-end" align="center" >
                    {!minimized && <div style={{ fontFamily: 'LCD', fontSize: '40px' }} className="mr-6">
                      {formatTime(time)}
                    </div>}
                    <Dropdown menu={{items}} placement="bottomRight" arrow>
                      <a onClick={(e) => e.preventDefault()} className="flex items-center mr-6">
                        <Badge count={1}> 
                          <BellOutlined style={{ fontSize: '32px', color: token.colorTextLightSolid}} />
                        </Badge>
                      </a>
                    </Dropdown>
                    <Dropdown menu={{items}} placement="bottomRight">
                      <a onClick={(e) => e.preventDefault()} className="mr-12">
                        <Avatar style={{ marginRight: '5px' }} src={`/api/image?key=${currentUser?.image}`} size="large"/>
                        {!minimized && <span className="text-white">Hello? {currentUser?.name}</span>}
                      </a>
                    </Dropdown>
                  </Flex>
                </Flex>
              </Header>
              <Content
                style={{
                  
                  padding: 18,
                  minHeight: 280,
                  borderRadius: token.borderRadiusLG,
                  
                }}
              >
                {children}
              </Content>
            </Layout>
          </Layout>
          // <div className="layout-parent">
          //   <div
          //     className="relative flex h-full w-80 flex-col !border-r-small border-divider p-6 duration-1000 ease-in-out transition-width"
          //     style={{
          //       width: isSidebarExpanded ? "200px" : "auto",
          //     }}
          //   >
          //     <div className="logo">
          //       {isSidebarExpanded && <h1>Side Panel</h1>}
          //       {!isSidebarExpanded && (
          //         <FontAwesomeIcon
          //           icon={faBars}
          //           onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          //         />
          //       )}
          //       {isSidebarExpanded && (
          //         <FontAwesomeIcon
          //           icon={faCoffee}
          //           onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          //         />
          //       )}
          //     </div>

          //     <div className="menu-items">
          //       {menuItems.map((item, index) => {
          //         const isActive = pathname === item.path;
          //         return (
          //           <div
          //             className={`menu-item ${
          //               isActive ? "active-menu-item" : ""
          //             }`}
          //             style={{
          //               justifyContent: isSidebarExpanded
          //                 ? "flex-start"
          //                 : "center",
          //             }}
          //             key={index}
          //             onClick={() => router.push(item.path)}
          //           >
          //             <i className={item.icon}></i>
          //             <span>{isSidebarExpanded && item.name}</span>
          //           </div>
          //         );
          //       })}
          //     </div>

          //     <div className="user-info flex items-center justify-between">
          //       {isSidebarExpanded && (
          //         <div className="flex flex-col">
          //           <span>{currentUser?.name}</span>
          //         </div>
          //       )}
          //       <i className="ri-logout-box-r-line" onClick={onLogout}></i>
          //     </div>
          //   </div>
          //   <div className="body">{children}</div>
          // </div>
        )
      )}
      {/* {children} */}
    </ConfigProvider>
  );
}

export default AntdProvider;
