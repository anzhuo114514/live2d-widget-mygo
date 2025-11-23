// 获取当前 script 地址
const currentScriptSrc = document.currentScript.src;
const live2d_path = currentScriptSrc.substring(0, currentScriptSrc.lastIndexOf('/') + 1);

// 解析 URL 参数
const params = new URL(currentScriptSrc).searchParams;
const live2dConfig = {
  width_limit: params.get('width_limit') || 768,
  position: ['left', 'right'].includes(params.get('position')) ? params.get('position') : 'left',
  preload: ['ALL', 'IDLE', 'NONE'].includes(params.get('preload')) ? params.get('preload') : 'IDLE',
};

// 异步加载 CSS/JS
function loadExternalResource(url, type) {
  return new Promise((resolve, reject) => {
    let tag;
    if (type === 'css') {
      tag = document.createElement('link');
      tag.rel = 'stylesheet';
      tag.href = url;
    } else if (type === 'js') {
      tag = document.createElement('script');
      tag.src = url;
    }
    if (tag) {
      tag.onload = () => resolve(url);
      tag.onerror = () => reject(url);
      document.head.appendChild(tag);
    }
  });
}

// 如果屏幕足够宽才加载
if (screen.width >= live2dConfig.width_limit) {
  Promise.all([
    loadExternalResource(live2d_path + 'waifu.css', 'css'),
    loadExternalResource(live2d_path + 'live2d.min.js', 'js')
  ]).then(() => {
    loadExternalResource(live2d_path + 'index.js', 'js').then(() => {

      // 如果位置在右边，修改 CSS
      if (live2dConfig.position === 'right') {
        const sheet = Array.from(document.styleSheets).find(
          s => s.href && s.href.includes(live2d_path + 'waifu.css')
        );
        if (sheet) {
          try {
            for (let rule of sheet.cssRules) {
              if (!rule.style) continue;
              if (rule.selectorText === '#waifu-toggle') {
                if (rule.style.left) { rule.style.right = rule.style.left; rule.style.removeProperty('left'); }
                if (rule.style.marginLeft) { rule.style.marginRight = rule.style.marginLeft; rule.style.removeProperty('margin-left'); }
              }
              if (rule.selectorText === '#waifu') {
                if (rule.style.left) { rule.style.right = rule.style.left; rule.style.removeProperty('left'); }
              }
              if (rule.selectorText === '#waifu-tips') {
                if (rule.style.left) { rule.style.right = rule.style.left; rule.style.removeProperty('left'); }
              }
              if (rule.selectorText === '#waifu-tool') {
                if (rule.style.right) { rule.style.left = rule.style.right; rule.style.removeProperty('right'); }
              }
            }
          } catch(e) { console.warn(e); }
        }
      }

      // 初始化 Widget，确保显示四个工具
      initWidget({
        cdnPath: live2d_path,
        preload: live2dConfig.preload,
        tools: ['hitokoto', 'photo', 'switch-model', 'quit'],
      });

      // ==================== 控制台 ASCII LOGO ====================
      console.log(`
               .::.    .:::::.   :-------.
           .:=-:..-=.:-:    .=:  .::::-:        .      :-.:-:
         :=-:      ==:      .=-.--. .-      .::-==    -:.=:
       :==.       -==       -==-.   .:::. .-. ..-=:.--.--.-:
     .==:       .===-      -==:.- .-:   .--::.  -: -:.-..-    -:
    :=-         ====   :=:   :=:.-=-::=--:     -: - .: :. :.:- 
   -=:          .::   :=  .-==:-=:.   =:-:  .--..: :  : :: ..
 .==:                 ==-::--:-=.   .-:  :--:. .     . :  .
.==:                   .:-=: .=-  .:-.        .    ...
-=:                 .:: :-   :====-.                 .
                  ::. .=:      .
                ::   -:
              ::   :-.
             -. .--.
            .===-.
      `);

    });
  });
}
