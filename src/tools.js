import fa_comment from "@fortawesome/fontawesome-free/svgs/solid/comment.svg";
import fa_user_circle from "@fortawesome/fontawesome-free/svgs/solid/circle-user.svg";
import fa_camera_retro from "@fortawesome/fontawesome-free/svgs/solid/camera-retro.svg";
import fa_xmark from "@fortawesome/fontawesome-free/svgs/solid/xmark.svg";

import showMessage from "./message.js";

// ==================== 一言功能 ====================
async function showHitokoto() {
    try {
        const response = await fetch("https://v1.hitokoto.cn");
        const result = await response.json();
        const hitokotoText = result.hitokoto; // 一言内容
        const sourceText = `这句一言来自 <span>「${result.from}」</span>，投稿者 <span>${result.creator}</span>`;
        
        // 显示一言
        showMessage(hitokotoText, 6000, 9);
        
        // 延迟显示来源
        setTimeout(() => {
            showMessage(sourceText, 4000, 9);
        }, 6000);
    } catch (err) {
        console.error("获取 hitokoto 出错：", err);
        showMessage("获取一言失败了QAQ", 4000, 9);
    }
}

// ==================== 工具栏按钮 ====================
const tools = {
    // 一言按钮
    "hitokoto": {
        icon: fa_comment,
        callback: showHitokoto
    },

    // 拍照按钮
    "photo": {
        icon: fa_camera_retro,
        callback: () => {
            // 显示提示
            showMessage("照好了嘛，是不是很可爱呢？", 6000, 9);
            // 截图逻辑
            Live2D.captureName = "photo.png";
            Live2D.captureFrame = true;
        }
    },

    // 切换模型按钮
    "switch-model": {
        icon: fa_user_circle,
        callback: () => {
            const panel = document.getElementById("model-selection-panel");
            panel.style.display = panel.style.display === "none" ? "block" : "none";
        }
    },

    // 关闭按钮
    "quit": {
        icon: fa_xmark,
        callback: () => {
            localStorage.setItem("waifu-display", Date.now());
            document.getElementById("waifu").style.bottom = "-500px";
            setTimeout(() => {
                document.getElementById("waifu-toggle").classList.add("waifu-toggle-active");
            }, 3000);
        }
    }
};

export default tools;
