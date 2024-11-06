import { type FC, useRef, useEffect, useState } from 'react';  
import { useLaunchParams, miniApp, useSignal, viewport } from '@telegram-apps/sdk-react';
import { AppRoot} from '@telegram-apps/telegram-ui';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';

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
                    src="/build/web/index.html"  
                    width={`${canvasWidth}px`}
                    height={`${canvasHeight}px`}
                    frameBorder="0"  
                    allowFullScreen  
                />  
            </div>
        </AppRoot>
    );
}


