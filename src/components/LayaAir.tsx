import { 
    useViewport, 
    useMiniApp, 
    useMainButton, 
    bindMiniAppCSSVars, 
    bindThemeParamsCSSVars, 
    useThemeParams,
    on,
    initClosingBehavior
} from '@telegram-apps/sdk-react';  
import { type FC, useEffect, useRef, useState } from 'react';  
import { AppRoot } from '@telegram-apps/telegram-ui';  
  
export const LayaAir: FC = () => {  

    //Laya.Brower.window

    const viewport = useViewport();  
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const rootDivRef = useRef<HTMLDivElement>(null);
    const miniApp = useMiniApp();
    const mainButton = useMainButton();
    const themeParams = useThemeParams();
    const canvasWidth = viewport?.width;
    const canvasHeight = viewport?.height;
    const [isLoaded, setIsLoaded] = useState(false);  
    const [loadingProgression, setLoadingProgression] = useState(0); 
    const [closingBehavior] = initClosingBehavior();
    // 示例使用 useEffect 模拟加载进度  

    const sendMessageToGame = (message: any) => {  
        if (iframeRef.current && iframeRef.current.contentWindow && iframeRef.current.contentWindow.postMessage) {  
            iframeRef.current.contentWindow.postMessage(message, '*'); // 第二个参数是目标源，'*'表示不限制源，但在生产环境中应该替换为允许的源列表  
        }  
    };

    useEffect(() => {
        return bindMiniAppCSSVars(miniApp, themeParams);
    }, [miniApp, themeParams]);
    
    useEffect(() => {
        return bindThemeParamsCSSVars(themeParams);
    }, [themeParams]);

    useEffect(() => {  

        miniApp.setBgColor('#000000');
        miniApp.setHeaderColor('#000000');
        miniApp.ready()

        mainButton.hide();
        
        closingBehavior.enableConfirmation();

        let progress = 0;  
        const interval = setInterval(() => {  
            progress += 0.1;  
            setLoadingProgression(progress);  
            if (progress >= 1) {  
                setIsLoaded(true);  
                clearInterval(interval);  
            }  
        }, 100); 

        // 设置消息监听器  
        function handleMessage(event: MessageEvent) {  

            //if (event.origin !== 'http://your-layaair-game-origin.com') {  
            //  return;  
            //}  
        
            // 处理接收到的消息  
            const message = event.data;  
            // 根据消息类型执行相应的操作
            if (message.type === 'GAME_EVENT') {  
                // 处理游戏事件  
                console.log('Received message from iframe:', message);  
                console.log('event.origin:', event.origin); 

                const message2 = { type: 'REACT_MESSAGE', data: { 369:369 } };  
                sendMessageToGame(message2);  

            } else if (message.type === 'GAME_LOG') {
                console.log('GAME_LOG:', message);
            }
        }  
      
        // 添加消息监听器到 window 对象  
        window.addEventListener('message', handleMessage, false);  
        
        const removeListener = on('viewport_changed', payload => {
            console.log('Viewport changed:', payload);
        });

        // 清理函数，用于组件卸载时移除事件监听器  
        return () => {  
          window.removeEventListener('message', handleMessage);  
          removeListener();
        };  
    }, []); 

    useEffect(() => {  
        if (viewport) {  
            viewport.expand();
        } else {
            //console.log("viewport is null");
        }
    }, [viewport]); // 依赖 viewport  

    return (  
        <AppRoot>
        <div
            ref={rootDivRef}
            style={{
            width: canvasWidth,
            height: canvasHeight,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            }}
        >
            {!isLoaded ? (
            <div
                style={{
                width: canvasWidth,
                height: canvasHeight,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: 'rgba(0, 0, 0, 1)',
                }}
            >
                <img src="./loading-web.png"
                alt="Loading"  
                style={{  
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    //marginBottom: '20px',
                }}  
                />
                <p  
                style={{  
                    position: 'absolute',  
                    fontFamily: 'LanaPixel',  
                    fontSize: '38px',  
                    color: 'white',   
                    //textShadow: '2px 2px 4px #000000',
                }}  
                >  
                loading...{Math.round(loadingProgression * 100)}%  
                </p> 
                
                <img src="./buttons/telegram.png"
                alt="Loading"  
                style={{  
                    width: 'auto',  
                    height: 'auto',  
                    maxWidth: '100%',  
                    maxHeight: '100%',  
                    position: 'absolute',  
                    bottom: '100px',
                    left: 'calc(50% - 100px)', 
                    transform: 'translateX(-50%)',
                }}  
                //onClick={handleTelegramClick}
                />

                <img src="./buttons/x.png"
                alt="Loading"  
                style={{  
                    width: 'auto',  
                    height: 'auto',  
                    maxWidth: '100%',  
                    maxHeight: '100%',  
                    position: 'absolute',  
                    bottom: '100px', 
                    left: 'calc(50%)',   
                    transform: 'translateX(-50%)',
                }}
                //onClick={handleXClick}
                />

                <img src="./buttons/youtube.png"
                alt="Loading"  
                style={{  
                    width: 'auto',  
                    height: 'auto',  
                    maxWidth: '100%',  
                    maxHeight: '100%',  
                    position: 'absolute',  
                    bottom: '100px', 
                    left: 'calc(50% + 100px)',
                    transform: 'translateX(-50%)',
                }}
                //onClick={handleYoutubeClick}  
                />

                <p  
                style={{  
                    position: 'absolute',  
                    bottom: '5px', // Adjust this value to move the version number up or down  
                    width: '100%',  
                    textAlign: 'center',  
                    fontFamily: 'LanaPixel',  
                    fontSize: '16px',  
                    color: 'white',  
                }}  
                >  
                Version 0.0.6  
                </p>
            </div>
            ) : null}
                <iframe  
                    ref={iframeRef}  
                    src="/build/web/index.html"  
                    width={`${canvasWidth}px`}
                    height={`${canvasHeight}px`}
                    frameBorder="0"  
                    allowFullScreen  
                />  
            </div>
        </AppRoot>
    );  
};