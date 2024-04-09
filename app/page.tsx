'use client'
import React from 'react';
import { Breadcrumb, Statistic } from "antd";
import type { StatisticProps } from 'antd';
import PageTitle from "@/components/PageTitle";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarChart, faComment, faGlobe, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import CountUp from 'react-countup';

const formatter: StatisticProps['formatter'] = (value) => (
  <CountUp end={value as number} separator="," />
);

export default function Home() {

  
  return (
    <div>
      <PageTitle title='Dashboard' />
      <div className="flex flex-wrap -mx-4 ">
        <div className="w-full md:w-1/4 px-4 my-4">
          <a href="/stuffinout" className="bg-blue-500 text-white p-6 rounded-lg block shadow-md">
            <div className="text-3xl">
              <FontAwesomeIcon icon={faComment} />
            </div>
            <Statistic title="Employee-IO" value={10} formatter={formatter} />
          </a>
        </div>
        <div className="w-full md:w-1/4 px-4 my-4">
          <a href="#" className="bg-red-500 text-white p-6 rounded-lg block shadow-md">
            <div className="text-3xl">
              <FontAwesomeIcon icon={faBarChart} />
            </div>
            <Statistic title="Customer-IO" value={10} formatter={formatter} />
            
          </a>
        </div>
        <div className="w-full md:w-1/4 px-4 my-4">
          <a href="#" className="bg-green-500 text-white p-6 rounded-lg block shadow-md">
            <div className="text-3xl">
              <FontAwesomeIcon icon={faShoppingCart} />
            </div>
            <Statistic title="InCar-IO" value={10} formatter={formatter} />
            
          </a>
        </div>
        <div className="w-full md:w-1/4 px-4 my-4">
          <a href="#" className="bg-purple-500 text-white p-6 rounded-lg block shadow-md">
            <div className="text-3xl">
              <FontAwesomeIcon icon={faGlobe} />
            </div>
            <Statistic title="OutCar-IO" value={10} formatter={formatter} />
            
          </a>
        </div>
      </div>
    </div>
  )
}
