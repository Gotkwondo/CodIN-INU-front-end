export {}; // 글로벌 모듈 확장을 위해 필요함

declare global {
    interface Window {
        ReactNativeWebView?: {
            postMessage: (message: string) => void;
        };
    }
}
