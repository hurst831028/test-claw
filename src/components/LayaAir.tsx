import { type FC, useRef, useEffect, useState } from 'react';
import { useLaunchParams, miniApp, useSignal, viewport } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import copy from 'copy-to-clipboard';

//import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';

const appUrl = "https://t.me/my_dev01_bot/miniapp?startapp="
const apiUrl = "https://seed-test.9x9168.com:9100/"

export const LayaAir: FC = () => {
    const lp = useLaunchParams();
    const isDark = useSignal(miniApp.isDark);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    //const viewport = viewport();  
    //const canvasWidth = viewport?.width;
    //const canvasHeight = viewport?.height;

    // 使用 state 来动态存储 canvas 的宽高
    const [canvasWidth, setCanvasWidth] = useState<number>(window.innerWidth);
    const [canvasHeight, setCanvasHeight] = useState<number>(window.innerHeight);

    useEffect(() => {

        //miniApp.setBgColor('#000000');
        miniApp.setHeaderColor('#000000');
        miniApp.ready()

        //mainButton.hide();

        // closingBehavior.enableConfirmation();

        // let progress = 0;  
        // const interval = setInterval(() => {  
        //     progress += 0.1;  
        //     setLoadingProgression(progress);  
        //     if (progress >= 1) {  
        //         setIsLoaded(true);  
        //         clearInterval(interval);  
        //     }  
        // }, 100); 

        const sendMessageToGame = (message: any) => {
            if (iframeRef.current && iframeRef.current.contentWindow && iframeRef.current.contentWindow.postMessage) {
                iframeRef.current.contentWindow.postMessage(message, '*'); // 第二个参数是目标源，'*'表示不限制源，但在生产环境中应该替换为允许的源列表  
            }
        };

        const copyURL = (message: any) => {
            copy(message);
        };

        // 设置消息监听器  
        function handleMessage(event: MessageEvent) {

            // if (event.origin !== 'https://hurst831028.github.io/test-claw/') {  
            //     console.log('GAME_LOG: not support!', event.origin);
            //     return;  
            // }  

            // 处理接收到的消息  
            const message = event.data;
            // 根据消息类型执行相应的操作
            if (message.type === 'GAME_EVENT') {
                switch (message.data.handle) {
                    case 'GAME_READY': {
                        //console.log('GAME_READY:', message);
                        const message2 = {
                            type: 'REACT_MESSAGE',
                            data: {
                                handle: "GAME_READY",
                                initDataRaw: lp.initDataRaw,
                                startParam: lp.startParam,
                                platform: lp.platform,
                                version: lp.version,
                                baseUrl: apiUrl,
                                theme: lp.themeParams.bg_color,
                                color: lp.themeParams.text_color,
                                lang: lp.themeParams.language,
                            }
                        };
                        sendMessageToGame(message2);
                        break;
                    }

                    case 'COPY_URL': {
                        copyURL(appUrl + message.data.digitalId);
                        const message2 = {
                            type: 'REACT_MESSAGE',
                            data: {
                                handle: "COPYED",
                            }
                        };
                        sendMessageToGame(message2);
                        break;
                    }
                    default:
                        break;
                }

                // Handle Event
                // console.log('Received message from iframe:', message);  
                // console.log('event.origin:', event.origin); 

                // const message2 = { type: 'REACT_MESSAGE', data: { 369:369 } };  
                // sendMessageToGame(message2);  

            } else if (message.type === 'GAME_LOG') {
                console.log('GAME_LOG:', message.data.message);
            }
        }

        // addEventListener to window object  
        window.addEventListener('message', handleMessage, false);

        // const removeListener = on('viewport_changed', payload => {
        //     //console.log('Viewport changed:', payload);
        // });

        // 清理函数，用于组件卸载时移除事件监听器  
        return () => {
            window.removeEventListener('message', handleMessage);
            //removeListener();
        };
    }, []);

    useEffect(() => {
        if (viewport) {
            viewport.expand();
        } else {
            //console.log("viewport is null");
        }
    }, [viewport]); // 依赖 viewport  

    useEffect(() => {
        // 监听窗口大小变化，更新 canvasWidth 和 canvasHeight
        const handleResize = () => {
            setCanvasWidth(window.innerWidth);
            setCanvasHeight(window.innerHeight);
        };

        // 组件挂载时添加监听
        window.addEventListener('resize', handleResize);

        // 组件卸载时移除监听
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <AppRoot
            appearance={isDark ? 'dark' : 'light'}
            platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
        >
            <div>
                <iframe
                    ref={iframeRef}
                    src="build/web/index.html"
                    width={`${canvasWidth}px`}
                    height={`${canvasHeight}px`}
                    allowFullScreen
                />
            </div>
        </AppRoot>
    );
}


