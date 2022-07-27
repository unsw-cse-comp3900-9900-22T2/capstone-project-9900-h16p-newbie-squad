import React from 'react'
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd';

export default function PriceSort({listings,setListings}) {
    const PriceLowToHigh = () => {
        setListings([...listings].sort((a,b) => {
            return a.price - b.price
        }))
    }
    const PriceHighToLow = () => {
        setListings([...listings].sort((a,b) => {
            return b.price - a.price
        }))
    }
    const onClick = ({key}) => {
        if (key === '0') {
            PriceLowToHigh()
            return 
        }
        if (key === '1') {
            PriceHighToLow()
            return
        }
    }
    const menu = (
        <Menu
        onClick={onClick}
          items={[
            {
              label: "low to high",
              key: '0',
            },
            {
              label: "high to low",
              key: '1',
            },
          ]}
        />
    );
  return (
    <div className='price-sort'>
        <Dropdown overlay={menu} trigger={['click']}>
        <a onClick={(e) => e.preventDefault()} style={{color: "#717171"}}>
            Sort price
        </a>
        </Dropdown>
    </div>
    
  )
}
