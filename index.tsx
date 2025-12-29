
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("好享省 App 正在启动...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("找不到 root 挂载点");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("好享省 App 挂载成功");
} catch (error) {
  console.error("渲染出错:", error);
}
