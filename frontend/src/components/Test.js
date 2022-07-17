import React from 'react'

export default function Test() {
    const token = localStorage.getItem("token")
    console.log(token);
  return (
    <div>Test</div>
  )
}
